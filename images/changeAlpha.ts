import fs from 'fs';
import { PNG } from 'pngjs';
  
function embedHashToImage(inputPath: string, outputPath: string): void {
    fs.createReadStream(inputPath)
        .pipe(new PNG())
        .on('parsed', function (this: PNG) {
            
            for (let i = 0; i < this.data.length; i++) {
                if (i % 4 === 3) {
                    this.data[i] = 253;
                }      
            }
            
            this.pack().pipe(fs.createWriteStream(outputPath))
                .on('finish', () => console.log(`Image hashed and saved to ${outputPath}`));
        });
}

// Example usage
embedHashToImage('../images/lionel-copa.png', '../images/lionel-copa-alpha.png');
