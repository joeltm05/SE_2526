//????????????????????????????????????????????????????????????????
require('dotenv').config();
module.exports = (sequelize, DataTypes) => {
    const Utilizador = sequelize.define('Utilizador', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tipo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'perfis',
                key: 'id'
            },
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        telemovel: {
            type: DataTypes.STRING(14),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        endereco: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        data_nascimento: {
            type: DataTypes.DATE,
            allowNull: false
        },
        sexo: {
            type: DataTypes.ENUM('M', 'F'),
            allowNull: false,
            defaultValue: 'M'
        },
        criacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        papel_date: {
            type: DataTypes.DATE,
            allowNull: false
        },
        descricao: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        logado: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    }, {
        tableName: 'utilizadores',
        timestamps: false,
        underscored: true,
        indexes: [
            {
                fields: ['sexo'],
                fields: ['data_nascimento']
            }
        ]
    });

    Utilizador.prototype.checkPerfil = async function (...perfis) {
        if (perfis.some(p => !(process.env.PROFILE_TYPE?.split(',').map(p => p.trim()) || []).includes(p))) return false;
        if (!this.Perfil) this.Perfil = await sequelize.models.Perfil.findByPk(this.tipo);
        if (!this.Perfil) return false;

        const fnMap = {
            formador: this.Perfil.isFormador,
            formando: this.Perfil.isFormando,
            gestor_admin: this.Perfil.isAdmin
        };

        return perfis.some(p => fnMap[p]?.call(this.Perfil));
    };

    // Definir associações
    Utilizador.associate = function (models) {
        // Utilizador pertence a um Perfil
        Utilizador.belongsTo(models.Perfil, {
            foreignKey: 'tipo',
            as: 'Perfil'
        });
    };

    return Utilizador;
};