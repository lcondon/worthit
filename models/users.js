module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
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
    });
  
    User.associate = function(models) {
        User.hasMany(models.Rating, {
          onDelete: "cascade"
        });
      };
    
    return User;
  };
  