import {
    MigrationInterface,
    QueryRunner,
} from 'typeorm';

export class RemoveAssignedToRelation1756533811561 implements MigrationInterface {
    name = 'RemoveAssignedToRelation1756533811561';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE support_ticket
            DROP FOREIGN KEY FK_10a2268d622755b2687d31f1984;
        `);


        await queryRunner.query(`
            ALTER TABLE support_ticket
            DROP COLUMN assignedToId;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE support_ticket
            ADD COLUMN assignedToId varchar(36) NULL;
        `);

        await queryRunner.query(`
            ALTER TABLE support_ticket
            ADD CONSTRAINT FK_10a2268d622755b2687d31f1984 FOREIGN KEY (assignedToId) REFERENCES user(id);
        `);
    }
}
