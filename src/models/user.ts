import client from '../database';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'

dotenv.config()
const pepper = process.env.BCRYPT_PASSWORD
const saltRounds = Number(process.env.SALT_ROUNDS)

export interface User {
  id: number | null;
  username: string;
  email: string;
  password: string| null;  // This should be hashed before storing
}

export class UserRepository {
  async findAll(): Promise<User[]> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM users';
      const result = await conn.query<User>(sql);
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to fetch all users: ${error}`);
    } finally {
      conn.release();
    }
  }

  async findById(id: number): Promise<User> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM users WHERE id = $1';
      const result = await conn.query<User>(sql, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to fetch user with id ${id}: ${error}`);
    } finally {
      conn.release();
    }
  }

  async findByUsername(username: string): Promise<User> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM users WHERE username = $1';
      const result = await conn.query<User>(sql, [username]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to fetch user with username ${username}: ${error}`);
    } finally {
      conn.release();
    }
  }

  async create(user: User): Promise<User> {
    const conn = await client.connect();
    try {
      if(!user.password) throw new Error('Password is required');
      const hashedPassword = await bcrypt.hash(user.password+pepper, saltRounds);
      const sql = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query<User>(sql, [user.username, user.email, hashedPassword]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create user: ${error}`);
    } finally {
      conn.release();
    }
  }

  async update(user: User): Promise<User> {
    const conn = await client.connect();
    try {
      let hashedPassword: string;
  
      // If a new password is provided, hash it.
      if (user.password) {
        hashedPassword = await bcrypt.hash(user.password + pepper, saltRounds);
      } else {
        // If no new password is provided, use the existing one.
        const existingUser = await this.findById(user.id as number);
        hashedPassword = existingUser.password as string;
      }
  
      const sql = 'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *';
      const result = await conn.query<User>(sql, [user.username, user.email, hashedPassword, user.id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to update user with id ${user.id}: ${error}`);
    } finally {
      conn.release();
    }
  }

  async authenticate(username : string, password : string): Promise<User> {
    const conn = await client.connect();
    try {
      const sql = 'SELECT * FROM users WHERE username = $1';

      const result = await conn.query<User>(sql, [username]);
      if(result.rows.length === 0) throw new Error('Invalid username or password');
      const user = result.rows[0];

      const isValidPassword = await bcrypt.compare(password + pepper, user.password as string);
      if(!isValidPassword) throw new Error('Invalid username or password');

      return user;
    } catch (error) {
      throw new Error(`Unable to authenticate user ${username}: ${error}`);
    } finally {
      conn.release();
    }
  }
  

  async delete(id: number): Promise<void> {
    const conn = await client.connect();
    try {
      const sql = 'DELETE FROM users WHERE id = $1';
      await conn.query(sql, [id]);
    } catch (error) {
      throw new Error(`Unable to delete user with id ${id}: ${error}`);
    } finally {
      conn.release();
    }
  }
}
