import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit'
import type { Employee } from '../../models/employee.model'
import {
  addEmployeeToApi,
  deleteEmployeeFromApi,
  getEmployeesFromApi,
  updateEmployeeInApi,
} from '../../services/api'

type NewEmployee = Omit<Employee, '_id'>
interface EmployeeState {
  data: Employee[]
  filteredData: Employee[]
  activeFilter: boolean | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: EmployeeState = {
  data: [],
  filteredData: [],
  activeFilter: null,
  status: 'idle',
  error: null,
}

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',

  async () => {
    const employees = await getEmployeesFromApi()
    return employees
  }
)

export const addEmployee = createAsyncThunk(
  'employees/addEmployee',

  async (employeeData: NewEmployee) => {
    const newEmployee = await addEmployeeToApi(employeeData)
    return newEmployee
  }
)

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',

  async ({ id, data }: { id: string; data: Partial<NewEmployee> }) => {
    const updatedEmployee = await updateEmployeeInApi(id, data)
    return updatedEmployee
  }
)

export const deleteEmployee = createAsyncThunk(
  'employee/deleteEmployee',

  async (id: string) => {
    await deleteEmployeeFromApi(id)
    return id
  }
)

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setActiveFilter(state, action: PayloadAction<boolean | null>) {
      state.activeFilter = action.payload
      state.filteredData =
        action.payload === null
          ? state.data
          : state.data.filter((emp) => emp.ativo === action.payload)
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
        state.filteredData = action.payload
        state.activeFilter = null
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Falha ao buscar funcionáros.'
      })

      .addCase(
        addEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          state.data.push(action.payload)
          state.filteredData.push(action.payload)
        }
      )

      .addCase(
        updateEmployee.fulfilled,
        (state, action: PayloadAction<Employee>) => {
          const index = state.data.findIndex(
            (emp) => emp._id === action.payload._id
          )

          const filteredIndex = state.filteredData.findIndex(
            (emp) => emp._id === action.payload._id
          )

          if (index !== -1) state.data[index] = action.payload

          if (filteredIndex !== -1)
            state.filteredData[filteredIndex] = action.payload
        }
      )

      .addCase(
        deleteEmployee.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.data = state.data.filter((emp) => emp._id !== action.payload)
          state.filteredData = state.filteredData.filter(
            (emp) => emp._id !== action.payload
          )
        }
      )
  },
})

export const { setActiveFilter } = employeeSlice.actions
export default employeeSlice.reducer
