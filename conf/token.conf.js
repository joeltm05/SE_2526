require('dotenv').config();
if (!process.env.JWT_SECRET)
    console.log('ERRO IN JWT_SECRET -> token.conf');
module.exports = {
    jwtSecret: process.env.JWT_SECRET || null
}
