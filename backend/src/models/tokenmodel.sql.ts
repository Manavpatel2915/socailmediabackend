import { Model, Sequelize, DataTypes } from "sequelize";


export default (sequelize: Sequelize) => {
 class token extends Model {
}

  token.init(
    {
      token_id: {
        type: DataTypes.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      genratedtoken: {
        type: DataTypes.STRING,
        allowNull: false,
      },
     
    },
    {
      sequelize,
      tableName: "token",
      modelName: "token",
    }
  );

 

  return token;
};
