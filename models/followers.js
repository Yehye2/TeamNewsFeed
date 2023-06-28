"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class followers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Follower 모델과 Users 모델 간의 관계 설정
      followers.belongsTo(models.Users, {
        foreignKey: "followerId",
        as: "follower"
      });
      followers.belongsTo(models.Users, {
        foreignKey: "followingId",
        as: "following"
      });
    }
  }
  followers.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      followerId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "userId"
        },
        onDelete: "CASCADE"
      },
      followingId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "userId"
        },
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      modelName: "Follower"
    }
  );
  return followers;
};
