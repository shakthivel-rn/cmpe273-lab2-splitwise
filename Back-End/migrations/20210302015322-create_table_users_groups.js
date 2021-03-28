module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('Users_Groups', {
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
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
    group_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Groups',
        key: 'group_id',
      },
    },
    creator_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'user_id',
      },
    },
    invite_status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  }),

  down: async (queryInterface) => queryInterface.dropTable('Users_Groups'),
};
