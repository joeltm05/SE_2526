// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// const uploadPath = path.resolve(__dirname, '..', 'files');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         fs.mkdir(uploadPath, { recursive: true }, (err) => {
//             if (err)
//                 return cb(err);
//             cb(null, uploadPath);
//         });
//     },
//     filename: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         const base = path.basename(file.originalname, ext);
//         // cb(null, `${base}-${Date.now()}${ext}`);
//         cb(null, `${base}${ext}`);
//     }
// });

// const upload = multer({ storage });

// module.exports = upload;
const multer = require('multer');
const os = require('os');

const upload = multer({
    dest: os.tmpdir(), // pasta temporária do SO para guardar ficheiros
    limits: {
        fileSize: 10 * 1024 * 1024 // opcional: limite 10 MB por ficheiro
    }
});

module.exports = upload;
