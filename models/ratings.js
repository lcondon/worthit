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
      rating: DataTypes.INTEGER
    });
  
    Post.associate = function(models) {
      Post.belongsTo(models.User, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return Rating;
  };
  