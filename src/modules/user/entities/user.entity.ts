import { BaseEntity } from "src/common/base/base-entity";
import { entityName } from "src/common/enum/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from "./otp.entity";

@Entity(entityName.user)
export class UserEntity extends BaseEntity {
    @Column({ unique: true, nullable: true })
    username: string;
    @Column({ unique: true, nullable: true })
    mobile: string;
    @Column({ unique: true, nullable: true })
    email: string;
    @Column({ nullable: true })
    password: string;
    @Column({ default: false })
    verifyed_mobile: boolean;
    @Column({ default: false })
    verifyed_email: boolean;
    @Column({ nullable: true })
    otpId: number;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @OneToOne(() => OtpEntity, otp => otp.user)
    @JoinColumn({ name: "otpId" })
    otp: OtpEntity
}
