import { PNG } from 'pngjs';
import fs from 'fs';

const printImageDiff = async (image1: string, image2: string) => {
    const img = fs.createReadStream(image1).pipe(new PNG()).on('parsed', function (this: any) {
        const original = this;
        const hashed = fs.createReadStream(image2).pipe(new PNG()).on('parsed', function (this: any) {
            const hashed = this;
            if (original.width !== hashed.width || original.height !== hashed.height) {
                console.log('Images are not the same size');
                return;
            }

            let diff = 0;
            for (let i = 0; i < original.data.length; i += 4) {
                if (original.data[i] !== hashed.data[i] || 
                    original.data[i + 1] !== hashed.data[i + 1] || 
                    original.data[i + 2] !== hashed.data[i + 2] ||
                    original.data[i + 3] !== hashed.data[i + 3]) {
                    // change the pixel to red
                    original.data[i] = 255;
                    original.data[i + 1] = 0;
                    original.data[i + 2] = 0;
                    original.data[i + 3] = 255;
                    diff++;
                } else {
                    // make the pixel white
                    original.data[i] = 255;
                    original.data[i + 1] = 255;
                    original.data[i + 2] = 255;
                    original.data[i + 3] = 255;
                }
            }

            original.pack().pipe(fs.createWriteStream('../images/output/diff.png'))
                .on('finish', () => console.log('Diff image saved'));

            console.log(`There are ${diff} different pixels`);
        });
    });
}

printImageDiff('../images/lionel-copa-alpha.png', '../images/output/lionel-hasheado.png');