module.exports = (sequelize, DataTypes) => {
  const AvaliacaoFormador = sequelize.define('AvaliacaoFormador', {
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
    data_avaliacao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    observacao: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    avaliacao_formador: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0,
        max: 20
      }
    }
  }, {
    tableName: 'avaliacoes_formadores',
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

  AvaliacaoFormador.associate = (models) => {
    AvaliacaoFormador.belongsTo(models.Utilizador, { foreignKey: 'formador' });
    models.Utilizador.hasMany(AvaliacaoFormador, { foreignKey: 'formador' });

    AvaliacaoFormador.belongsTo(models.Utilizador, { foreignKey: 'formando' });
    models.Utilizador.hasMany(AvaliacaoFormador, { foreignKey: 'formando' });
  };

  ['beforeCreate', 'beforeUpdate'].forEach(hook => {
    AvaliacaoFormador.addHook(hook, async (curso) => {
      const { Utilizador } = sequelize.models;

      const formador = await Utilizador.findByPk(curso.formador);
      if (!formador || !(await formador.checkPerfil('formador')))
        throw new Error('O utilizador especificado como formador não é válido.');

      const formando = await Utilizador.findByPk(curso.formando);
      if (!formando || !(await formando.checkPerfil('formando')))
        throw new Error('O utilizador especificado como formando não é válido.');
    });
  });

  return AvaliacaoFormador;
};

