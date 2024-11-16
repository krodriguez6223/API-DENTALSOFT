import pool from '../database.js';

export const createRoles = async () => {
    try {
        const rol = await pool.connect();

        const query = `
            SELECT COUNT(*) FROM administracion.rol;
        `;
        const result = await rol.query(query);

        const count = parseInt(result.rows[0].count);

        if (count > 0) {
            rol.release();
            return;
        }

        const roleValues = ['Administrador', 'Empleado']; // Cambiamos a una sola matriz plana

        const insertQuery = `
            INSERT INTO administracion.rol (nombre)
            VALUES ($1), ($2);
        `;

        await rol.query(insertQuery, roleValues);

        rol.release();
        console.log("Roles creados con éxito");

    } catch (error) {
        console.error("Error occurred:", error);
        throw error;
    }
};
