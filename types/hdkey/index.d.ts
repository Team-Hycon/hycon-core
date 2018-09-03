declare module 'hdkey'
{
    class HDNode {
        static fromMasterSeed(seed: Buffer): HDNode;
        static fromExtendedKey(extendedKey: string): HDNode;
        publicKey: Buffer;
        privateKey: Buffer;
        privateExtendedKey: string;
        publicExtendedKey: string;
        chainCode: Buffer;
        constructor();
        derive(path: string): HDNode;
    }
    export = HDNode;
}