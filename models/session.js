module.exports = function(sequelize, DataTypes){ 
  var Sessions = sequelize.define('Sessions', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: DataTypes.STRING,
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
  });
  return Sessions;
}