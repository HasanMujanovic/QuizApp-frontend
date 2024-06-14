export interface UserToSave {
  id?: string;
  name: string;
  email: string;
  password: string;
  roles: string;
  level?: number;
  points?: number;
  status: string;
}
