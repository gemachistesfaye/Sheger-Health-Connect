import User from '../models/User';
import { NotFoundError } from '../utils/errors';
import { AuthenticatedUser } from '../types';

export class UserService {
  static async getMe(id: number): Promise<AuthenticatedUser> {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return {
      id: user.id,
      role: user.role as AuthenticatedUser['role'],
      username: user.username,
      full_name: user.full_name,
      email: user.email,
    };
  }
}
