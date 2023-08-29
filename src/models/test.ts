import client from '../database'

export interface Test {
  id : number,
  name : string,
  age : number,
}

export class TestRepository {
  async findAll() : Promise<Test[]> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM test'
      const result = await conn.query<Test>(sql)
      conn.release()
      return result.rows
    } catch (error) {
      throw new Error(`unable to fetch all tests : ${error}`)
    } finally {
      conn.release()
    }
  }
}
