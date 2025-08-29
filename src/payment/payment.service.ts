import { Milestone } from 'src/entities/milestone.entity';
import { Payment } from 'src/entities/payment.entity';
import { User } from 'src/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PaymentStatus } from 'src/utils/enums/paymentStatus.enum';
import { UserRole } from 'src/utils/enums/userRoles.enum';
import Stripe from 'stripe';
import { Repository } from 'typeorm';

import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;

    constructor(
        @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
        @InjectRepository(Milestone) private milestoneRepo: Repository<Milestone>,
        @InjectRepository(User) private userRepo: Repository<User>,
        private readonly notificationsService: NotificationsService,
    ) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    }

    async makePayment(
        milestoneId: string,
        userId: string,
        successUrl: string,
        cancelUrl: string,
    ): Promise<{ checkoutUrl: string }> {
        try {
            const milestone = await this.milestoneRepo.findOne({
                where: { id: milestoneId },
                relations: ['company', 'project'],
            });
            if (!milestone) throw new NotFoundException(`Milestone ${milestoneId} not found`);

            if (milestone.paymentStatus === PaymentStatus.PAID) {
                throw new BadRequestException('This milestone has already been paid');
            }

            const user = await this.userRepo.findOne({ where: { id: userId } });
            if (!user) throw new NotFoundException(`User ${userId} not found`);

            const company = milestone.company;
            if (!company) throw new NotFoundException('Milestone has no associated company');
            if (!company.paymentAccountId) {
                throw new NotFoundException('Company has no connected Stripe account');
            }

            const session = await this.stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: milestone.project.title,
                            },
                            unit_amount: Math.round(Number(milestone.amount) * 100), // to cents
                        },
                        quantity: 1,
                    },
                ],
                success_url: successUrl,
                cancel_url: cancelUrl,
                payment_intent_data: {
                    transfer_data: {
                        destination: company.paymentAccountId,
                    },
                },
                metadata: {
                    milestoneId: milestone.id,
                    userId: user.id,
                    companyId: company.id,
                },
            });

            //in production delete this make it separated
            const payment = this.paymentRepo.create({
                transactionId: session.id,
                provider: 'Stripe',
                paidAt: new Date(),
                milestone: { id: milestone.id } as Milestone,
                paymentBy: { id: user.id } as User,
                paymentTo: { id: company.id } as any,
            });

            await this.paymentRepo.save(payment);

            milestone.paymentStatus = PaymentStatus.PAID;
            await this.milestoneRepo.save(milestone);

            await this.notificationsService.createNotification(
                milestone.project.client.id,
                `تم إنشاء دفعة جديدة مرتبطة بمعلم ${milestone.title}.`
            );

            return { checkoutUrl: session.url as string };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    //in production
    // async confirmPayment(session: Stripe.Checkout.Session) {
    //     try {
    //         const metadata = session.metadata ?? {};

    //         const payment = this.paymentRepo.create({
    //             transactionId: session.id,
    //             provider: 'Stripe',
    //             paidAt: new Date(),
    //             milestone: { id: metadata['milestoneId'] } as Milestone,
    //             paymentBy: { id: metadata['userId'] } as User,
    //             paymentTo: { id: metadata['companyId'] } as any,
    //         });

    //         await this.paymentRepo.save(payment);
    //     } catch (error) {
    //         throw new InternalServerErrorException(error.message);
    //     }
    // }

    async findAll(): Promise<Payment[]> {
        try {
            return this.paymentRepo.find({ relations: ['milestone', 'paymentBy', 'paymentTo'] });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findMyPayments(userId: string, role: UserRole): Promise<Payment[]> {
        try {
            if (role === UserRole.COMPANY) {
                // Payments received by this company
                return await this.paymentRepo.find({
                    where: { paymentTo: { id: userId } },
                    relations: ['milestone', 'paymentBy', 'paymentTo'],
                });
            } else if (role === UserRole.CLIENT) {
                // Payments made by this client
                return await this.paymentRepo.find({
                    where: { paymentBy: { id: userId } },
                    relations: ['milestone', 'paymentBy', 'paymentTo'],
                });
            } else {
                throw new BadRequestException('Invalid role for payments lookup');
            }
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getStats(): Promise<any> {
        try {
            const totalPaid = await this.paymentRepo
                .createQueryBuilder('payment')
                .innerJoin('payment.milestone', 'milestone')
                .select('SUM(milestone.amount)', 'total')
                .where('payment.paidAt IS NOT NULL')
                .getRawOne();

            const pendingAmount = await this.paymentRepo
                .createQueryBuilder('payment')
                .innerJoin('payment.milestone', 'milestone')
                .select('SUM(milestone.amount)', 'total')
                .where('payment.paidAt IS NULL')
                .getRawOne();

            return {
                totalPaid: Number(totalPaid.total) || 0,
                pendingAmount: Number(pendingAmount.total) || 0,
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

}
