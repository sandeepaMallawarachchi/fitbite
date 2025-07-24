export interface Client {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  role: string;
  createdAt: string;

  // Optional UI display enhancements
  avatar?: string;
  message?: string;
  time?: string;
  unreadCount?: number;
}
