import User from '../models/User';
import { NotFoundError } from '../utils/errors';

export class UserService {
  static async getMe(id: number) {
    const user = await User.findById(id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}
