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
      routeName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      director: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      actors: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return Movie;
  };
  