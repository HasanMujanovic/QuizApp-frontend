export interface User {
  id?: string;
  name: string;
  email: string;
  roles: string;
  level?: number;
  points?: number;
  status: string;
}
