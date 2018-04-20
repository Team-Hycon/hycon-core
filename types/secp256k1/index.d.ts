declare module 'secp256k1'
{
    export function privateKeyVerify(privateKey: Buffer): boolean
    export function privateKeyExport(privateKey: Buffer, compressed?: boolean): Buffer
    export function privateKeyImport(privateKey: Buffer): Buffer;
    export function privateKeyNegate(privateKey: Buffer): Buffer;
    export function privateKeyModInverse(privateKey: Buffer): Buffer;
    export function privateKeyTweakAdd(privateKey: Buffer, tweak: Buffer): Buffer;
    export function privateKeyTweakMul(privateKey: Buffer, tweak: Buffer): Buffer;

    export function publicKeyCreate(privateKey: Buffer, compressed?: boolean): Buffer;
    export function publicKeyConvert(publicKey: Buffer, compressed?: boolean): Buffer;
    export function publicKeyVerify(publicKey: Buffer): boolean;
    export function publicKeyTweakAdd(publicKey: Buffer, tweak: Buffer, compressed?: boolean): Buffer;
    export function publicKeyTweakMul(publicKey: Buffer, tweak: Buffer, compressed?: boolean): Buffer;
    export function publicKeyCombine(publicKeys: Buffer[], compressed?: boolean): Buffer;

    export function signatureNormalize(input: Buffer): Buffer;
    export function signatureExport(input: Buffer): Buffer;
    export function signatureImport(input: Buffer): Buffer;
    export function signatureImportLax(input: Buffer): Buffer;

    type NonceCallback = (
        message: Buffer,
        key: Buffer,
        algo: Buffer,
        data: Buffer
    ) => Buffer

    export function sign(
        message: Buffer,
        privateKey: Buffer,
        options?: { data?: Buffer, noncefn: NonceCallback }): { signature: Buffer, recovery: number };
    export function verify(message: Buffer, signature: Buffer, publicKey: Buffer): boolean;
    export function recover(message: Buffer, signature: Buffer, recovery: number, compressed?: boolean): Buffer;

    export function ecdh(publicKey: Buffer, privateKey: Buffer): Buffer;
    export function ecdhUnsafe(publicKey: Buffer, privateKey: Buffer, compressed?: boolean): Buffer;
}