import { MongoClient, Db } from 'mongodb'

interface MongoConnectParams {
  mongoConnectionString: string
  mongoDbName: string
}

interface IMongo {
  client?: MongoClient
  db?: Db
  connect(params: MongoConnectParams): Promise<string | { text: string }>
}

export const Mongo: IMongo = {
  async connect({ mongoConnectionString, mongoDbName }: MongoConnectParams) {
    try {
      const client = new MongoClient(mongoConnectionString)

      await client.connect()
      const db = client.db(mongoDbName)

      this.client = client
      this.db = db

      return 'Conectado ao MongoDB!'
    } catch (error) {
      return { text: 'Erro ao conectar ao MongoDB.' }
    }
  },
}
