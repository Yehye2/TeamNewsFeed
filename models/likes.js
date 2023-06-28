"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Users테이블과 Posts테이블간의 관계를 정의
      this.belongsTo(models.Users, {
        foreignKey: "UserId",
        sourceKey: "userId"
      });
      this.belongsTo(models.Posts, {
        foreignKey: "PostId",
        sourceKey: "postId"
      });
    }
  }
  Likes.init(
    {
      likeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      }
    },
    {
      sequelize,
      modelName: "Likes"
    }
  );
  return Likes;
};
