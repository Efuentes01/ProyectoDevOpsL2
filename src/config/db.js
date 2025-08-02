import sql from 'mssql';
import 'dotenv/config';  

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    trustServerCertificate: true,
    encrypt: false
  }
};

const poolPromise = sql.connect(config)
  .then(pool => {
    console.log('✅ Conexión a SQL Server establecida');
    return pool;
  })
  .catch(err => {
    console.error('❌ Error al conectar a SQL Server:');
    console.error('🧠 Detalles:', err.message || err);
    throw err; // re-lanzamos para que cualquier `await poolPromise` falle también
  });

export { sql, poolPromise };

