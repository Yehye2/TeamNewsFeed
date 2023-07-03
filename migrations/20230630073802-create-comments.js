"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Comments", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      comment: {
        allowNull: false,
        type: Sequelize.STRING
      },
      PostId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Posts", // Users 모델을 참조합니다.
          key: "postId" // Users 모델의 userId를 참조합니다.
        },
        onDelete: "CASCADE"
      },
      UserId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Comments");
  }
};
