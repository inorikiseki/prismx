import 'dotenv/config'
import mysql from 'mysql2/promise'

const db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

export const db_conn = await mysql.createConnection(db_config)

