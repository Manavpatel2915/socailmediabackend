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

export interface postDataWithUser {
  user: {
    user_name: string,
  };
  [key: string]: unknown;
};

export type orderByType = [['createdAt', 'ASC']] | [['createdAt', 'DESC']];

export interface filterOptions {
  likecount?: {
    maxlike?: string;
    minlike?: string;
  };
}

export interface requestBody {
  orderBy?: 'ASC' | 'DESC';
  filter?: filterOptions;
}

export interface notificationContent {
   title:string,
   post_id:number,
   comment:string,
   user_id:number
}

export interface schedulePostContent {
  title:string,
  content:string,
  image:string,
  userId:number,
}

export interface userDetailsContent {
  user_id: number
}