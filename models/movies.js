var moment = require('moment');

module.exports = function(sequelize, DataTypes) {
    var Movie = sequelize.define("Movie", {
      routeName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      synopsis: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      genres: {
        type: DataTypes.STRING,
        allowNull: false
      },
      languages: {
        type: DataTypes.STRING,
        allowNull: false
      },
      director: {
        type: DataTypes.STRING,
        allowNull: false
      },
      actors: {
        type: DataTypes.STRING,
        allowNull: false
      },
      poster: {
        type: DataTypes.STRING,
        isUrl: true,
        defaultValue: '/images/movieplaceholder.gif'
      }, 
      ratings : {
        type: DataTypes.JSON,
        allowNull: false
      },
      differential : {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
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
  
    return Movie;
  };
  