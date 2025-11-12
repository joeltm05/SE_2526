module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
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
    topico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'topicos',
        key: 'id'
      }
    },
    // curso: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: 'cursos',
    //     key: 'id'
    //   }
    // },
    titulo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    denuncia: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    file: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'files',
        key: 'id'
      }
    }
    // ,
    // reward: {
    // type: DataTypes.INTEGER,
    // allowNull: false,
    // defaultValue: 0
    // }
  }, {
    tableName: 'posts',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['utilizador'],
        fields: ['topico']
      }
    ]
  });
  Post.associate = (models) => {

    Post.belongsTo(models.Utilizador, { foreignKey: 'utilizador' });
    models.Utilizador.hasMany(Post, { foreignKey: 'utilizador' });

    Post.belongsTo(models.Topico, { foreignKey: 'topico' });
    models.Topico.hasMany(Post, { foreignKey: 'topico' });

    // Post.belongsTo(models.Curso, { foreignKey: 'curso' });
    // models.Curso.hasMany(Post, { foreignKey: 'curso' });

    Post.belongsTo(models.File, { foreignKey: 'file' });
    models.File.hasMany(Post, { foreignKey: 'file' });
  };


  ['beforeCreate', 'beforeUpdate'].forEach(hook => {
    Post.addHook(hook, async (post) => {
      const { Utilizador } = sequelize.models;

      // if (!post.curso && !post.topico)
        // throw new Error("Topico ou Curso tem de ser atribuídos a tópico");

      const formador_formando = await Utilizador.findByPk(post.utilizador);
      if (!formador_formando || !(await formador_formando.checkPerfil('formador', 'formando')))
        throw new Error('O utilizador especificado como formador ou formando não é válido.');
    });
  });
  return Post;
};


/*Post.belongsTo(Utilizador, { foreignKey: 'utilizador' });
Utilizador.hasMany(Post, { foreignKey: 'utilizador' });

Post.belongsTo(Topico, { foreignKey: 'topico' });
Topico.hasMany(Post, { foreignKey: 'topico' });

Post.belongsTo(Curso, { foreignKey: 'curso' });
Curso.hasMany(Post, { foreignKey: 'curso' });
*/