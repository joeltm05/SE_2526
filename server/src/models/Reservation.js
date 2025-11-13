import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Reservation extends Model { }
  Reservation.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      plate: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.ENUM('active', 'cancelled', 'used', 'expired'), allowNull: false, defaultValue: 'active' },
      reservedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      expiresAt: { type: DataTypes.DATE, allowNull: false },
    },
    { sequelize, modelName: 'Reservation', tableName: 'reservations' }
  );
  return Reservation;
};
