module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('Expenses', {
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
      references: {
        model: 'Groups',
        key: 'group_id',
      },
    },
    expense_description: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    expense_amount: {
      type: Sequelize.DECIMAL,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),
  down: async (queryInterface) => queryInterface.dropTable('Expenses'),
};
