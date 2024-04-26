import { BaseEntity } from "src/common/base/base-entity";
import { entityName } from "src/common/enum/entity.enum";
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(entityName.otp)
export class OtpEntity extends BaseEntity {
    @Column()
    code: string;
    @Column()
    method: string;
    @Column()
    expires_in: Date;
    @Column()
    userId: number;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @OneToOne(() => UserEntity, user => user.otp, { onDelete: "CASCADE" })
    user: UserEntity;
}