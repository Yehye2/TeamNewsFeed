"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here.
      // 1. Posts 모델에서
      this.belongsTo(models.Users, {
        // 2. Users 모델에게 N:1 관계 설정을 합니다.
        targetKey: "userId", // 3. Users 모델의 userId 컬럼을
        foreignKey: "UserId" // 4. Posts 모델의 UserId 컬럼과 연결합니다.
      });
      // Likes테이블 생성
      this.belongsToMany(models.Users, {
        through: "Likes",
        foreignKey: "PostId",
        sourceKey: "postId"
      });
      Posts.hasMany(models.Comments, {
        foreignKey: "PostId"
      });
    }
  }
  Posts.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Users 모델을 참조합니다.
          key: "userId" // Users 모델의 userId를 참조합니다.
        },
        onDelete: "CASCADE" // 만약 Users 모델의 userId가 삭제되면, Posts 모델의 데이터가 삭제됩니다.
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING
      },
      img: {
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
      modelName: "Posts"
    }
  );
  return Posts;
};
