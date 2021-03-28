module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('Groups', {
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
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: async (queryInterface) => queryInterface.dropTable('Groups'),
};
