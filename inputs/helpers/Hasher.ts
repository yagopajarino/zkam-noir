import { createHash } from 'crypto';

export class Hasher {
    private hash: string;
    private data: number[];

    constructor(data: number[]) {
        this.data = data;
        this.hash = this.hashData();
    }

    private hashData(): string {
        const hash = createHash('sha256');
        const data = Buffer.from(new Uint8Array(this.data));
        hash.update(data);
        const hashBuffer = hash.digest();
      
        const binaryHash = Array.from(hashBuffer)
          .map(byte => byte.toString(2).padStart(8, '0'))
          .join('');
      
        return binaryHash;
    }

    public getHash(): string {
        return this.hash;
    }
}