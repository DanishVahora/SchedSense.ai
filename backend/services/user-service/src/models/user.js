const pool = require('../config/database');

class User {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
        `;

        try {
            await pool.query(query);
            console.log('Users table created successfully');
        } catch (error) {
            console.error('Error creating users table:', error);
            throw error;
        }
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = 'SELECT id, username, email, first_name, last_name, is_active, created_at, updated_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async create(userData) {
        const { username, email, password, firstName, lastName } = userData;
        const query = `
            INSERT INTO users (username, email, password, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, first_name, last_name, created_at
        `;
        const values = [username, email, password, firstName, lastName];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async update(id, userData) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(userData).forEach(key => {
            if (userData[key] !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(userData[key]);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE users
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, username, email, first_name, last_name, is_active, updated_at
        `;

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findAll(limit = 10, offset = 0) {
        const query = `
            SELECT id, username, email, first_name, last_name, is_active, created_at, updated_at
            FROM users
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const result = await pool.query(query, [limit, offset]);
        return result.rows;
    }
}

module.exports = User;
