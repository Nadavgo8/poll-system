// Poll: the poll itself
const define = (sequelize, DataTypes) => {
  const Poll = sequelize.define("Poll", {
    title: { type: DataTypes.STRING(255), allowNull: false },
    creator: { type: DataTypes.STRING(100), allowNull: false }, // who created the poll
  });
  Poll.associate = (models) => {
    Poll.hasMany(models.Option, {
      foreignKey: "pollId",
      as: "options",
      onDelete: "CASCADE",
    });
    Poll.hasMany(models.Vote, {
      foreignKey: "pollId",
      as: "votes",
      onDelete: "CASCADE",
    });
  };
  return Poll;
};

export default define;
