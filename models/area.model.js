module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define('Area', { //'area' -> nome do modelo | 'areas'-> nome da tabela
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
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    // contexto: {
    //   type: DataTypes.TEXT,
    //   allowNull: false
    // },
    categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categorias', // string com o nome da tabela referenciada
        key: 'id'
      }
    }
  }, {
    tableName: 'areas',  // nome da tabela correta para este modelo
    timestamps: false,
    underscored: true,
    indexes: [
      {
        fields: ['nome']
      },
      {
        fields: ['categoria']
      }
    ]
  });
  Area.associate = (models) => {
    Area.belongsTo(models.Categoria, { foreignKey: 'categoria' });
    models.Categoria.hasMany(Area, { foreignKey: 'categoria' });
  };

  return Area;
};
