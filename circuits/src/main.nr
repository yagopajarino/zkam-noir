fn main(image: [Field; 10000 * 4], hash_indexes: [Field; 256]) {
    assert(hash_indexes.len() == 256);
    assert(image[0] == 15);

    let mut hash = [0; 256];
    let mut tres = 3;
    for i in 0..256 {
        hash[i] = image[hash_indexes[i] + tres] as u32 & 1 as u32;
    }

    let mut image_sin_hash = [0; 10000 * 4];
    for i in 0..10000 * 4 {
        if i % 4 == 3 {
            image_sin_hash[i] = 0;
        } else {
            image_sin_hash[i] = image[i];
        };
    }
    // a = extraer los pixels del hash
    // b = hashear el resto
    // c = hash(b)
    // assert a = c
}
