/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(qi, Sequelize) {
    await qi.createTable("Polls", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      creator: { type: Sequelize.STRING(100), allowNull: false },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(qi) {
    await qi.dropTable("Polls");
  },
};
