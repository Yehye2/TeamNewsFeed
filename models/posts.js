'use strict';
const { Model } = require('sequelize');
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
        targetKey: "userId",
        foreignKey: "UserId"
      })
    }
  }
  Posts.init({
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
        models: 'Users', // Users 모델을 참조합니다.
        key: 'userId', // Users 모델의 userId를 참조합니다.
      },
      onDelete: 'CASCADE', // 만약 Users 모델의 userId가 삭제되면, Posts 모델의 데이터가 삭제됩니다.
    },
    nickname: {type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING
    },
    content: {
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
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};