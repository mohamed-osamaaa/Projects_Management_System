import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFirstVersion1755960840094 implements MigrationInterface {
    name = 'AddFirstVersion1755960840094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`offerId\` varchar(36) NULL, UNIQUE INDEX \`REL_64a6ac9b5af68bf37e781eebb3\` (\`offerId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`message\` (\`id\` varchar(36) NOT NULL, \`content\` text NOT NULL, \`attachmentUrl\` varchar(255) NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`chatId\` varchar(36) NULL, \`senderId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`chat\` (\`id\` varchar(36) NOT NULL, \`projectId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inspection_appointment\` (\`id\` varchar(36) NOT NULL, \`date\` datetime NOT NULL, \`status\` enum ('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending', \`projectId\` varchar(36) NULL, \`companyId\` varchar(36) NULL, \`engineerId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`payments\` (\`id\` varchar(36) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`status\` enum ('pending', 'completed', 'failed', 'refunded', 'cancelled') NOT NULL DEFAULT 'pending', \`transactionId\` varchar(255) NULL, \`provider\` varchar(255) NULL, \`paidAt\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`milestoneId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`milestone\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`dueDate\` datetime NOT NULL, \`status\` enum ('paid', 'delayed') NOT NULL DEFAULT 'delayed', \`amount\` decimal(10,2) NOT NULL, \`projectId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_document\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(200) NOT NULL, \`description\` text NULL, \`fileUrl\` varchar(255) NOT NULL, \`fileType\` enum ('image', 'pdf', 'video', 'other') NOT NULL DEFAULT 'other', \`uploadedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`projectId\` varchar(36) NULL, \`uploadedById\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`service\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`projectId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`stage\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`projectId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'pending', \`deadline\` timestamp NULL, \`totalBudget\` decimal(10,2) NULL, \`clientId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`offer\` (\`id\` varchar(36) NOT NULL, \`price\` decimal(10,2) NOT NULL, \`description\` text NOT NULL, \`status\` enum ('pending', 'accepted', 'rejected', 'expired') NOT NULL DEFAULT 'pending', \`projectId\` varchar(36) NULL, \`companyId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`company\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`address\` varchar(255) NULL, \`phone\` varchar(255) NULL, \`paymentAccountId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` varchar(36) NOT NULL, \`message\` varchar(255) NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`support_ticket\` (\`id\` varchar(36) NOT NULL, \`subject\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'open', \`priority\` enum ('low', 'medium', 'high') NOT NULL DEFAULT 'medium', \`userId\` varchar(36) NULL, \`assignedToId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone\` varchar(255) NULL, \`address\` varchar(255) NULL, \`role\` enum ('client', 'company', 'engineer', 'customer_service', 'admin') NOT NULL DEFAULT 'client', \`verificationBadge\` tinyint NOT NULL DEFAULT 0, \`companyId\` varchar(36) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`static_content\` (\`id\` varchar(36) NOT NULL, \`type\` varchar(255) NOT NULL, \`content\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_64a6ac9b5af68bf37e781eebb37\` FOREIGN KEY (\`offerId\`) REFERENCES \`offer\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_619bc7b78eba833d2044153bacc\` FOREIGN KEY (\`chatId\`) REFERENCES \`chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`message\` ADD CONSTRAINT \`FK_bc096b4e18b1f9508197cd98066\` FOREIGN KEY (\`senderId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chat\` ADD CONSTRAINT \`FK_c4d2eb9bf880bfe9f7cc0735912\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inspection_appointment\` ADD CONSTRAINT \`FK_c8f5fae2359d27606ad62e93585\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inspection_appointment\` ADD CONSTRAINT \`FK_a8fca7181f7bf8ea32cc866aae4\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inspection_appointment\` ADD CONSTRAINT \`FK_acf2f412426bc56f63e5c226318\` FOREIGN KEY (\`engineerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD CONSTRAINT \`FK_2ea4e33e4a606e7e0b0807a0be0\` FOREIGN KEY (\`milestoneId\`) REFERENCES \`milestone\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`milestone\` ADD CONSTRAINT \`FK_edc28a2e0442554afe5eef2bdcb\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_document\` ADD CONSTRAINT \`FK_0111791887eba61037378e333c8\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_document\` ADD CONSTRAINT \`FK_10e293d6359aeaa1d54060f22f3\` FOREIGN KEY (\`uploadedById\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`service\` ADD CONSTRAINT \`FK_c6435c84a95c0fbdb734e405746\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`stage\` ADD CONSTRAINT \`FK_0760bfbac90003c4016470651e0\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_816f608a9acf4a4314c9e1e9c66\` FOREIGN KEY (\`clientId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD CONSTRAINT \`FK_b36feed587b493a984bcacf47af\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD CONSTRAINT \`FK_7e3791c6351f63eaf655522c700\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`support_ticket\` ADD CONSTRAINT \`FK_7df66b3c96ac736a25423c54e2d\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`support_ticket\` ADD CONSTRAINT \`FK_10a2268d622755b2687d31f1984\` FOREIGN KEY (\`assignedToId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_86586021a26d1180b0968f98502\` FOREIGN KEY (\`companyId\`) REFERENCES \`company\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_86586021a26d1180b0968f98502\``);
        await queryRunner.query(`ALTER TABLE \`support_ticket\` DROP FOREIGN KEY \`FK_10a2268d622755b2687d31f1984\``);
        await queryRunner.query(`ALTER TABLE \`support_ticket\` DROP FOREIGN KEY \`FK_7df66b3c96ac736a25423c54e2d\``);
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``);
        await queryRunner.query(`ALTER TABLE \`offer\` DROP FOREIGN KEY \`FK_7e3791c6351f63eaf655522c700\``);
        await queryRunner.query(`ALTER TABLE \`offer\` DROP FOREIGN KEY \`FK_b36feed587b493a984bcacf47af\``);
        await queryRunner.query(`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_816f608a9acf4a4314c9e1e9c66\``);
        await queryRunner.query(`ALTER TABLE \`stage\` DROP FOREIGN KEY \`FK_0760bfbac90003c4016470651e0\``);
        await queryRunner.query(`ALTER TABLE \`service\` DROP FOREIGN KEY \`FK_c6435c84a95c0fbdb734e405746\``);
        await queryRunner.query(`ALTER TABLE \`project_document\` DROP FOREIGN KEY \`FK_10e293d6359aeaa1d54060f22f3\``);
        await queryRunner.query(`ALTER TABLE \`project_document\` DROP FOREIGN KEY \`FK_0111791887eba61037378e333c8\``);
        await queryRunner.query(`ALTER TABLE \`milestone\` DROP FOREIGN KEY \`FK_edc28a2e0442554afe5eef2bdcb\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP FOREIGN KEY \`FK_2ea4e33e4a606e7e0b0807a0be0\``);
        await queryRunner.query(`ALTER TABLE \`inspection_appointment\` DROP FOREIGN KEY \`FK_acf2f412426bc56f63e5c226318\``);
        await queryRunner.query(`ALTER TABLE \`inspection_appointment\` DROP FOREIGN KEY \`FK_a8fca7181f7bf8ea32cc866aae4\``);
        await queryRunner.query(`ALTER TABLE \`inspection_appointment\` DROP FOREIGN KEY \`FK_c8f5fae2359d27606ad62e93585\``);
        await queryRunner.query(`ALTER TABLE \`chat\` DROP FOREIGN KEY \`FK_c4d2eb9bf880bfe9f7cc0735912\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_bc096b4e18b1f9508197cd98066\``);
        await queryRunner.query(`ALTER TABLE \`message\` DROP FOREIGN KEY \`FK_619bc7b78eba833d2044153bacc\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_64a6ac9b5af68bf37e781eebb37\``);
        await queryRunner.query(`DROP TABLE \`static_content\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`support_ticket\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP TABLE \`company\``);
        await queryRunner.query(`DROP TABLE \`offer\``);
        await queryRunner.query(`DROP TABLE \`project\``);
        await queryRunner.query(`DROP TABLE \`stage\``);
        await queryRunner.query(`DROP TABLE \`service\``);
        await queryRunner.query(`DROP TABLE \`project_document\``);
        await queryRunner.query(`DROP TABLE \`milestone\``);
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP TABLE \`inspection_appointment\``);
        await queryRunner.query(`DROP TABLE \`chat\``);
        await queryRunner.query(`DROP TABLE \`message\``);
        await queryRunner.query(`DROP INDEX \`REL_64a6ac9b5af68bf37e781eebb3\` ON \`orders\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
    }

}
