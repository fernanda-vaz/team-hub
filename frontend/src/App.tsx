import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HomePage from './pages/Home'
import DepartmentsPage from './pages/Departments'
import EmployeesPage from './pages/Employees'
import ReportsPage from './pages/Reports'
import { useSelector } from 'react-redux'
import type { RootState } from './app/store'
import { useEffect } from 'react'

function App() {
  const { theme } = useSelector((state: RootState) => state.theme)

  useEffect(() => {
    const root = window.document.documentElement
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)

    root.classList.remove(isDark ? 'light' : 'dark')
    root.classList.add(isDark ? 'dark' : 'light')
  }, [theme])

  return (
    <BrowserRouter>
      <div className='flex bg-gray-200'>
        <Sidebar />
        <main className='flex-1 pb-16 md:pb-0'>
          <Routes>
            <Route path='/home' element={<HomePage />} />
            <Route path='/departments' element={<DepartmentsPage />} />
            <Route path='/employees' element={<EmployeesPage />} />
            <Route path='/reports' element={<ReportsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
