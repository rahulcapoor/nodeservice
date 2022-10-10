const sql = require('mssql')
const config = {server: process.env.DATABASE_SERVER || 'localhost',
port: 1433,
user: process.env.DATABASE_USER || 'sa',
password: process.env.DATABASE_PASSWORD || 'Adm!n@123',
database: process.env.DATABASE_NAME || 'DILIGENT',
connectionTimeout: 3000,
trustServerCertificate: true,
}

const dbConnection = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, dbConnection
}