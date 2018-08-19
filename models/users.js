var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
          }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      favorites: DataTypes.STRING,
      watchList: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        get() {
          const creation = this.getDataValue('createdAt');
          return moment(creation, moment.ISO_8601).format("dddd, MMMM Do YYYY, h:mm:ss a");
        }
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          const creation = this.getDataValue('createdAt');
          return moment(creation, moment.ISO_8601).format("dddd, MMMM Do YYYY, h:mm:ss a");
        }
      }
    });
  
    User.associate = function(models) {
        User.hasMany(models.Rating, {
          onDelete: "cascade"
        });
      };
    return User;
  };
  