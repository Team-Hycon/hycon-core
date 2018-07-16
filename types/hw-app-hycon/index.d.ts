declare module '@glosfer/hw-app-hycon'
{
    // TODO: complete types
    export default class Hycon {
        constructor(transport: Transport)
        public getAddress(path: string): any
        public signTransaction(path: string, rawTx: string): any
    }
}