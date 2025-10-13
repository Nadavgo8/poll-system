// Vote: one user's vote for one option in one poll
module.exports = (sequelize, DataTypes) => {
  const Vote = sequelize.define("Vote", {
    username: { type: DataTypes.STRING(100), allowNull: false }, // typed by the user (no auth)
  });
  Vote.associate = (models) => {
    Vote.belongsTo(models.Poll, { foreignKey: "pollId", as: "poll" });
    Vote.belongsTo(models.Option, { foreignKey: "optionId", as: "option" });
  };
  return Vote;
};
