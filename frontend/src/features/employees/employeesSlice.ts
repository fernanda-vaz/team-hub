import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { Employee } from '../../models/employee.model'
import { getEmployeesFromApi } from '../../services/api'

interface EmployeeState {
  data: Employee[]
  filteredData: Employee[]
  activeFilter: boolean | null
  loading: boolean
  error: string | null
}

const initialState: EmployeeState = {
  data: [],
  filteredData: [],
  activeFilter: null,
  loading: false,
  error: null,
}

export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',

  async () => {
    const employees = await getEmployeesFromApi()

    return employees
  }
)

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setActiveFilter(state, action) {
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
        state.loading = true
        state.error = null
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
        state.filteredData = action.payload
        state.activeFilter = null
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Falha ao buscar funcionáros.'
      })
  },
})

export const { setActiveFilter } = employeeSlice.actions
export default employeeSlice.reducer
