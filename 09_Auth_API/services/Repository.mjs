import pg from "pg";

class Repository {
    pool

    constructor() {
        this.pool = new pg.Pool({
            user: process.env.USER_POSTGRES,
            host: process.env.HOST_POSTGRES,
            database: process.env.DATABASE_POSTGRES,
            password: process.env.PASSWORD_POSTGRES,
            port: process.env.PORT_POSTGRES,
        });
    }

    async createUser(user) {
        try {
            const { email, hashPassword, refresh_token, uuid } = user;
            const result = await this.pool.query("INSERT INTO users(email, password, refresh_token, uuid) VALUES ($1,$2,$3,$4) RETURNING id",
                [email, hashPassword, refresh_token, uuid]);
            return result.rows[0].id
        } catch (err) {
            console.log(err);
        }
    }

    async getUserByEmail(email) {
        try {
            const result = await this.pool.query("SELECT * FROM users WHERE email = ($1)", [email]);
            return {
                id: result.rows[0].id,
                email: result.rows[0].email,
                password: result.rows[0].password,
                uuid: result.rows[0].uuid
            }
        } catch (err) {
            console.log(err);
        }
    }

    async getUserByRefreshToken(refresh_token) {
        try {
            const result = await this.pool.query("SELECT id, email FROM users WHERE refresh_token = ($1)", [refresh_token]);
            return {
                id: result.rows[0].id,
                email: result.rows[0].email,
            }
        } catch (err) {
            console.log(err);
        }
    }

    async updateRefereshToken(id, refresh_token) {
        try {
            await this.pool.query("UPDATE users SET refresh_token = ($1) WHERE id = ($2)", [refresh_token, id]);
            return true
        } catch (err) {
            console.log(err);
            return false
        }
    }

    async checkUserByEmail(email) {
        try{
            const result = await this.pool.query("SELECT COUNT(*) FROM users WHERE email = ($1)", [email]);
            return result.rows[0].count > 0;
        }catch(err){
            console.log(err);
            return false
        }
    }
}

export {Repository};