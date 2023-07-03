"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Users 모델과 Followers 모델 간의 다대다(N:M) 관계 설정
      Users.belongsToMany(models.Users, {
        through: "Followers",
        foreignKey: "followerId",
        as: "followers"
      });

      Users.belongsToMany(models.Users, {
        through: "Followers",
        foreignKey: "followingId",
        as: "following"
      });

      // Users 모델과 Posts 모델 간의 1:N 관계 설정
      Users.hasMany(models.Posts, {
        foreignKey: "userId",
        as: "posts"
      });

      // Users 모델과 Likes 모델 간의 N:M 관계 설정
      Users.belongsToMany(models.Posts, {
        through: "Likes",
        foreignKey: "userId",
        as: "likedPosts"
      });

      Users.hasMany(models.Comments, {
        foreignKey: "userId",
        as: "comments"
      });
    }
  }
  Users.init(
    {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING(10),
        unique: true,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      },
      profileImage: {
        type: DataTypes.STRING
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
      modelName: "Users"
    }
  );
  return Users;
};
