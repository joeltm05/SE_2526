module.exports = (sequelize, DataTypes) => {
  const TrabalhoSubmetido = sequelize.define('TrabalhoSubmetido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    curso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cursos',
        key: 'id'
      }
    },
    file: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'files',
        key: 'id'
      }
    },
    observacao: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    nota: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      validate: {
        min: 0,
        max: 20
      }
    }
  }, {
    tableName: 'trabalhos_submetidos',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['curso'],
      },
      {
        fields: ['nota']
      }
    ]
  });
  TrabalhoSubmetido.associate = (models) => {

    TrabalhoSubmetido.belongsTo(models.Curso, { foreignKey: 'curso' });
    models.Curso.hasMany(TrabalhoSubmetido, { foreignKey: 'curso' });

    TrabalhoSubmetido.belongsTo(models.File, { foreignKey: 'file' });
    models.File.hasMany(TrabalhoSubmetido, { foreignKey: 'file' });
  };

  ['beforeCreate', 'beforeUpdate'].forEach(hook => {
    TrabalhoSubmetido.addHook(hook, async (trabalho_submetido) => {
      const { File, Utilizador } = sequelize.models;

      const file = await File.findByPk(trabalho_submetido.file);
      const formando = await Utilizador.findByPk(file.uploaded_by);
      if (!formando || !(await formando.checkPerfil('formando')))
        throw new Error('O utilizador especificado como formando não é válido.');
    });
  });

  return TrabalhoSubmetido;

};
