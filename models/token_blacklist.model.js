module.exports = (sequelize, DataTypes) => {
    const TokenBlacklist = sequelize.define('TokenBlacklist', {
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        expiracao: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'token_blacklist',
        timestamps: true
    });

    return TokenBlacklist;
};
