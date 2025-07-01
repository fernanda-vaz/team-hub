import { configureStore } from '@reduxjs/toolkit'
import employeesReducer from '../features/employees/employeesSlice'
import uiReducer from '../features/ui/uiSlice'
import themeReducer from '../features/theme/themeSlice'

export const store = configureStore({
  reducer: {
    employees: employeesReducer,
    ui: uiReducer,
    theme: themeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
