import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
}

const getInitialTheme = (): Theme => {
  const storedTheme = localStorage.getItem('theme')
  return (storedTheme as Theme) || 'system'
}

const initialState: ThemeState = {
  theme: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
  },
})

export const { setTheme } = themeSlice.actions
export default themeSlice.reducer
