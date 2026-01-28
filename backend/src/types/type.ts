export type UserBody = {
  username: string;
  email: string;
  password: string;
  role?: 'Admin' | 'user';
};

export type ParamWithId = {
  id: string;
};

export type PostBody = {
  title: string;
  content: string;
  image: string;
  like:number;
};

