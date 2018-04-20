declare module 'blake2b'
{
    class Blake2b {
        public update(input: ArrayLike<number>): Blake2b;
        public digest(out?: "binary" | "hex" | ArrayLike<number>): Uint8Array
        public final(out?: "binary" | "hex" | ArrayLike<number>): Uint8Array
    }

    let createHash: {
        (outlen: number, key?: ArrayLike<number>, salt?: ArrayLike<number>, personal?: ArrayLike<number>, noAssert?: boolean): Blake2b

        WASM_SUPPORTED: boolean
        WASM_LOADED: boolean

        BYTES_MIN: number
        BYTES_MAX: number
        BYTES: number
        KEYBYTES_MIN: number
        KEYBYTES_MAX: number
        KEYBYTES: number
        SALTBYTES: number
        PERSONALBYTES: number

        ready(callback: () => void): void;
    }

    export = createHash
}