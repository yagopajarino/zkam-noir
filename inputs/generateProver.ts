import fs from 'fs';
import { PNG } from 'pngjs';
import { createHash } from 'crypto';

function sha256HashArray(arr: number[]): string {
  const hash = createHash('sha256');
  const data = Buffer.from(new Uint8Array(arr));
  hash.update(data);
  return hash.digest('hex');
}

function getRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
function generateUniqueRandomArray(size: number, min: number, max: number): number[] {
    const uniqueNumbers = new Set<number>();

    while (uniqueNumbers.size < size) {
        uniqueNumbers.add(getRandomInteger(min, max));
    }

    return Array.from(uniqueNumbers);
}

  
function hashImage(inputPath: string, outputPath: string): void {
    let pixelsToHash = new Array<number>();

    const hashPositions = generateUniqueRandomArray(256, 0, 10000)

    fs.createReadStream(inputPath)
        .pipe(new PNG())
        .on('parsed', function (this: PNG) {
            
            for (let i = 0; i < this.data.length; i++) {
                if (!hashPositions.includes(Math.floor(i / 4))) {
                    pixelsToHash.push(this.data[i]);
                }
            }
            const hash = sha256HashArray(pixelsToHash);
            // get the hash binary and convert it to an array of 0s and 1s
            const hashBinary = hash.split('').map((char) => parseInt(char, 16).toString(2).padStart(4, '0')).join('');
            const hashBinaryArray = hashBinary.split('').map(Number);

            for (let i = 0; i < hashPositions.length; i++) {
                const pixelIndex = hashPositions[i] * 4;
                if (hashBinaryArray[i] === 0) {
                    this.data[pixelIndex] = 255;
                    this.data[pixelIndex + 1] = 0;
                    this.data[pixelIndex + 2] = 0;
                } else {
                    this.data[pixelIndex] = 0;
                    this.data[pixelIndex + 1] = 255;
                    this.data[pixelIndex + 2] = 0;
                }
                this.data[pixelIndex + 3] = this.data[pixelIndex + 3] & 0b11111110 | hashBinaryArray[i];
            }

            const image = new Array(...this.data).map(i => `"${i}"`);
            const prover = `hash_indexes = [${hashPositions.map(i => `"${i}"`)}]\nimage = [${image.join(',')}]`;
            fs.writeFileSync('../circuits/Prover.toml', prover);
            
            this.pack().pipe(fs.createWriteStream(outputPath))
                .on('finish', () => console.log(`First pixel blackened and image saved to ${outputPath}`));
        });
}

// Example usage
hashImage('lionel-copa.png', 'output.png');
