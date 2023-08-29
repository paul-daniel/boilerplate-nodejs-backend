import {PoolConfig, Pool} from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const client = new Pool({
  host: process.env.DB_HOST,
  database: process.env.MODE === 'test' ?
  process.env.TEST_DB_DATABASE : process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
} as PoolConfig)

export default client;
