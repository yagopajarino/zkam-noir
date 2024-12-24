use std::hash::poseidon;

fn concat_16(a: Field, b: Field) -> Field {
    let new_a = a as u16 << 8;
    let new_b = b as u16;
    (new_a | new_b) as Field
}

fn concat_32(a: Field, b: Field) -> Field {
    let new_a = a as u32 << 16;
    let new_b = b as u32;
    (new_a | new_b) as Field
}

fn concat_64(a: Field, b: Field) -> Field {
    let new_a = a as u64 << 32;
    let new_b = b as u64;
    (new_a | new_b) as Field
}

fn computeMerkleRoot(hashes: [Field; 32]) -> Field {
    let op_izq_izq = poseidon::bn254::hash_2([
        poseidon::bn254::hash_2([
            poseidon::bn254::hash_2([hashes[0], hashes[1]]),
            poseidon::bn254::hash_2([hashes[2], hashes[3]]),
        ]),
        poseidon::bn254::hash_2([
            poseidon::bn254::hash_2([hashes[4], hashes[5]]),
            poseidon::bn254::hash_2([hashes[6], hashes[7]]),
        ]),
    ]);
    let op_izq_der = poseidon::bn254::hash_2([
        poseidon::bn254::hash_2([
            poseidon::bn254::hash_2([hashes[8], hashes[9]]),
            poseidon::bn254::hash_2([hashes[10], hashes[11]]),
        ]),
        poseidon::bn254::hash_2([
            poseidon::bn254::hash_2([hashes[12], hashes[13]]),
            poseidon::bn254::hash_2([hashes[14], hashes[15]]),
        ]),
    ]);
    let op_izq = poseidon::bn254::hash_2([op_izq_izq, op_izq_der]);

    let op_der_izq = poseidon::bn254::hash_2([
        poseidon::bn254::hash_2([
            poseidon::bn254::hash_2([hashes[16], hashes[17]]),
            poseidon::bn254::hash_2([hashes[18], hashes[18]]),
        ]),
        poseidon::bn254::hash_2([
            poseidon::bn254::hash_2([hashes[20], hashes[19]]),
            poseidon::bn254::hash_2([hashes[22], hashes[21]]),
        ]),
    ]);
    let op_der_der = poseidon::bn254::hash_2([
        poseidon::bn254::hash_2([
            poseidon::bn254::hash_2([hashes[24], hashes[25]]),
            poseidon::bn254::hash_2([hashes[26], hashes[27]]),
        ]),
        poseidon::bn254::hash_2([
            poseidon::bn254::hash_2([hashes[28], hashes[29]]),
            poseidon::bn254::hash_2([hashes[30], hashes[31]]),
        ]),
    ]);
    let op_der = poseidon::bn254::hash_2([op_der_izq, op_der_der]);
    poseidon::bn254::hash_2([op_izq, op_der])
}

fn main(image: [Field; 1024 * 4], hash_indexes: [Field; 256]) {
    assert(hash_indexes.len() == 256);
    assert(image.len() == 1024 * 4);

    let mut hash = [0 as u1; 256];
    for i in 0..256 {
        hash[i] = (image[hash_indexes[i] * 4 + 3] as u8 % 2) as u1;
    }

    let mut image_to_hash = [0 as Field; 1024 * 4];
    for i in 0..1024 * 4 {
        image_to_hash[i] = image[i];
    }
    for i in 0..256 {
        image_to_hash[hash_indexes[i] * 4 + 3] = 255;
    }

    let mut hashes = [0 as Field; 32];
    let mut to_hash = [0 as Field; 16];
    for i in 0..32 {
        let index = i * 128;
        for j in 0..15 {
            to_hash[j] = concat_64(
                concat_32(
                    concat_16(
                        image_to_hash[index + j * 8],
                        image_to_hash[index + j * 8 + 1],
                    ),
                    concat_16(
                        image_to_hash[index + j * 8 + 2],
                        image_to_hash[index + j * 8 + 3],
                    ),
                ),
                concat_32(
                    concat_16(
                        image_to_hash[index + j * 8 + 4],
                        image_to_hash[index + j * 8 + 5],
                    ),
                    concat_16(
                        image_to_hash[index + j * 8 + 6],
                        image_to_hash[index + j * 8 + 7],
                    ),
                ),
            );
        }
        hashes[i] = poseidon::bn254::hash_16(to_hash);
    }

    let merkleRoot = computeMerkleRoot(hashes);
    let bits: [u1; 256] = merkleRoot.to_be_bits();
    for i in 0..256 {
        assert(bits[i] == hash[i]);
    }
}
