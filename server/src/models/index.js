import sequelize from '../db.js';
import SpotFactory from './Spot.js';
import ParkingSessionFactory from './ParkingSession.js';
import ReservationFactory from './Reservation.js';
import UserFactory from './User.js';

export const Spot = SpotFactory(sequelize);
export const ParkingSession = ParkingSessionFactory(sequelize);
export const Reservation = ReservationFactory(sequelize);
export const User = UserFactory(sequelize);

// Associations
Spot.hasMany(ParkingSession, { foreignKey: 'spotId' });
ParkingSession.belongsTo(Spot, { foreignKey: 'spotId' });

Spot.hasMany(Reservation, { foreignKey: 'spotId' });
Reservation.belongsTo(Spot, { foreignKey: 'spotId' });

export default sequelize;

