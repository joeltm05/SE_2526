import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Spot extends Model { }
  Spot.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      label: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.ENUM('free', 'reserved', 'occupied'), allowNull: false, defaultValue: 'free' },
      currentPlate: { type: DataTypes.STRING, allowNull: true },
    },
    { sequelize, modelName: 'Spot', tableName: 'spots' }
  );
  return Spot;
};
