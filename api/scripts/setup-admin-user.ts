#!/usr/bin/env tsx

/**
 * Setup initial admin user for the portfolio API
 * Run with: npm run setup-admin or tsx scripts/setup-admin-user.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { User } from '../src/repositories/entities/user-entity';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORAGE_DIR = path.join(__dirname, '../storage');
const USERS_FILE = path.join(STORAGE_DIR, 'users.json');

async function createInitialAdmin() {
  console.log('🔐 Setting up initial admin user...');

  // Ensure storage directory exists
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
    console.log('📁 Created storage directory');
  }

  // Check if users file exists
  let users: User[] = [];
  if (fs.existsSync(USERS_FILE)) {
    try {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      users = JSON.parse(data);
      console.log(`📄 Found existing users file with ${users.length} users`);
    } catch {
      console.log('⚠️  Could not parse existing users file, starting fresh');
      users = [];
    }
  }

  // Check if admin user already exists
  const existingAdmin = users.find((u) => u.username === 'admin');
  if (existingAdmin) {
    console.log('✅ Admin user already exists');
    console.log(`   Username: ${existingAdmin.username}`);
    console.log(`   Roles: ${existingAdmin.roles?.join(', ') || 'none'}`);
    console.log('   Use: admin/admin to login (default password)');
    return;
  }

  // Create admin user
  const defaultPassword = 'admin';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(defaultPassword, saltRounds);

  const adminUser: User = {
    id: 'admin-001',
    username: 'admin',
    passwordHash,
    email: 'admin@localhost',
    roles: ['admin'],
    isActive: true
  };

  users.push(adminUser);

  // Write users file
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

  console.log('✅ Admin user created successfully!');
  console.log(`   Username: ${adminUser.username}`);
  console.log(`   Password: ${defaultPassword}`);
  console.log(`   Roles: ${adminUser.roles?.join(', ')}`);
  console.log('');
  console.log('⚠️  IMPORTANT: Change the default password in production!');
  console.log(`   File location: ${USERS_FILE}`);
}

// Run the setup
createInitialAdmin()
  .then(() => {
    console.log('🎉 Setup complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  });

export { createInitialAdmin };
