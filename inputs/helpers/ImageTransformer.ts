export class ImageTransformer {
    private image: number[];
    private hashPositions: number[];

    constructor(image: number[], hashPositions: number[]) {
        this.image = image;
        this.hashPositions = hashPositions;
    }

    public getPixelsToHash(): number[] {
        let pixelsToHash = new Array<number>();

        for (let i = 0; i < this.image.length; i++) {
            if (!(i % 4 === 3 && this.hashPositions.includes(Math.floor(i / 4)))) {
                pixelsToHash.push(this.image[i]);
            }
        }
        return pixelsToHash;
    }
}