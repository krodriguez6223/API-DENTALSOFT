
import pkg from 'pg';
const { Pool } = pkg;

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'dental-soft',
    password: '123',
    port: 5432,
}); 

async function checkDatabaseConnection() {
    try {
        const client = await pool.connect();
        console.log('Conexión a la base de datos exitosa');
        client.release(); // Libera el cliente de la conexión
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
}

checkDatabaseConnection();
export default pool;