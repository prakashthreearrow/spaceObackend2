
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('user_contact_book', {
            id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER,
                references:{
                  model: 'user',
                  key: 'id',
                },
              },
            email: {
                type: [
                    Sequelize.STRING(50)
                ],
                allowNull: true
            },
            phone_no: {
                type: [
                    Sequelize.INTEGER
                ],
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable('user_contact_book');
    }
}
