import client from '../database'

export interface Test {
  id : number,
  name : string,
  age : number,
}

export class TestRepository {
  async findAll() : Promise<Test[]> {
    try {
      const conn = await client.connect()
      const sql = 'SELECT * FROM test'
      const result = await conn.query(sql)
      conn.release()
      return result.rows
    } catch (error) {
      throw new Error(`unable to fetch all tests : ${error}`)
    }
  }
}
