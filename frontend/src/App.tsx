import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import HomePage from './pages/Home'
import DepartmentsPage from './pages/Departments'
import EmployeesPage from './pages/Employees'
import ReportsPage from './pages/Reports'
import SettingsPage from './pages/Settings'
import VacationsPage from './pages/Vacations'

function App() {
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
            <Route path='/settings' element={<SettingsPage />} />
            <Route path='/vacations' element={<VacationsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
