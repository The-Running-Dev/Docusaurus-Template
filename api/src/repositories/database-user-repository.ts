import { IUserRepository, IConfigService } from './interfaces';
import { User } from '../../../shared/entities/user';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { STORAGE_DIR } from '../lib/paths';

/**
 * Database implementation of user repository
 * Reads from storage/users.json file
 */
export class DatabaseUserRepository implements IUserRepository {
  private readonly usersFile: string;

  constructor(private configService: IConfigService) {
    this.usersFile = path.join(STORAGE_DIR, 'users.json');
  }

  private loadUsers(): User[] {
    if (!fs.existsSync(this.usersFile)) {
      return [];
    }

    try {
      const data = fs.readFileSync(this.usersFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users file:', error);
      return [];
    }
  }

  private saveUsers(users: User[]): void {
    try {
      const dir = path.dirname(this.usersFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing users file:', error);
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    const users = this.loadUsers();
    return users.find((u) => u.username === username) || null;
  }

  async findById(id: string): Promise<User | null> {
    const users = this.loadUsers();
    return users.find((u) => u.id === id) || null;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    try {
      // Use bcrypt to compare the password with the hash
      return await bcrypt.compare(password, user.passwordHash);
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  }

  async create(userData: Omit<User, 'id'>): Promise<User> {
    const users = this.loadUsers();
    const user: User = {
      id: (users.length + 1).toString(),
      username: userData.username,
      passwordHash: userData.passwordHash,
      roles: userData.roles || ['user'],
      isActive: userData.isActive ?? true,
      email: userData.email
    };

    users.push(user);
    this.saveUsers(users);
    return user;
  }

  async updateLastLogin(_userId: string): Promise<void> {
    // For now, this is a no-op since User doesn't have lastLoginAt
    // In production, this would update the database
  }
}
