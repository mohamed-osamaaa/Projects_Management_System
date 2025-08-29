import {
    MigrationInterface,
    QueryRunner,
} from 'typeorm';

export class AddNotificationsEnabledToUser1724848000000 implements MigrationInterface {
    name = 'AddNotificationsEnabledToUser1756397435976'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE user
            ADD COLUMN notificationsEnabled BOOLEAN NOT NULL DEFAULT true
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE user
            DROP COLUMN notificationsEnabled
        `);
    }
}
