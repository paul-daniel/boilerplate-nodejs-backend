import client from '../database'

export interface Test {
  id : number | null,
  name : string,
  age : number,
}

export class TestRepository {
  async findAll() : Promise<Test[]> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM test'
      const result = await conn.query<Test>(sql)
      return result.rows
    } catch (error) {
      throw new Error(`unable to fetch all tests : ${error}`)
    } finally {
      conn.release()
    }
  }

  async findById(id : number) : Promise<Test> {
    const conn = await client.connect()
    try {
      const sql = 'SELECT * FROM test WHERE id = $1'
      const result = await conn.query<Test>(sql, [id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`unable to fetch test with id ${id} : ${error}`)
    } finally {
      conn.release()
    }
  }

  async create(test : Test) : Promise<Test> {
    const conn = await client.connect()
    try {
      const sql = 'INSERT INTO test(name, age) VALUES($1, $2) RETURNING *'
      const result = await conn.query(sql, [test.name, test.age])
      conn.release()
      return result.rows[0]
    } catch (error) {
      throw new Error(`unable to create test : ${error}`)
    }
  }

  async update(test : Test) : Promise<Test> {
    const conn = await client.connect()
    try {
      const sql = `UPDATE test SET name=$1,age= $2 WHERE id = $3 RETURNING *`
      const result = await conn.query<Test>(sql, [test.name, test.age, test.id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`unable to update test with id ${test.id} : ${error}`)
    } finally {
      conn.release()
    }
  }

  async delete(id : number) : Promise<void> {
    const conn = await client.connect()
    try {
      const sql = 'DELETE FROM test WHERE id = $1'
      await conn.query(sql, [id])
    } catch (error) {
      throw new Error(`unable to delete test with id ${id} : ${error}`)
    } finally {
      conn.release()
    }
  }
}
