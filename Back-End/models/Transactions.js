const Sequelize = require('sequelize');
const sequelize = require('../DatabaseConnection/connection');

module.exports = () => {
  const Transactions = sequelize.define('Transactions', {
    id: {
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
    expense_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    paid_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    owed_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    split_amount: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });
  Transactions.associate = (models) => {
    Transactions.belongsTo(models.Users, { foreignKey: 'user_id' });
    Transactions.belongsTo(models.Expenses, { foreignKey: 'expense_id' });
  };
  return Transactions;
};
