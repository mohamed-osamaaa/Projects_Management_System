import {
    MigrationInterface,
    QueryRunner,
} from 'typeorm';

export class UpdateOfferStatusEnum1724678934567 implements MigrationInterface {
    name = 'UpdateOfferStatusEnum1724678934567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offer\` CHANGE \`status\` \`status\` ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offer\` CHANGE \`status\` \`status\` ENUM('pending', 'accepted', 'rejected', 'expired') NOT NULL DEFAULT 'pending'`);
    }
}
