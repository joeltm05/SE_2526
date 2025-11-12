module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true
    },
    storage_name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM('document', 'image', 'link_web', 'link_video', 'audio', 'aula'),
      allowNull: false,
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilizadores',
        key: 'id'
      }
    },
    uploaded_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    extension: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    size_bytes: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    orientation: {
      type: DataTypes.ENUM('landscape', 'portrait', 'square'),
      allowNull: true,
    },
    language: {
      type: DataTypes.ENUM('pt_PT', 'en_UK', 'es_ES'),
      allowNull: true,
    },
    duration_seconds: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    platform: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'files',  // nome da tabela correta para este modelo
    timestamps: false,
    underscored: true,
  });

  File.addHook('beforeCreate', file => {
    const requiredFields = {
      image: ['width', 'height', 'orientation', 'mime_type'],
      document: ['extension', 'mime_type'],
      link_video: ['url', 'duration_seconds', 'platform'],
      audio: ['extension', 'duration_seconds', 'mime_type'],
      link_web: ['url', 'platform'],
      aula: ['description', 'url', 'language', 'duration_seconds', 'platform']
    }[file.type];

    if (!requiredFields) return; // tipo desconhecido, não valida

    // Só verifica se campos presentes são válidos — permite criar com campos ausentes
    for (const f of requiredFields) {
      if (file[f] === null || file[f] === undefined) {
        console.warn(`Aviso: campo obrigatório "${f}" ausente para tipo "${file.type}"`);
        // não lança erro, só avisa (podes ajustar aqui para lançar erro se quiseres)
      }
    }
  });


  return File;
};



