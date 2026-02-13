import {
  Model,
  Sequelize,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from 'sequelize';
import { Models } from "../../../types/models.types";


export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare post_id: CreationOptional<number>;
  declare title: string | null;
  declare content: string;
  declare image: CreationOptional<string>;
  declare like: CreationOptional<number>;
  declare user_id: number;


  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;


  static associate(models: Models): void {
    // Post -> User (many-to-one)
    Post.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });

    // Post -> Comments (one-to-many)
    Post.hasMany(models.Comment, {
      foreignKey: 'post_id',
      as: 'comments',
      onDelete: 'CASCADE',
    });
  }
}


export default (sequelize: Sequelize): typeof Post => {
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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
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