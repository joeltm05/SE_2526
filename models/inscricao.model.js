module.exports = (sequelize, DataTypes) => {
  const Inscricao = sequelize.define('Inscricao', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    formando: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizadores',
        key: 'id'
      }
    },
    curso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cursos',
        key: 'id'
      }
    },
    avaliacao: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'avaliacoes',
        key: 'id'
      }
    },
    data_inscricao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    certificado_gerado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    min_presencas: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'inscricoes',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['formando'],
      },
      {
        fields: ['curso'],
      },
      {
        fields: ['avaliacao'],
      }
    ]
  });

  Inscricao.associate = (models) => {
    Inscricao.belongsTo(models.Utilizador, { foreignKey: 'formando' });
    models.Utilizador.hasMany(Inscricao, { foreignKey: 'formando' });

    Inscricao.belongsTo(models.Curso, { foreignKey: 'curso' });
    models.Curso.hasMany(Inscricao, { foreignKey: 'curso' });

    Inscricao.belongsTo(models.Avaliacao, { foreignKey: 'avaliacao' });
    models.Avaliacao.hasMany(Inscricao, { foreignKey: 'avaliacao' });
  };

  ['beforeCreate', 'beforeUpdate'].forEach(hook => {
    Inscricao.addHook(hook, async (inscricao) => {
      const { Utilizador, Curso } = sequelize.models;

      const formando = await Utilizador.findByPk(inscricao.formando);
      if (!formando || !(await formando.checkPerfil('formando')))
        throw new Error('O utilizador especificado como formando não é válido.');

      const curso = await Curso.findByPk(inscricao.curso);
      if (!curso)
        throw new Error('O curso especificado não é válido.');

      const record = await Inscricao.findOne({
        where: {
          curso: curso.id,
          formando: formando.id
        }
      });
      if (record) throw new Error(`${formando.username} já se encontra inscrito em ${curso.nome}!`);
    });
  });

  return Inscricao;
};
/*
Inscricao.belongsTo(Formando, { foreignKey: 'formando' });
Formando.hasMany(Inscricao, { foreignKey: 'formando' });

Inscricao.belongsTo(Curso, { foreignKey: 'curso' });
Curso.hasMany(Inscricao, { foreignKey: 'curso' });

Inscricao.belongsTo(Avaliacao, { foreignKey: 'avaliacao' });
Avaliacao.hasMany(Inscricao, { foreignKey: 'avaliacao' });
*/