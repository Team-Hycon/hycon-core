declare module 'base-58'
{
    export function encode(buffer: Uint8Array): string
    export function decode(string: string): Uint8Array
}