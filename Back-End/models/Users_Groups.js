const Sequelize = require('sequelize');
const sequelize = require('../DatabaseConnection/connection');

module.exports = () => {
  const UsersGroups = sequelize.define('Users_Groups', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    creator_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    invite_status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
  UsersGroups.associate = (models) => {
    UsersGroups.belongsTo(models.Users, { foreignKey: 'user_id' });
    UsersGroups.belongsTo(models.Groups, { foreignKey: 'group_id' });
  };
  return UsersGroups;
};
