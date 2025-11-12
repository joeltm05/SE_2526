
module.exports = (sequelize, DataTypes) => {

  const ConteudoCurso = sequelize.define('ConteudoCurso', {
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
    visivel: {//possibilidade de ocultar
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    disponibilizado: {//está no curso ou n
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  }, {
    tableName: 'conteudos_cursos',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['curso'],
        fields: ['visivel'],
      }
    ]
  });
  ConteudoCurso.associate = (models) => {
    ConteudoCurso.belongsTo(models.Curso, { foreignKey: 'curso' });
    models.Curso.hasMany(ConteudoCurso, { foreignKey: 'curso' });

    ConteudoCurso.belongsTo(models.File, { foreignKey: 'file' });
    models.File.hasMany(ConteudoCurso, { foreignKey: 'file' });
  };
  return ConteudoCurso;
};


/*
ConteudoCurso.belongsTo(Cursos, { foreignKey: 'curso' });
Cursos.hasMany(ConteudoCurso, { foreignKey: 'curso' });

ConteudoCurso.belongsTo(TipoConteudo, { foreignKey: 'tipo_conteudo' });
TipoConteudo.hasMany(ConteudoCurso, { foreignKey: 'tipo_conteudo' });

*/