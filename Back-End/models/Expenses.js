const Sequelize = require('sequelize');
const sequelize = require('../DatabaseConnection/connection');

module.exports = () => {
  const Expenses = sequelize.define('Expenses', {
    expense_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    expense_description: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    expense_amount: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
  });
  Expenses.associate = (models) => {
    Expenses.belongsTo(models.Groups);
    Expenses.belongsToMany(models.Users, { through: 'Transactions', foreignKey: 'expense_id' });
  };
  return Expenses;
};
