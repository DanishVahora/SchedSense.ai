const pool = require('../config/database');

class ServiceProvider {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS service_providers (
                id SERIAL PRIMARY KEY,
                business_name VARCHAR(100) NOT NULL,
                contact_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                address JSONB,
                time_zone VARCHAR(50) DEFAULT 'UTC',
                working_hours JSONB,
                business_license VARCHAR(255),
                payment_details JSONB,
                logo_url VARCHAR(255),
                description TEXT,
                is_approved BOOLEAN DEFAULT false,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS services (
                id SERIAL PRIMARY KEY,
                provider_id INTEGER REFERENCES service_providers(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                description TEXT,
                duration INTEGER NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS provider_availability (
                id SERIAL PRIMARY KEY,
                provider_id INTEGER REFERENCES service_providers(id) ON DELETE CASCADE,
                date DATE NOT NULL,
                start_time TIME NOT NULL,
                end_time TIME NOT NULL,
                is_blocked BOOLEAN DEFAULT false,
                reason VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS booking_rules (
                id SERIAL PRIMARY KEY,
                provider_id INTEGER REFERENCES service_providers(id) ON DELETE CASCADE,
                minimum_notice_hours INTEGER DEFAULT 24,
                buffer_time_minutes INTEGER DEFAULT 15,
                max_advance_booking_days INTEGER DEFAULT 90,
                allow_same_day_booking BOOLEAN DEFAULT true,
                cancellation_policy TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS notification_templates (
                id SERIAL PRIMARY KEY,
                provider_id INTEGER REFERENCES service_providers(id) ON DELETE CASCADE,
                template_type VARCHAR(50) NOT NULL,
                subject VARCHAR(255),
                content TEXT NOT NULL,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_providers_email ON service_providers(email);
            CREATE INDEX IF NOT EXISTS idx_providers_business_name ON service_providers(business_name);
            CREATE INDEX IF NOT EXISTS idx_services_provider ON services(provider_id);
            CREATE INDEX IF NOT EXISTS idx_availability_provider_date ON provider_availability(provider_id, date);
        `;

        try {
            await pool.query(query);
            console.log('Service provider tables created successfully');
        } catch (error) {
            console.error('Error creating service provider tables:', error);
            throw error;
        }
    }

    static async findByEmail(email) {
        const query = 'SELECT * FROM service_providers WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    static async findById(id) {
        const query = `
            SELECT id, business_name, contact_name, email, phone, address, time_zone,
                   working_hours, logo_url, description, is_approved, is_active,
                   created_at, updated_at
            FROM service_providers WHERE id = $1
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async create(providerData) {
        const {
            businessName, contactName, email, password, phone, address,
            timeZone, workingHours, businessLicense, paymentDetails,
            logoUrl, description
        } = providerData;

        const query = `
            INSERT INTO service_providers (
                business_name, contact_name, email, password, phone, address,
                time_zone, working_hours, business_license, payment_details,
                logo_url, description
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id, business_name, contact_name, email, phone, address,
                      time_zone, working_hours, logo_url, description, created_at
        `;

        const values = [
            businessName, contactName, email, password, phone, address,
            timeZone, workingHours, businessLicense, paymentDetails,
            logoUrl, description
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async update(id, updateData) {
        const fields = [];
        const values = [];
        let paramCount = 1;

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = $${paramCount}`);
                values.push(updateData[key]);
                paramCount++;
            }
        });

        if (fields.length === 0) {
            throw new Error('No fields to update');
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
            UPDATE service_providers 
            SET ${fields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, business_name, contact_name, email, phone, address,
                      time_zone, working_hours, logo_url, description, is_approved,
                      is_active, updated_at
        `;

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM service_providers WHERE id = $1 RETURNING id';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async findAll(limit = 10, offset = 0, filters = {}) {
        let query = `
            SELECT id, business_name, contact_name, email, phone, address,
                   time_zone, working_hours, logo_url, description, is_approved,
                   is_active, created_at, updated_at
            FROM service_providers
        `;
        
        const conditions = [];
        const values = [];
        let paramCount = 1;

        if (filters.isApproved !== undefined) {
            conditions.push(`is_approved = $${paramCount}`);
            values.push(filters.isApproved);
            paramCount++;
        }

        if (filters.isActive !== undefined) {
            conditions.push(`is_active = $${paramCount}`);
            values.push(filters.isActive);
            paramCount++;
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        values.push(limit, offset);

        const result = await pool.query(query, values);
        return result.rows;
    }

    // Service management methods
    static async addService(providerId, serviceData) {
        const { name, description, duration, price } = serviceData;
        const query = `
            INSERT INTO services (provider_id, name, description, duration, price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        const result = await pool.query(query, [providerId, name, description, duration, price]);
        return result.rows[0];
    }

    static async getServices(providerId) {
        const query = 'SELECT * FROM services WHERE provider_id = $1 AND is_active = true';
        const result = await pool.query(query, [providerId]);
        return result.rows;
    }

    static async updateService(serviceId, serviceData) {
        const { name, description, duration, price, isActive } = serviceData;
        const query = `
            UPDATE services 
            SET name = $1, description = $2, duration = $3, price = $4, is_active = $5
            WHERE id = $6
            RETURNING *
        `;
        const result = await pool.query(query, [name, description, duration, price, isActive, serviceId]);
        return result.rows[0];
    }

    // Availability management
    static async setAvailability(providerId, availabilityData) {
        const { date, startTime, endTime, isBlocked, reason } = availabilityData;
        const query = `
            INSERT INTO provider_availability (provider_id, date, start_time, end_time, is_blocked, reason)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (provider_id, date, start_time) 
            DO UPDATE SET end_time = $4, is_blocked = $5, reason = $6
            RETURNING *
        `;
        const result = await pool.query(query, [providerId, date, startTime, endTime, isBlocked, reason]);
        return result.rows[0];
    }

    static async getAvailability(providerId, startDate, endDate) {
        const query = `
            SELECT * FROM provider_availability 
            WHERE provider_id = $1 AND date BETWEEN $2 AND $3
            ORDER BY date, start_time
        `;
        const result = await pool.query(query, [providerId, startDate, endDate]);
        return result.rows;
    }

    // Booking rules management
    static async setBookingRules(providerId, rulesData) {
        const {
            minimumNoticeHours, bufferTimeMinutes, maxAdvanceBookingDays,
            allowSameDayBooking, cancellationPolicy
        } = rulesData;

        const query = `
            INSERT INTO booking_rules (
                provider_id, minimum_notice_hours, buffer_time_minutes,
                max_advance_booking_days, allow_same_day_booking, cancellation_policy
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (provider_id)
            DO UPDATE SET 
                minimum_notice_hours = $2, buffer_time_minutes = $3,
                max_advance_booking_days = $4, allow_same_day_booking = $5,
                cancellation_policy = $6
            RETURNING *
        `;

        const result = await pool.query(query, [
            providerId, minimumNoticeHours, bufferTimeMinutes,
            maxAdvanceBookingDays, allowSameDayBooking, cancellationPolicy
        ]);
        return result.rows[0];
    }

    static async getBookingRules(providerId) {
        const query = 'SELECT * FROM booking_rules WHERE provider_id = $1';
        const result = await pool.query(query, [providerId]);
        return result.rows[0];
    }
}

module.exports = ServiceProvider;