module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('Transactions', {
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
      references: {
        model: 'Groups',
        key: 'group_id',
      },
    },
    expense_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Expenses',
        key: 'expense_id',
      },
    },
    paid_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
    owed_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
    split_amount: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),
  down: async (queryInterface) => queryInterface.dropTable('Transactions'),
};
