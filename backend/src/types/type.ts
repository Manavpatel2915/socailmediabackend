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

export interface CommentWithUser {
  user: {
    user_name: string;
  };
  [key: string]: unknown;
}

export interface postdatwithUser {
  user: {
    user_name: string,
  };
  [key: string]: unknown;
};

export type orderBytype = [['createdAt', 'ASC']] | [['createdAt', 'DESC']];