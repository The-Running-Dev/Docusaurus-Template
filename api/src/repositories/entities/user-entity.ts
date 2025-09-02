export interface User {
  id: string;
  username: string;
  passwordHash: string;
  email?: string;
  roles?: string[];
  isActive?: boolean;
}
