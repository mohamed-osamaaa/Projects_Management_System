import * as request from 'supertest';
import {
    DataSource,
    Repository,
} from 'typeorm';

import {
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import {
    Test,
    TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '../src/app.module';
import { Project } from '../src/entities/project.entity';
import { User } from '../src/entities/user.entity';
import { UserRole } from '../src/utils/enums/userRoles.enum';

describe('Projects E2E', () => {
    let app: INestApplication;
    let httpServer: any;
    let projectRepo: Repository<Project>;
    let userRepo: Repository<User>;
    let dataSource: DataSource;

    let clientToken: string;
    let adminToken: string;
    let clientUser: User;
    let adminUser: User;

    beforeAll(async () => {

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
        );
        await app.init();
        httpServer = app.getHttpServer();

        projectRepo = moduleFixture.get<Repository<Project>>(
            getRepositoryToken(Project),
        );
        userRepo = moduleFixture.get<Repository<User>>(
            getRepositoryToken(User),
        );
        dataSource = moduleFixture.get<DataSource>(DataSource);

        const clientRes = await request(httpServer)
            .post('/auth/register')
            .send({
                name: 'Client User',
                email: 'client@test.com',
                password: 'Passw0rd@123',
            })
            .expect(201);

        clientUser = clientRes.body;

        const adminRes = await request(httpServer)
            .post('/auth/register')
            .send({
                name: 'Admin User',
                email: 'admin@test.com',
                password: 'Admin@12345',
            })
            .expect(201);

        adminUser = adminRes.body;

        await userRepo.update({ id: adminUser.id }, { role: UserRole.ADMIN });

        const clientLogin = await request(httpServer)
            .post('/auth/login')
            .send({
                email: 'client@test.com',
                password: 'Passw0rd@123',
            })
            .expect(201);

        clientToken = clientLogin.body.accessToken;

        const adminLogin = await request(httpServer)
            .post('/auth/login')
            .send({
                email: 'admin@test.com',
                password: 'Admin@12345',
            })
            .expect(201);

        adminToken = adminLogin.body.accessToken;
    });

    afterAll(async () => {
        await app.close();
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }
    });

    describe('/projects (POST)', () => {
        it('should create a project (CLIENT only)', async () => {
            const dto = {
                title: 'My First Project',
                description: 'Test description',
                deadline: '2025-12-31',
            };

            const res = await request(httpServer)
                .post('/projects')
                .set('Authorization', `Bearer ${clientToken}`)
                .send(dto)
                .expect(201);

            expect(res.body).toMatchObject({
                title: dto.title,
                description: dto.description,
            });
        });
    });

    describe('/projects (GET)', () => {
        it('should return paginated list of projects', async () => {
            const res = await request(httpServer)
                .get('/projects?page=1&limit=5')
                .set('Authorization', `Bearer ${clientToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('data');
            expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    describe('/projects/:id (GET)', () => {
        it('should return one project', async () => {
            const project = await projectRepo.save({
                title: 'Single Project',
                description: 'For testing',
                deadline: new Date('2025-12-31'),
                client: clientUser,
            });

            const res = await request(httpServer)
                .get(`/projects/${project.id}`)
                .set('Authorization', `Bearer ${clientToken}`)
                .expect(200);

            expect(res.body).toMatchObject({
                id: project.id,
                title: 'Single Project',
            });
        });
    });

    describe('/projects/:id (PATCH)', () => {
        it('should update project if owner (CLIENT)', async () => {
            const project = await projectRepo.save({
                title: 'Update Project',
                description: 'Before update',
                deadline: new Date('2025-12-31'),
                client: clientUser,
            });

            const res = await request(httpServer)
                .patch(`/projects/${project.id}`)
                .set('Authorization', `Bearer ${clientToken}`)
                .send({ description: 'After update' })
                .expect(200);

            expect(res.body.description).toBe('After update');
        });
    });

    describe('/projects/:id (DELETE)', () => {
        it('should allow ADMIN to delete project', async () => {
            const project = await projectRepo.save({
                title: 'Delete Me',
                description: 'To be deleted',
                deadline: new Date('2025-12-31'),
                client: clientUser,
            });

            const res = await request(httpServer)
                .delete(`/projects/${project.id}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(res.body.message).toBe('Project deleted successfully');
        });
    });
});
