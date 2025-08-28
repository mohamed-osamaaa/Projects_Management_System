import {
    MigrationInterface,
    QueryRunner,
} from 'typeorm';

export class ProjectChatRelation1724859200000 implements MigrationInterface {
    name = 'ProjectChatRelation1756364999021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`chat\`
            ADD CONSTRAINT \`UQ_chat_project\` UNIQUE (\`projectId\`)
        `);

        await queryRunner.query(`
            ALTER TABLE \`chat\`
            ADD CONSTRAINT \`FK_chat_project\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_chat_project\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP INDEX \`UQ_chat_project\``);
    }
}
