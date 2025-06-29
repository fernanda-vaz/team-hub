import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'

config()

async function main() {
  const hostname = 'localhost'
  const port = 3000

  const app = express()

  app.use(express.json())
  app.use(cors())

  app.get('/', (req, res) => {
    res.send({ success: true, statusCode: 200, body: 'Bem vindo ao Team Hub!' })
  })

  app.listen(port, () => {
    console.log(`Servidor rodando em: http://${hostname}:${port}`)
  })
}

main()
