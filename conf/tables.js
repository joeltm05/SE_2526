require('dotenv').config();
module.exports = (process.env.DB_TABLES || "")
    .split(",")
    .map(group => {
        const [name, singular, plural] = group.split(":");
        return { name, singular, plural };
    });
