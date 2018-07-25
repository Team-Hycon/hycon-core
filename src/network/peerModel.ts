import "reflect-metadata"
import { Column, Entity, Index, PrimaryColumn } from "typeorm"

@Entity()
export class PeerModel {
    @Index()
    @PrimaryColumn()
    public key: number
    @Column()
    public host: string
    @Column()
    public port: number
    @Column({ default: 0, nullable: true })
    public successCount: number
    @Column({ default: 0, nullable: true })
    public lastSeen: number
    @Column({ default: 0, nullable: true })
    public failCount: number
    @Column({ default: 0, nullable: true })
    public lastAttempt: number
    @Column({ default: 0, nullable: true })
    public active: boolean
    @Column({ default: 0, nullable: true })
    public currentQueue: number
}
