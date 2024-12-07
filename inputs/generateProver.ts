import fs from 'fs';
import { PNG } from 'pngjs';
import { Hasher } from './helpers/Hasher';
import { RandInt } from './helpers/RandInt';
  
function embedHashToImage(inputPath: string, outputPath: string, colorear: boolean): void {
    let pixelsToHash = new Array<number>();

    const hashPositions = new RandInt(256, 0, 1023, 1234).generate();

    fs.createReadStream(inputPath)
        .pipe(new PNG())
        .on('parsed', function (this: PNG) {
            
            for (let i = 0; i < this.data.length; i++) {
                if (!(i % 4 === 3 && hashPositions.includes(Math.floor(i / 4)))) {
                    pixelsToHash.push(this.data[i]);
                } else {
                    pixelsToHash.push(255);
                }     
            }
            const hash = new Hasher(pixelsToHash).getHash();

            // get the hash binary and convert it to an array of 0s and 1s
            const hashBinaryArray = hash.split('').map(Number);

            for (let i = 0; i < hashPositions.length; i++) {
                const pixelIndex = hashPositions[i] * 4;
                if (colorear) {
                    if (hashBinaryArray[i] === 0) {
                        this.data[pixelIndex] = 255;
                        this.data[pixelIndex + 1] = 0;
                        this.data[pixelIndex + 2] = 0;
                    } else {
                        this.data[pixelIndex] = 0;
                        this.data[pixelIndex + 1] = 255;
                        this.data[pixelIndex + 2] = 0;
                    }
                }
                this.data[pixelIndex + 3] = hashBinaryArray[i] === 0 ? 254 : 255 // this.data[pixelIndex + 3] & 0b11111110 | hashBinaryArray[i];
            }

            const image = new Array(...this.data).map(i => `"${i}"`);
            const prover = `hash_indexes = [${hashPositions.map(i => `"${i}"`)}]\nhash_to_check = [${hash.split("").map(i => `"${i}"`)}]\nimage = [${image.join(',')}]`;
            fs.writeFileSync('../circuits/Prover.toml', prover);

            this.pack().pipe(fs.createWriteStream(outputPath))
                .on('finish', () => console.log(`Image hashed and saved to ${outputPath}`));
        });
}

// Example usage
embedHashToImage('../images/source/lionel-copa-chikito.png', '../images/output/lionel-hasheado.png', false);
