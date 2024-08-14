//use to connect to database
const sqlConfig = {
    user: 'sa',
    password: 'Soums#2022',
    database: 'master',
    server: 'localhost',
    post: {
        //max number of creations at once
        max: 10,
        //min number of connections that pool should maintain
        min: 0,
        //number of milliseconds connection must sit idle in pool before being closed- will close if idle for more than 30 seconds
        idleTimeoutMillis: 300000
    },
    options: {
        //encrypts connection to Azure SQL Database
        encrypt: false,
        //bypass SSL certificate validation
        trustServerCertificate: true
    }
};

module.exports = sqlConfig;