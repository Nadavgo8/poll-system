module.exports = {
  async up(qi, Sequelize) {
    await qi.createTable("Votes", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      pollId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Polls", key: "id" },
        onDelete: "CASCADE",
      },
      optionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Options", key: "id" },
        onDelete: "CASCADE",
      },
      username: { type: Sequelize.STRING(100), allowNull: false },
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
    await qi.addConstraint("Votes", {
      fields: ["pollId", "username"],
      type: "unique",
      name: "uniq_vote_once",
    });
    await qi.addIndex("Votes", ["optionId"], { name: "idx_votes_option" });
  },
  async down(qi) {
    await qi.removeIndex("Votes", "idx_votes_option");
    await qi.dropTable("Votes");
  },
};
