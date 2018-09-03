declare module '@glosfer/bitbox-app-hycon'
{
    // TODO: complete types
    export class BitBox {
        constructor(deviceID: string)
        public getDeviceID(): string
        public ping(): any
        public createPassword(password: string): void
        public setPassword(password: string): void
        public deviceInfo(): any
        public createWallet(fileName: string): IResponseSeed
        public setName(name: string): IResponseName
        public deleteAllWallets(): IResponseDelete
        public getXPub(path: string): IResponseGetXPub
        public sign(path: string, hash: string): IResponseSign
        public reset(): IResponseReset
        public updatePassword(password: string): IResponsePassword
        public close(): void
        initialize: boolean
    }
    export interface IresponseEcho { echo: string, error: IResponseError }
    export interface IResponseSign { sign: ISign[], error: IResponseError }
    interface ISign { sig: string, recid: string }
    export interface IResponseStatus { device: IDevice, error: IResponseError }
    interface IResponseError { message: string, code: number, command: string }
    export interface IResponseGetXPub { xpub: string, echo: string, error: IResponseError }
    interface IDevice { serial: string, version: string, name: string, id: string, seeded: boolean, lock: boolean, bootlock: boolean, sdcard: boolean, TFA: string, U2F: boolean, U2F_hijack: boolean }
    export interface IResponseSeed { error: string, seed: string }
    export interface IResponseDelete { error: string, backup: string }
    export interface IResponseReset { error: string, reset: string }
    export interface IResponsePassword { error: string, password: string }
    interface IRespondCom { error: string, message: string }
    export interface ICommunication {
        sendPlain(cmd: string): any,
        sendEncrypted(cmd: string, fun: (respond: any) => void): void,
        setCommunicationSecret(password: string): void
        close(): void
    }

    export interface IResponseName { error: string, name: string }
}