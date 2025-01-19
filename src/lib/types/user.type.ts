export type User = {
  id: number;
  username: string;
  role: string;
  is_secretary?:boolean;
  department?: string;
  fullName?: string;
  user_id?: number;
};
