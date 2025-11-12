module.exports = (sequelize, DataTypes) => {
  const Notificacao = sequelize.define('Notificacao', {
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
    curso: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cursos',
        key: 'id'
      }
    },
    tipo: {
      type: DataTypes.ENUM('push', 'mail'),
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    mensagem: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    data_envio: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'notificacoes',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['utilizador'],
      },
      {
        fields: ['curso']
      }
    ]
  });
  Notificacao.associate = (models) => {

    Notificacao.belongsTo(models.Utilizador, { foreignKey: 'utilizador' });
    models.Utilizador.hasMany(Notificacao, { foreignKey: 'utilizador' });

    Notificacao.belongsTo(models.Curso, { foreignKey: 'curso' });
    models.Curso.hasMany(Notificacao, { foreignKey: 'curso' });
  };
  ['beforeCreate', 'beforeUpdate'].forEach(hook => {
    Notificacao.addHook(hook, async (notification) => {
      const { Utilizador } = sequelize.models;

      const utilizador = await Utilizador.findByPk(notification.utilizador);
      if (!utilizador)
        throw new Error('Utilizador inválido!');
      if (utilizador.checkPerfil('formador', 'gestor_admin') && notification.tipo === 'push')
        throw new Error('Apenas formandos podem receber notificações push!');
    });
  });

  return Notificacao;

};