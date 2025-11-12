// const express = require('express');
// const router = express.Router();
// const { uploadFile, downloadFile } = require('../controllers');
// const { upload } = require('../middlewares');

// router.post('/upload', upload.single('upload_file'), uploadFile);
// router.get('/download/:filename', downloadFile);

// module.exports = router;
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const { uploadFile, downloadFile, getSignedUrl, dropFile } = require('../controllers');
const { upload, authenticateToken } = require('../middlewares');

router.use(authenticateToken);
router.post('/upload',
    upload.single('upload_file'),
    uploadFile
);

router.get('/download/:filename',
    downloadFile
);

router.get('/:filename',
    getSignedUrl
);

router.get('/drop/:filename',
    dropFile
);

module.exports = router;