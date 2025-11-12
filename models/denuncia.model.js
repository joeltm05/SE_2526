module.exports = (sequelize, DataTypes) => {
  const Denuncia = sequelize.define('Denuncia', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    utilizador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizadores',
        key: 'id'
      }
    },
    post: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    observacao: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ''
    },
    data_denuncia: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    tipo_denuncia: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tipos_denuncias',
        key: 'id'
      }
    }
  }, {
    tableName: 'denuncias',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['utilizador'],
        fields: ['tipo_denuncia'],
        fields: ['post']
      }
    ]
  });
  Denuncia.associate = (models) => {
    Denuncia.belongsTo(models.Utilizador, { foreignKey: 'utilizador' });
    models.Utilizador.hasMany(Denuncia, { foreignKey: 'utilizador' });

    Denuncia.belongsTo(models.Post, { foreignKey: 'post' });
    models.Post.hasMany(Denuncia, { foreignKey: 'post' });

    Denuncia.belongsTo(models.TipoDenuncia, { foreignKey: 'tipo_denuncia' });
    models.TipoDenuncia.hasMany(Denuncia, { foreignKey: 'tipo_denuncia' });
  };

  ['beforeCreate', 'beforeUpdate'].forEach(hook => {
    Denuncia.addHook(hook, async (curso) => {
      const { Utilizador } = sequelize.models;

      const formador_formando = await Utilizador.findByPk(curso.utilizador);
      if (!formador_formando || !(await formador_formando.checkPerfil('formador', 'formando')))
        throw new Error('O utilizador especificado como formador ou formando não é válido.');
    });
  });

  return Denuncia;
};


/*
Denuncia.belongsTo(Utilizador, { foreignKey: 'utilizador' });
Utilizador.hasMany(Denuncia, { foreignKey: 'utilizador' });

Denuncia.belongsTo(Post, { foreignKey: 'post' });
Post.hasMany(Denuncia, { foreignKey: 'post' });

Denuncia.belongsTo(TipoDenuncia, { foreignKey: 'tipo_denuncia' });
TipoDenuncia.hasMany(Denuncia, { foreignKey: 'tipo_denuncia' });
*/