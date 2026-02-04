{   
     "user_name":"Manav_Patel",
     "email": "manav@gmail.com",
     "password": "1234567890",
     "role": "Admin"

}  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NzAxMjA1NTUsImV4cCI6MTc3MDU1MjU1NX0.qSYKVnp9bPKw6W630Le_BHNmOHIV7iUZ_ftIFfqW-90

{   
     "user_name": "sahil",
     "email": "sahil@gmail.com",
     "password": "1234567890",
     "role": "user"
}   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMCwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzAxMjE5MjUsImV4cCI6MTc3MDU1MzkyNX0.6Tpz057AtmplfgagnvWGx0T3o5DA8TMoC9JTVpr-9iY
//post model service do on delete post reach 




```typescript
import { Model, Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";

export default (sequelize: Sequelize) => {
 class User extends Model {
  declare user_id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: "Admin" | "user";

}

  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("Admin", "user"),
        allowNull: false,
        defaultValue: "user",
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: "user",
      modelName: "User",
    }
  );

  User.beforeCreate(async (user: User) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

 
  User.beforeUpdate(async (user: User) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};

```

this is usermodel 

```typescript
import {
  Model,
  Sequelize,
  DataTypes,
  DATE,
} from 'sequelize';

export default (sequelize: Sequelize
) => {
  class Post extends Model {
 
  declare post_id:number;
  declare title:string;
  declare content:string;
  declare image:string;
  declare like:number;
  declare user_id:number;
}

  Post.init(
    {
      post_id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "https://justdemo.jpeg",
      },
      like: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      user_id:{
        type :DataTypes.INTEGER,
        allowNull:false,
        
      }
    },
    {
      sequelize,
      underscored: true,
      tableName: 'Post',
      modelName: 'Post',
    }
  );

  return Post;
};

```

this is post model

```typescript
import { Model, Sequelize, DataTypes } from "sequelize";

export default (sequelize: Sequelize) => {
  class Comment extends Model {
    declare id: number;
    declare Comment: string;
    declare user_id: number | null;
    declare post_id: number;
  }

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      Comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true, 
      },

      post_id: {
        type: DataTypes.INTEGER,
        allowNull: false, 
      },
    },
    {
      sequelize,
      underscored: true,
      tableName: "Comment",
      modelName: "Comment",
    }
  );

  return Comment;
};
 
```

this is the comment model 

```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import UserModel from "../models/usermodel.sql";
import CommentModel from "../models/commentmodel.sql";
import PostModel from "../models/postmodel.sql";
import TokenModel from "../models/tokenmodel.sql";

dotenv.config();


const DB_NAME = process.env.DB_NAME || 'airbin';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306;


const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  logging: false,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

interface Database {
  Sequelize: typeof Sequelize;
  sequelize: Sequelize;
  User: ReturnType<typeof UserModel>;
  Post: ReturnType<typeof PostModel>;
  Comment: ReturnType<typeof CommentModel>;
  Token: ReturnType<typeof TokenModel>;
}


const db: Database = {
  Sequelize,
  sequelize,
  User: UserModel(sequelize),
  Post: PostModel(sequelize),
  Comment: CommentModel(sequelize),
  Token: TokenModel(sequelize),
};


// User -> Posts (one-to-many)
db.User.hasMany(db.Post, {
  foreignKey: 'user_id',
  as: 'posts'
});

db.Post.belongsTo(db.User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Post -> Comments (one-to-many)
db.Post.hasMany(db.Comment, {
  foreignKey: 'post_id',
  as: 'comments'
});

db.Comment.belongsTo(db.Post, {
  foreignKey: 'post_id',
  as: 'post'
});

// User -> Comments (one-to-many, optional)
db.User.hasMany(db.Comment, {
  foreignKey: {
    name: "user_id",
    allowNull: true,
  },
  as: 'comments'
});

db.Comment.belongsTo(db.User, {
  foreignKey: {
    name: "user_id",
    allowNull: true,
  },
  as: 'user'
});


export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log(` Database "${DB_NAME}" connected successfully at ${DB_HOST}:${DB_PORT}`);
  } catch (error) {
    console.error(' Database connection error:', error);
    throw error; 
  }
};
// db.sequelize.sync({ force: true }); 

export default db;

```

this is sql connection file now what i want assosication move to when creation time so when create model then mode association happen for use one to many with post ,for post many to one user , that type
