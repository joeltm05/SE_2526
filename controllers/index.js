// const filesController = require('./files.controller');
// const genController = require('./main.controller');
// const authController = require('./auth.controller');

// module.exports = { filesController, genController, authController };
const { uploadFile, getSignedUrl, downloadFile, dropFile } = require('./files.controller');
const { getAll, getOne, getFilteredData, createRow, updateRow, deleteRow } = require('./main.controller');
const { registerUser, loginUser, logoutUser, getAuthUser, updatePassword, verifyToken, sendMail, sendNotification, pushToken } = require('./auth.controller');

module.exports = {
    uploadFile,
    getSignedUrl,
    downloadFile,
    dropFile,
    getAll,
    getOne,
    getFilteredData,
    createRow,
    updateRow,
    deleteRow,
    registerUser,
    loginUser,
    logoutUser,
    getAuthUser,
    updatePassword,
    verifyToken,
    sendMail,
    sendNotification,
    pushToken
};
