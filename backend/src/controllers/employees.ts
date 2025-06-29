import { InsertOneResult, WithId } from 'mongodb'
import EmployeesDataAccess, {
  Employee,
  NewEmployee,
} from '../dataAccess/employees.js'
import { ok, serverError, notFound } from '../helpers/httpResponse.js'

export default class EmployeesControllers {
  private dataAccess: EmployeesDataAccess
  constructor() {
    this.dataAccess = new EmployeesDataAccess()
  }

  async getEmployees() {
    try {
      const employees = await this.dataAccess.getEmployees()
      return ok<Employee[]>(employees)
    } catch (error) {
      return serverError(error)
    }
  }

  async addEmployee(employeeData: NewEmployee) {
    try {
      const result = await this.dataAccess.addEmployee(employeeData)
      return ok<InsertOneResult<Employee>>(result)
    } catch (error) {
      return serverError(error)
    }
  }

  async deleteEmployee(employeeId: string) {
    try {
      const result = await this.dataAccess.deleteEmployee(employeeId)

      if (!result) {
        return notFound(`Funcionário com ID '${employeeId}' não encontrado.`)
      }

      return ok<WithId<Employee>>(result)
    } catch (error) {
      return serverError(error)
    }
  }

  async updateEmployee(employeeId: string, employeeData: Partial<NewEmployee>) {
    try {
      const result = await this.dataAccess.updateEmployee(
        employeeId,
        employeeData
      )

      if (!result) {
        return notFound(`Funcionário com ID '${employeeId}' não encontrado.`)
      }

      return ok<WithId<Employee>>(result)
    } catch (error) {
      return serverError(error)
    }
  }
}
