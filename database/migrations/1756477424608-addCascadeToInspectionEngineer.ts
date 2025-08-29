import {
    MigrationInterface,
    QueryRunner,
} from 'typeorm';

export class AddCascadeToInspectionEngineer1724940000000 implements MigrationInterface {
    name = 'AddCascadeToInspectionEngineer1756477424608'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE inspection_appointment
            DROP FOREIGN KEY FK_acf2f412426bc56f63e5c226318
        `);

        await queryRunner.query(`
            ALTER TABLE inspection_appointment
            ADD CONSTRAINT FK_acf2f412426bc56f63e5c226318
            FOREIGN KEY (engineerId) REFERENCES user(id)
            ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE inspection_appointment
            DROP FOREIGN KEY FK_acf2f412426bc56f63e5c226318
        `);

        await queryRunner.query(`
            ALTER TABLE inspection_appointment
            ADD CONSTRAINT FK_acf2f412426bc56f63e5c226318
            FOREIGN KEY (engineerId) REFERENCES user(id)
            ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
