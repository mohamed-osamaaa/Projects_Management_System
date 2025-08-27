import {
    MigrationInterface,
    QueryRunner,
} from 'typeorm';

export class UpdatePaymentEntity1756280308238 implements MigrationInterface {
    name = 'UpdatePaymentEntity1756280308238'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE payments DROP COLUMN amount`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE payments ADD COLUMN amount DECIMAL(10,2)`);
    }
}