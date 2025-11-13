import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class ParkingSession extends Model { }
  ParkingSession.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      plate: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.ENUM('parked', 'paid', 'exited'), allowNull: false, defaultValue: 'parked' },
      entryTime: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      exitTime: { type: DataTypes.DATE, allowNull: true },
      allowedExitUntil: { type: DataTypes.DATE, allowNull: true },
      amountPaid: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    },
    { sequelize, modelName: 'ParkingSession', tableName: 'parking_sessions' }
  );
  return ParkingSession;
};
