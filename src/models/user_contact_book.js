const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserContactBook extends Model {
    static associate(models) {
      UserContactBook.belongsTo(models.User,{
        sourceKey: 'user_id',
        foreignKey:'id'
      })
    }
  }

  UserContactBook.init({
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references:{
        model: 'user',
        key: 'id',
      },
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    phone_no: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },

  },
   {
    indexes:[
      {
        unique: true,
        fields: ['email', 'phone_no']
    }
    ],
    sequelize,
    modelName: 'UserContactBook',
    tableName: 'user_contact_book'
  })
  return UserContactBook;
}
