var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
    var Rating = sequelize.define("Rating", {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      movie_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: DataTypes.TEXT,
      rating: DataTypes.INTEGER,
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
  
    Rating.associate = function(models) {
      Rating.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Rating;
  };
  