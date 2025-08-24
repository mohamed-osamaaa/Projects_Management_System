import {
  NextFunction,
  Request,
  Response,
} from 'express';
import { User } from 'src/entities/user.entity';

import {
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService } from '../../auth/auth.service';

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
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaderRaw =
      (req.headers['authorization'] as string) ||
      (req.headers['Authorization'] as string);

    const authHeader = Array.isArray(authHeaderRaw)
      ? authHeaderRaw[0]
      : authHeaderRaw;

    if (!authHeader) {
      req.currentUser = null;
      return next();
    }

    if (!authHeader.startsWith('Bearer ')) {
      req.currentUser = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    try {
      const { id } = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        { secret: process.env.ACCESS_TOKEN_SECRET_KEY },
      );

      const user = await this.authService.findOneById(id);

      req.currentUser = user ?? null;
    } catch (err: any) {
      console.log('Token verification failed:', err.message);
      req.currentUser = null;
    }

    next();
  }
}
