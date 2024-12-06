// use std::hash::poseidon;

fn main(image: [u8; 1024 * 4], hash_indexes: [u32; 256]) {
    assert(hash_indexes.len() == 256);
    assert(image.len() == 1024 * 4);

    let mut hash = [0 as u8; 256];
    for i in 0..256 {
        hash[i] = image[hash_indexes[i] * 4 + 3] as u8 % 2;
    }

    let mut image_to_hash = [0 as u8; 1024 * 4];
    for i in 0..1024 * 4 {
        image_to_hash[i] = image[i];
    }
    for i in 0..256 {
        image_to_hash[hash_indexes[i] * 4 + 3] = image[hash_indexes[i] * 4 + 3];
    }
    let mut sup_half = [0; 512 * 4];
    let mut inf_half = [0; 512 * 4];
    for i in 0..512 * 4 {
        sup_half[i] = image_to_hash[i];
    }

    for i in 0..512 * 4 {
        inf_half[i] = image_to_hash[i + 512 * 4];
    }
    // // hash de la imagen
    // poseidon::bn254::hash_1()
    // for i in 0..256 {
    //     assert(hash_to_check[i] == hash[i]);
    // }
}
