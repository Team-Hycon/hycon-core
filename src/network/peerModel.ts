import "reflect-metadata"
import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class PeerModel {
    @PrimaryColumn()
    public host: string
    @PrimaryColumn()
    public port: number
    @Column({ default: 0, nullable: true })
    public successOutCount: number
    @Column({ default: 0, nullable: true })
    public successInCount: number
    @Column({ default: 0, nullable: true })
    public lastSeen: number
    @Column({ default: 0, nullable: true })
    public failCount: number
    @Column({ default: 0, nullable: true })
    public lastAttempt: number
    @Column({ default: 0, nullable: true })
    public active: number
}
