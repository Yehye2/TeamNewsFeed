"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comments.belongsTo(models.Users, {
        foreignKey: "UserId",
        targetKey: "userId"
      });
      Comments.belongsTo(models.Posts, {
        foreignKey: "PostId",
        targetKey: "postId"
      });
    }
  }
  Comments.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      comment: {
        allowNull: false,
        type: DataTypes.STRING
      },
      PostId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Posts", // Users 모델을 참조합니다.
          key: "postId" // Users 모델의 userId를 참조합니다.
        },
        onDelete: "CASCADE"
      },
      UserId: {
        allowNull: false,
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      sequelize,
      modelName: "Comments"
    }
  );
  return Comments;
};
