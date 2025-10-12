module.exports = {
  async up(qi, Sequelize) {
    await qi.createTable("Options", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      pollId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Polls", key: "id" },
        onDelete: "CASCADE",
      },
      text: { type: Sequelize.STRING(255), allowNull: false },
      position: { type: Sequelize.INTEGER, allowNull: false },
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
    await qi.addConstraint("Options", {
      fields: ["pollId", "position"],
      type: "unique",
      name: "uniq_poll_position",
    });
    await qi.addIndex("Options", ["pollId", "position"], {
      name: "idx_options_poll",
    });
  },
  async down(qi) {
    await qi.removeIndex("Options", "idx_options_poll");
    await qi.dropTable("Options");
  },
};
