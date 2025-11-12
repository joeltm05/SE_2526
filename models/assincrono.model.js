const { Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Assincrono = sequelize.define('Assincrono', {
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
    }
  }, {
    tableName: 'assincronos',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['curso']
      }
    ]
  });

  Assincrono.associate = (models) => {
    Assincrono.belongsTo(models.Curso, { foreignKey: 'curso' });
    models.Curso.hasMany(Assincrono, { foreignKey: 'curso' });
  };

  ['beforeCreate', 'beforeUpdate'].forEach(hook => {
    Assincrono.addHook(hook, async (curso) => {
      const { Sincrono } = sequelize.models;

      const whereCurso = { curso: curso.curso };
      if (hook === 'beforeUpdate')
        whereCurso.id = { [Op.ne]: curso.id };

      const cursoExist = await Sincrono.findOne({ where: whereCurso });

      if (cursoExist)
        throw new Error('Curso já está registado como Sincrono.');
    });
  });

  return Assincrono;
};
