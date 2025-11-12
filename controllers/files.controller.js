const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const supabase = require('../conf/supabase');
const { File } = require('../models');
const sharp = require('sharp');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid'); // usa uuid v4

const logError = (label, error, context = {}) => {
  console.error(`[${label}]`, {
    message: error.message,
    stack: error.stack,
    ...context
  });
};

exports.uploadFile = async (req, res) => {
  const { description, language, url, duration_seconds, name } = req.body;
  const USER_ID = req.user?.id || 31;

  if (req.file) {
    const { originalname: name, mimetype, path: tempPath, size } = req.file;
    const fileType = [/^image\//, /^video\//, /^audio\//, /^application\/pdf$/]
      .map((r, i) => r.test(mimetype) && ['image', 'link_video', 'audio', 'document'][i])
      .find(Boolean) || 'document';

    try {
      const buffer = fs.readFileSync(tempPath);

      // gera um storage_name único
      const ext = name.includes('.') ? name.slice(name.lastIndexOf('.')) : '';
      const storageName = `${Date.now()}_${uuidv4()}${ext}`;

      // upload com storage_name
      const { error: uploadError } = await supabase.storage
        .from('pint-files')
        .upload(storageName, buffer, { contentType: mimetype, upsert: false });

      if (uploadError) throw new Error(uploadError.message || 'Erro no upload para Supabase');

      fs.unlink(tempPath, () => { });

      const fileData = {
        name,                // nome original
        storage_name: storageName, // nome único para storage
        extension: path.extname(name),
        type: fileType,
        mime_type: mimetype,
        size_bytes: size,
        uploaded_by: USER_ID,
        description,
        url: ['link_video', 'link_web'].includes(fileType) ? url : undefined,
        duration_seconds: ['link_video', 'audio'].includes(fileType) ? +duration_seconds : undefined,
        language,
      };

      if (fileType === 'image') {
        try {
          const { width, height } = await sharp(buffer).metadata();
          Object.assign(fileData, {
            width, height,
            orientation: width > height ? 'landscape' : width < height ? 'portrait' : 'square',
          });
        } catch (sharpError) {
          logError('Sharp Image Metadata Error', sharpError, { name });
        }
      }

      try {
        const file = await File.create(fileData);
        return res.status(201).json({ success: true, message: 'Ficheiro guardado com sucesso', file });
      } catch (dbErr) {
        logError('DB Insert Error (File)', dbErr, { name, USER_ID });
        await supabase.storage.from('pint-files').remove([storageName]);
        return res.status(500).json({ success: false, message: 'Erro ao guardar no sistema', error: dbErr.message });
      }

    } catch (uploadErr) {
      logError('Upload File Error', uploadErr, { name, USER_ID });
      return res.status(500).json({ success: false, message: 'Erro ao guardar o ficheiro', error: uploadErr.message });
    }
  }

  else if (url) {
    try {
      const { hostname } = new URL(url);
      const parts = hostname.replace(/^www\./, '').split('.').filter(p => !['com', 'org', 'net'].includes(p));

      const type = /zoom\.us|teams\.microsoft\.com|skype\.com|meet\.google\.com|webex\.com/i.test(url)
        ? 'aula'
        : /(\.mp4|\.mov|\.avi|youtube\.com|vimeo\.com)/i.test(url)
          ? 'link_video'
          : 'link_web';

      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const pageTitle = $('title').text().trim();

      await File.create({
        name: name ? name : (pageTitle || 'Sem título'),
        extension: null,
        type,
        mime_type: null,
        size_bytes: null,
        uploaded_by: USER_ID,
        description,
        url,
        duration_seconds: duration_seconds ? +duration_seconds : null,
        language,
        platform: parts.length ? parts[0] : 'unknown'
      });

      return res.status(201).json({ success: true, message: 'Link guardado com sucesso' });

    } catch (linkErr) {
      logError('Upload Link Error', linkErr, { url, USER_ID });
      return res.status(500).json({ success: false, message: 'Erro ao guardar o link', error: linkErr.message });
    }
  }

  return res.status(400).json({ success: false, message: 'Nenhum ficheiro ou link enviado' });
};


// exports.uploadFile = async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: 'Nenhum ficheiro enviado' });
//   const { originalname: filename, mimetype, path: tempFilePath, size } = req.file;
//   let { description, language, url } = req.body;
//   let duration_seconds = Number(req.body.duration_seconds);
//   const fileBuffer = fs.readFileSync(tempFilePath);
//   const fileType = ([...new Map([
//     [/^image\//, 'image'],
//     [/^video\//, 'link_video'],
//     [/^audio\//, 'audio'],
//     [/^application\/pdf$/, 'document'],
//   ])].find(([r]) => r.test(mimetype))?.[1] || 'document');

//   try {
//     const { error } = await supabase.storage
//       .from('pint-files')
//       .upload(filename, fileBuffer, {
//         contentType: mimetype,
//         upsert: false,
//       });
//     if (error) throw new Error(error.message);

//     fs.unlink(tempFilePath, () => { });

//     const fileData = {
//       name: filename,
//       extension: path.extname(filename),
//       type: fileType,
//       mime_type: mimetype,
//       size_bytes: size,
//       uploaded_by: 31,
//       description,
//       url: ['link_video', 'link_web'].includes(fileType) ? url : undefined,
//       duration_seconds: ['link_video', 'audio'].includes(fileType) ? Number(duration_seconds) : undefined,
//       language: fileType === 'document' ? language : undefined,
//     };

//     if (fileType === 'image') {
//       const metadata = await sharp(fileBuffer).metadata();
//       fileData.width = metadata.width;
//       fileData.height = metadata.height;
//       fileData.orientation = metadata.width > metadata.height ? 'landscape'
//         : metadata.width < metadata.height ? 'portrait'
//           : 'square';
//     }

//     try {
//       await File.create(fileData);
//       res.status(201).json({ message: 'Ficheiro guardado com sucesso', filename });
//     } catch (e) {
//       await supabase.storage.from('pint-files').remove([filename]);
//       throw e;
//     }
//   } catch (err) {
//     console.error('[files.controller -> uploadFile] ', err.message);
//     res.status(500).json({ message: 'Erro ao guardar o ficheiro' });
//   }
// };

exports.getSignedUrl = async (req, res) => {//POR FAZER
  const { filename } = req.params;

  try {

    const file = await File.findOne({ where: { name: filename } });
    if (!file || !file.storage_name) throw Error('Erro de ficheiro inválido!\n\t' + filename);

    const { data, error } = await supabase.storage
      .from('pint-files')
      .createSignedUrl(file.storage_name, (60 * 60) * +process.env.JWT_EXPIRES_IN);

    console.error(JSON.stringify(error, null, 2));
    if (error) throw new Error('Erro ao criar signed URL:\n ', JSON.stringify(error, null, 2));

    res.redirect(data.signedUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro interno no servidor! ' + err.message });
  }
};

exports.downloadFile = async (req, res) => {
  const { filename } = req.params;

  try {
    const file = await File.findOne({ where: { name: filename } });
    if (!file || !file.storage_name) throw Error('Erro de ficheiro inválido!\n\t' + filename);

    const { data: stream, error } = await supabase.storage
      .from('pint-files')
      .download(file.storage_name);

    if (error || !stream)
      return res.status(404).json({ message: 'Ficheiro não encontrado' });

    res.setHeader('Content-Disposition', `attachment; filename="${(file.name.split('(o-o)')[1] || file.name)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const arrayBuffer = await stream.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('Erro no download:', err);
    res.status(500).json({ message: 'Erro ao transferir ficheiro' });
  }
};

exports.dropFile = async (req, res) => {
  const { filename } = req.params;
  try {
    const file = await File.findOne({ where: { name: filename } });
    if (!file)
      return res.status(404).json({ message: 'Ficheiro não encontrado no DB' });
    const storage_filename = file.storage_name;
    await file.destroy();
    const { error } = await supabase.storage.from('pint-files').remove([storage_filename]);
    if (error) throw new Error(error.message);
    console.log(`${filename} removido com sucesso`);
  } catch (err) {
    console.error('Erro na remoção:', err);
    res.status(500).json({ message: 'Erro ao remover ficheiro' });
  }
}