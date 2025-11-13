import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class User extends Model { }
    User.init(
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
            passwordHash: { type: DataTypes.STRING, allowNull: false },
            role: { type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user' },
        },
        { sequelize, modelName: 'User', tableName: 'users' }
    );
    return User;
};
