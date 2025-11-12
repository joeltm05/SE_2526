module.exports = (sequelize, DataTypes) => {

  const Curso = sequelize.define('Curso', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    duracao: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    dia_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dia_fim: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.VIRTUAL,
      get() {
        const n = Date.now(), i = +this.dia_inicio, f = +this.dia_fim;
        return n < i ? '0_pendente' : n <= f ? '1_em_curso' : '2_terminado';
      }
    },
    nivel: {
      type: DataTypes.ENUM('Básico', 'Intermédio', 'Avançado'),
      allowNull: false
    },
    linguagem: {
      type: DataTypes.ENUM('pt_PT', 'en_UK', 'es_ES'),
      allowNull: false
    },
    // progresso: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0
    // },
    // ocorrencias: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0
    // },
    abreviacao: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    visivel_cursos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    ultima_atualizacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    gestor_admin: {
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
    }
  }, {
    tableName: 'cursos',
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ['topico'] },
      { fields: ['visivel_cursos'] }
    ]
  });

  Curso.associate = (models) => {
    Curso.belongsTo(models.Utilizador, { foreignKey: 'gestor_admin' });
    models.Utilizador.hasMany(Curso, { foreignKey: 'gestor_admin' });

    Curso.belongsTo(models.Topico, { foreignKey: 'topico' });
    models.Topico.hasMany(Curso, { foreignKey: 'topico' });
  }

  Curso.addHook('beforeCreate', async (curso) => {
    const { Utilizador } = sequelize.models;

    const gestor = await Utilizador.findByPk(curso.gestor_admin);
    if (!gestor || !(await gestor.checkPerfil('gestor_admin')))
      throw new Error('O utilizador especificado como gestor_admin não é válido.');
  });

  Curso.addHook('beforeUpdate', async (curso) => {
    const { Utilizador } = sequelize.models;

    const gestor = await Utilizador.findByPk(curso.gestor_admin);
    if (!gestor || !(await gestor.checkPerfil('gestor_admin')))
      throw new Error('O utilizador especificado como gestor_admin não é válido.');

    curso.ultima_atualizacao = new Date();
  });

  return Curso;

}
//DONE