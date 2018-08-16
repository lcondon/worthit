module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
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
    });
  
    User.associate = function(models) {
        User.hasMany(models.Rating, {
          onDelete: "cascade"
        });
      };
    return User;
  };
  