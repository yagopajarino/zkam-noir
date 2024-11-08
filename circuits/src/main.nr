fn main(image: [Field; 10000 * 4], hash_indexes: [Field; 256]) {
    assert(hash_indexes.len() == 256);
    assert(image[0] == 15);

    let mut image_to_hash = [0 as u8; 10000 * 4];
    for i in 0..10000 * 4 {
        image_to_hash[i] = image[i] as u8;
    }

    let mut hash = [0 as u8; 256];
    for i in 0..256 {
        hash[i] = image[hash_indexes[i] + 3] as u8 & 1 as u8;
        image_to_hash[i + 3] = 255;
        println(hash[i]);
    }

    let mut bytes = [0; 10000 * 4];
    for i in 0..image_to_hash.len() {
        bytes[i] = image_to_hash[i] as u8;
    }

    let calculated_hash = std::hash::sha256(bytes);

    let mut binary_hash = [0; 256];
    for i in 0..32 {
        // Para cada byte
        for j in 0..8 {
            // Para cada bit en el byte
            let bit_position = i * 8 + j;
            binary_hash[bit_position] = (calculated_hash[i] >> (7 - j)) & 1;
        }
    }

    for i in 0..256 {
        assert(binary_hash[i] == hash[i]);
    }
}
