// types/User.ts
export interface Client {
  id: string;
  name: string;
  avatar: string;
  message: string;
  time: string;
  unreadCount: number;
  status: 'active' | 'inactive';
}
