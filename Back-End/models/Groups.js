const Sequelize = require('sequelize');
const sequelize = require('../DatabaseConnection/connection');

module.exports = () => {
  const Groups = sequelize.define('Groups', {
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    group_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true,
    },
    group_image: {
      type: Sequelize.STRING(500),
    },
  });
  Groups.associate = (models) => {
    Groups.belongsToMany(models.Users, { through: 'Users_Groups', foreignKey: 'group_id', as: 'users' });
    Groups.hasMany(models.Expenses, { foreignKey: 'group_id' });
  };
  return Groups;
};
