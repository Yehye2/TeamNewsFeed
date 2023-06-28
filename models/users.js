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
      this.belongsToMany(models.Users, {
        through: "Followers",
        as: "followers",
        foreignKey: "followingId"
      });
      this.belongsToMany(models.Users, {
        through: "Followers",
        as: "following",
        foreignKey: "followerId"
      });
      // 1. Users 모델에서
      this.hasMany(models.Posts, {
        // 2. Posts 모델에게 1:N 관계 설정을 합니다.
        sourceKey: "userId", // 3. Users 모델의 userId 컬럼을
        foreignKey: "UserId" // 4. Posts 모델의 UserId 컬럼과 연결합니다.
      });
      // 2. Likes테이블 만들기
      this.belongsToMany(models.Posts, {
        through: "Likes",
        foreignKey: "UserId",
        sourceKey: "userId"
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
