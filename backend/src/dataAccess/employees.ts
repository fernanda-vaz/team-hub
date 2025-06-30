import { InsertOneResult, ObjectId, WithId } from 'mongodb'
import { Mongo } from '../database/mongo.js'

export interface Employee {
  _id: ObjectId
  nome: string
  dataNascimento: string
  cpf: string
  rg: string
  email: string
  dataContratacao: string
  sexo: 'feminino' | 'masculino'
  cargo: string
  departamento: string
  ativo: boolean
}

export type NewEmployee = Omit<Employee, '_id'>

const collectionName = 'employees'

export default class EmployeesDataAccess {
  private get collection() {
    if (!Mongo.db) {
      throw new Error(
        'Database not connected. Please call Mongo.connect() before using this class.'
      )
    }
    return Mongo.db.collection<Employee>(collectionName)
  }

  async getEmployees(): Promise<Employee[]> {
    const result = await this.collection.find({}).toArray()
    return result
  }

  async addEmployee(
    employeeData: NewEmployee
  ): Promise<InsertOneResult<Employee>> {
    const result = await this.collection.insertOne(employeeData as any)
    return result
  }

  async deleteEmployee(employeeId: string): Promise<WithId<Employee> | null> {
    const result = await this.collection.findOneAndDelete({
      _id: new ObjectId(employeeId),
    })
    return result
  }

  async updateEmployee(
    employeeId: string,
    employeeData: Partial<NewEmployee>
  ): Promise<WithId<Employee> | null> {
    const result = await this.collection.findOneAndUpdate(
      { _id: new ObjectId(employeeId) },
      { $set: employeeData },
      { returnDocument: 'after' }
    )

    return result
  }
}
