import client from '../database';
import bcrypt from 'bcrypt';

export interface User {
  id: number | null;
  username: string;
  email: string;
  password: string;  // This should be hashed before storing
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
      const hashedPassword = await bcrypt.hash(user.password, 10);
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
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const sql = 'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *';
      const result = await conn.query<User>(sql, [user.username, user.email, hashedPassword, user.id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to update user with id ${user.id}: ${error}`);
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
