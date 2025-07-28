import { User } from '@/auth/interfaces';
import { Status } from './status';

export interface Task {
  id?: string;
  title: string;
  description: string;
  user: User | null;
  status: Status | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
