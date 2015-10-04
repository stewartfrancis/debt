module.exports = {
    database: 'c9',
    username: process.env.C9_USER,
    password: null,
    options: {
        dialect: 'mysql',
        host: process.env.IP,
    }
}