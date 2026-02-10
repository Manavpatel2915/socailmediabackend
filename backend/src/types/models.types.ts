import { Model } from 'sequelize';

export interface UserAttributes {
  user_id: number;
  user_name: string;
  email: string;
  password: string;
  role: "Admin" | "user";
}

export interface PostAttributes {
  post_id: number;
  title: string;
  content: string;
  image: string;
  like: number;
  user_id: number;
}

export interface CommentAttributes {
  id: number;
  Comment: string;
  user_id: number | null;
  post_id: number;
}




export interface UserModel extends Model<UserAttributes>, UserAttributes {
  associate?: (models: Models) => void;
}

export interface PostModel extends Model<PostAttributes>, PostAttributes {
  associate?: (models: Models) => void;
}

export interface CommentModel extends Model<CommentAttributes>, CommentAttributes {
  associate?: (models: Models) => void;
}

export interface Models {
  User: typeof Model & {
    new(): UserModel;
    associate?: (models: Models) => void;
  };
  Post: typeof Model & {
    new(): PostModel;
    associate?: (models: Models) => void;
  };
  Comment: typeof Model & {
    new(): CommentModel;
    associate?: (models: Models) => void;
  };

}