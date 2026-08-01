import { UserRepository } from '../repositories/user.repository';
import { User } from '@prisma/client';
import { NotFoundError } from '../utils/errors';

export class UserService {
  private userRepository = new UserRepository();

  async getProfile(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return user;
  }

  async updateProfile(
    id: string,
    data: { skills?: string[]; bio?: string; avatar?: string }
  ): Promise<User> {
    await this.getProfile(id);
    return this.userRepository.updateProfile(id, data);
  }

  async searchUsers(query: { q?: string; department?: string; skill?: string }): Promise<User[]> {
    return this.userRepository.searchUsers(query);
  }
}
