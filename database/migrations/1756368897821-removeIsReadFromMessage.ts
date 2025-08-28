import {
    MigrationInterface,
    QueryRunner,
    TableColumn,
} from 'typeorm';

export class RemoveIsReadFromMessage1690000000000 implements MigrationInterface {

    name = 'RemoveIsReadFromMessage1756368897821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("message", "isRead");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "message",
            new TableColumn({
                name: "isRead",
                type: "tinyint",
                width: 1,
                default: 0,
            })
        );
    }

}
