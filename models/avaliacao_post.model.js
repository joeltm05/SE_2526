module.exports = (sequelize, DataTypes) => {
  const AvaliacaoPost = sequelize.define('AvaliacaoPost', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    post: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    utilizador: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizadores',
        key: 'id'
      }
    },
    avaliacao_post: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    data_avaliacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'avaliacoes_posts',
    underscored: true,
    indexes: [
      { fields: ['utilizador'] },
      { fields: ['post'] },
      { fields: ['avaliacao_post'] },
      { unique: true, fields: ['utilizador', 'post'] }
    ]
  });

  AvaliacaoPost.associate = (models) => {
    AvaliacaoPost.belongsTo(models.Post, { foreignKey: 'post' });
    models.Post.hasMany(AvaliacaoPost, { foreignKey: 'post' });

    AvaliacaoPost.belongsTo(models.Utilizador, { foreignKey: 'utilizador' });
    models.Utilizador.hasMany(AvaliacaoPost, { foreignKey: 'utilizador' });
  };

  ['beforeCreate', 'beforeUpdate'].forEach(hook => {
    AvaliacaoPost.addHook(hook, async (avaliacaoPost) => {
      const { Utilizador } = sequelize.models;

      const formador_formando = await Utilizador.findByPk(avaliacaoPost.utilizador);
      if (!formador_formando || !(await formador_formando.checkPerfil('formador', 'formando')))
        throw new Error('O utilizador especificado como formador ou formando não é válido.');
    });
  });

  return AvaliacaoPost;
};