import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'

dotenv.config()

const app = express()
let port:number | string

if (process.env.MODE === 'test') {
  port = process.env.PORT_TEST || 5001
} else {
  port = process.env.PORT || 5000
}

app.use(morgan('dev'))

app.get('/', (req : express.Request, res : express.Response) => {
  res.send('hello world')
})

app.listen(port, () => {
  console.log(`Server listening on port localhost:${port}`)
})

export default app
