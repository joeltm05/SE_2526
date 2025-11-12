module.exports = (sequelize, DataTypes) => {

    const Categoria = sequelize.define('Categoria', {
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
        }
        // ,
        // contexto: {
        //     type: DataTypes.TEXT,
        //     allowNull: false
        // }
    }, {
        tableName: 'categorias',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                fields: ['nome']
            }
        ]
    });
    
    return Categoria;
};