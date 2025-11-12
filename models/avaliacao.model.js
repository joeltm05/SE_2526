module.exports = (sequelize, DataTypes) => {
    const Avaliacao = sequelize.define('Avaliacao', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        formador: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'utilizadores',
                key: 'id'
            }
        },
        formando: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'utilizadores',
                key: 'id'
            }
        },
        nota: {
            type: DataTypes.DOUBLE,
            allowNull: true,
            validate: {
                min: 0,
                max: 20
            }
        },
        observacao: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        data_avaliacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'avaliacoes',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                fields: ['formador'],
            },
            {
                fields: ['formando'],
            },
            {
                fields: ['data_avaliacao'],
            }
        ]

    });

    Avaliacao.associate = (models) => {
        Avaliacao.belongsTo(models.Utilizador, { foreignKey: 'formador', as: 'Formador' });
        Avaliacao.belongsTo(models.Utilizador, { foreignKey: 'formando', as: 'Formando' });
    };

    ['beforeCreate', 'beforeUpdate'].forEach(hook =>
        Avaliacao.addHook(hook, async (avaliacao) => {
            const { Utilizador } = sequelize.models;

            const [formador, formando] = await Promise.all([
                Utilizador.findByPk(avaliacao.formador),
                Utilizador.findByPk(avaliacao.formando)
            ]);

            if (!formador || !(await formador.checkPerfil('formador')))
                throw new Error('O utilizador especificado como formador não é válido.');

            if (!formando || !(await formando.checkPerfil('formando')))
                throw new Error('O utilizador especificado como formando não é válido.');
        })
    );

    return Avaliacao;
};   