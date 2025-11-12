const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Sincrono = sequelize.define('Sincrono', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    curso: {
      type: DataTypes.INTEGER,
      unique: true,
      references: {
        model: 'cursos',
        key: 'id'
      }
    },
    formador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizadores',
        key: 'id'
      }
    },
    vagas: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_limite_inscricao: {
      type: DataTypes.DATE,
      allowNull: false
    }
    // ,
    // presencas_aula: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // }
  }, {
    tableName: 'sincronos',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['formador'],
      },
      {
        fields: ['curso'],
      },
      {
        fields: ['vagas'],
      },
    ]
  });
  Sincrono.associate = (models) => {
    Sincrono.belongsTo(models.Curso, { foreignKey: 'curso' });
    models.Curso.hasMany(Sincrono, { foreignKey: 'curso' });

    Sincrono.belongsTo(models.Utilizador, { foreignKey: 'formador' });
    models.Utilizador.hasMany(Sincrono, { foreignKey: 'formador' });
  };

  ['beforeCreate', 'beforeUpdate'].forEach(hook => {
    Sincrono.addHook(hook, async (curso) => {
      const { Utilizador, Assincrono } = sequelize.models;

      const formador = await Utilizador.findByPk(curso.formador);
      if (!formador || !(await formador.checkPerfil('formador')))
        throw new Error('O utilizador especificado como formador não é válido.');

      const whereCurso = { curso: curso.curso };
      if (hook === 'beforeUpdate')
        whereCurso.id = { [Op.ne]: curso.id };

      const cursoExist = await Assincrono.findOne({ where: whereCurso });
      if (cursoExist)
        throw new Error('Curso já está registado como Assincrono.');
    });
  });
  return Sincrono;
};