module.exports = (sequelize, DataTypes) => {
    const PushToken = sequelize.define('PushToken', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        utilizador: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'utilizadores',
                key: 'id'
            }
        },
        token: {
            type: DataTypes.STRING(512),
            allowNull: false
        },
        plataforma: {
            type: DataTypes.ENUM('android', 'ios', 'web'),
            allowNull: true
        },
    }, {
        tableName: 'push_token',
        timestamps: true,
        underscored: true,
        indexes: [
            {
                unique: true,
                fields: ['utilizador', 'token']
            },
        ],
    });

    PushToken.associate = (models) => {
        PushToken.belongsTo(models.Utilizador, { foreignKey: 'utilizador' });
        models.Utilizador.hasMany(PushToken, { foreignKey: 'utilizador' });
    };

    ['beforeCreate', 'beforeUpdate'].forEach(hook => {
        PushToken.addHook(hook, async (ele) => {
            const { Utilizador } = sequelize.models;

            const utilizador = await Utilizador.findByPk(ele.utilizador);
            if (!utilizador || !(await utilizador.checkPerfil('formando')))
                throw new Error('O utilizador especificado como formando não é válido.');
        });
    });

    return PushToken;
};
