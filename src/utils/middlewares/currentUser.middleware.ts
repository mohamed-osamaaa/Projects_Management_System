import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User | null;
  }
}

interface JwtPayload {
  id: string;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = Array.isArray(req.headers.authorization)
      ? req.headers.authorization[0]
      : req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      req.currentUser = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    try {
      const { id } = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        { secret: process.env.ACCESS_TOKEN_SECRET_KEY },
      );

      const user = await this.usersService.findOneById(id);
      req.currentUser = user ?? null;
    } catch (err) {
      console.error('Token verification failed:', err.message);
      req.currentUser = null;
    }

    next();
  }
}
