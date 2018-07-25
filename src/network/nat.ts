import { getLogger } from "log4js"
import * as natUpnp from "nat-upnp"
import { INetwork } from "./inetwork"
const client = natUpnp.createClient()
const logger = getLogger("Nat")

export class NatUpnp {
    private static async _mapPort(privatePort: number, publicPort: number, ttl: number) {
        return await new Promise((resolve, reject) => {
            client.portMapping({
                description: "Hycon",
                private: privatePort,
                public: publicPort,
                ttl,
            }, (err: any) => {
                if (err) { reject(err) }
                resolve({})
            })
        })
    }
    private static async mapPort(privatePort: number, maxAttempts: number = 2, ttl: number = 5): Promise<number> {
        let publicPort = privatePort
        for (let i = 0; i < maxAttempts; i++) {
            try {
                await NatUpnp._mapPort(privatePort, publicPort, ttl)
                logger.info(`Mapped port ${privatePort} --> ${publicPort} succesfully`)
                return publicPort
            } catch (e) {
                logger.debug(`Failed to map port ${privatePort} --> ${publicPort}, Attempt ${i} of ${maxAttempts}`)
                publicPort = 8148 + Math.floor(1000 * Math.random())
            }
        }
        logger.debug(`Upnp Port mapping failed`)
        throw new Error("Upnp Port mapping failed")
    }

    public publicPort: number
    private privatePort: number
    private network: INetwork

    constructor(port: number, net: INetwork) {
        this.privatePort = port
        this.network = net
    }

    public async run(): Promise<void> {
        try {
            this.publicPort = await NatUpnp.mapPort(this.privatePort)
        } catch (e) {
            logger.debug(`Upnp Warning: ${e}, please confirm your router supports UPNP and that UPNP is enabled or you just not behind the NAT, Hycon will use your local port:${this.privatePort}`)
        }
    }
}
