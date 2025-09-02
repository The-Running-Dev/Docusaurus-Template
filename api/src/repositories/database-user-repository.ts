import { IUserRepository, IConfigService } from './interfaces';
import { User } from '../../../shared/entities/user';

/**
 * Database implementation of user repository
 * For now, this is a simple in-memory implementation
 * In production, this would connect to the actual database
 */
export class DatabaseUserRepository implements IUserRepository {
  private users: User[] = [
    {
      id: '1',
      username: 'admin',
      // In production, this would be properly hashed
      passwordHash: '$2b$10$hash_for_admin_password', // bcrypt hash for 'admin123'
      roles: ['admin'],
      isActive: true
    }
  ];

  constructor(private configService: IConfigService) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.users.find((u) => u.username === username) || null;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    // In development mode, allow simple password checking
    if (this.configService.isDevelopment()) {
      return password === 'admin123';
    }

    // In production, use simple string comparison for now
    // TODO: Implement proper bcrypt comparison when bcrypt is available
    return user.passwordHash === password;
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const user: User = {
      id: (this.users.length + 1).toString(),
      username: userData.username,
      passwordHash: userData.passwordHash,
      roles: userData.roles || ['user'],
      isActive: userData.isActive ?? true,
      email: userData.email
    };

    this.users.push(user);
    return user;
  }

  async updateLastLogin(userId: string): Promise<void> {
    // For now, this is a no-op since User doesn't have lastLoginAt
    // In production, this would update the database
  }
}
