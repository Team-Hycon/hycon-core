declare module '@glosfer/hyconjs-util'
{
    export function hyconfromString(str: string): Long;
    export function hycontoString(lng: Long): string;
    export function strictAdd(val1: Long, val2: Long): Long;

    export function strictSub(val1: Long, val2: Long): Long;
    export function zeroPad(str: string, num: number): string;
    export function getMnemonic(language: string): string;
    export function encodingMnemonic(str: string): string;
}
