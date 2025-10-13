// Option: one answer choice within a poll
module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define("Option", {
    text: { type: DataTypes.STRING(255), allowNull: false },
    position: { type: DataTypes.INTEGER, allowNull: false }, // keeps original order (0..7)
  });
  Option.associate = (models) => {
    Option.belongsTo(models.Poll, { foreignKey: "pollId", as: "poll" });
    Option.hasMany(models.Vote, {
      foreignKey: "optionId",
      as: "votes",
      onDelete: "CASCADE",
    });
  };
  return Option;
};
