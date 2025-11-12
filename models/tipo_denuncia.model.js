module.exports = (sequelize, DataTypes) => {
    const TipoDenuncia = sequelize.define('TipoDenuncia', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipo: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        tableName: 'tipos_denuncias',
        timestamps: false,
        underscored: true
    });

    return TipoDenuncia;

};