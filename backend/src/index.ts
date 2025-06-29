import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import { Mongo } from './database/mongo.js'
import employeesRouter from './routes/employees.js'

config()

async function main() {
  const hostname = 'localhost'
  const port = 3000

  const app = express()

  const mongoConnection = await Mongo.connect({
    mongoConnectionString: process.env.MONGO_CS as string,
    mongoDbName: process.env.MONGO_DB_NAME as string,
  })

  console.log(mongoConnection)

  app.use(express.json())
  app.use(cors())

  app.get('/', (req, res) => {
    res.send({ success: true, statusCode: 200, body: 'Bem vindo ao Team Hub!' })
  })

  app.use('/employees', employeesRouter)

  app.listen(port, () => {
    console.log(`Servidor rodando em: http://${hostname}:${port}`)
  })
}

main()
