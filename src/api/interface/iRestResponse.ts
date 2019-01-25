import { PeerModel } from "../../network/peerModel"
import { AddressDTO } from "../dto/addressDTO"
import { BlockDTO } from "../dto/blockDTO"
import { TxDTO } from "../dto/txDTO"
import { WalletDTO } from "../dto/walletDTO"

// For API v3
export type IResponseType = BlockDTOType | WalletDTOType | TxDTOType | PeerDTOType | IResponseTips | IResponsePendingTxs | IResponseMarketCap | AddressDTO | DefaultType

type BlockDTOType = BlockDTO | BlockDTO[]
type WalletDTOType = WalletDTO | WalletDTO[]
type TxDTOType = TxDTO | TxDTO[]
type PeerDTOType = PeerModel | PeerModel[]
type DefaultType = IResponseHello | IResponseError | IResponseBoolean
export interface IResponseError {
    status: number,
    timestamp: number,
    error: string
    message: string
}
export interface IResponseHello { greet: string }
export interface IResponseBoolean { success: boolean }
export interface IResponseTips { blockTip: BlockDTO, headerTip: BlockDTO }
export interface IResponseMarketCap { totalSupply: string, circulatingSupply: string }

export interface IResponsePendingTxs { address: string, count: number, totalPending: string, pendingTxs: TxDTO[] }
