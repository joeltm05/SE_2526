module.exports = (sequelize, DataTypes) => {
    const Perfil = sequelize.define('Perfil', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipo: {
            type: DataTypes.ENUM('formador', 'formando', 'gestor_admin'),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
        {
            tableName: 'perfis',
            timestamps: false,
            underscored: true,
            indexes: [
                {
                    fields: ['tipo']
                }
            ],
        });
    Perfil.prototype.isAdmin = function () {
        return this.tipo === 'gestor_admin';
    }
    Perfil.prototype.isFormador = function () {
        return this.tipo === 'formador';
    }
    Perfil.prototype.isFormando = function () {
        return this.tipo === 'formando';
    }

    // Definir associações
    Perfil.associate = function (models) {
        // Perfil tem muitos Utilizadores
        Perfil.hasMany(models.Utilizador, {
            foreignKey: 'tipo',
            as: 'Utilizadores'
        });
    };

    return Perfil;
};
