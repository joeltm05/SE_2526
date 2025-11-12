module.exports = (sequelize, DataTypes) => {

  const Topico = sequelize.define('Topico', {
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
      allowNull: true
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    // denuncia_flag: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: DataTypes.NOW
    // },
    // reward: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   defaultValue: 0
    // },
    aprovado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    area: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'areas',
        key: 'id'
      }
    }
  }, {
    tableName: 'topicos',
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['nome']
      }
    ]
  });
  Topico.associate = (models) => {
    Topico.belongsTo(models.Area, { foreignKey: 'area' });
    models.Area.hasMany(Topico, { foreignKey: 'area' });
  };


  return Topico;
};
/*
Topico.belongsTo(Area, { foreignKey: 'area' });
Area.hasMany(Topico, { foreignKey: 'area' });
*/