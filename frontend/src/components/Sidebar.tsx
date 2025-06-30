import { useEffect, useState } from 'react'
import { toggleSidebar } from '../features/ui/uiSlice'
import {
  BriefcaseIcon,
  CalendarIcon,
  GraphIcon,
  HomeIcon,
  MenuIcon,
  SettingsIcon,
  UsersIcon,
} from './ui/icons'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'

const menuItems = [
  {
    key: 'item1',
    icon: <HomeIcon />,
    path: '/home',
    label: 'Início',
  },
  {
    key: 'item2',
    icon: <UsersIcon />,
    path: '/employees',
    label: 'Funcionários',
  },
  {
    key: 'item3',
    icon: <BriefcaseIcon />,
    path: '/departments',
    label: 'Departamentos',
  },
  {
    key: 'item4',
    icon: <GraphIcon />,
    path: '/reports',
    label: 'Relatórios',
  },
  {
    key: 'item5',
    icon: <CalendarIcon />,
    path: '/vacations',
    label: 'Férias/Ausências',
  },
  {
    key: 'item6',
    icon: <SettingsIcon />,
    path: '/settings',
    label: 'Configurações',
  },
]

const Sidebar = () => {
  const location = useLocation()
  const [activeKey, setActiveKey] = useState('')

  const isSidebarOpen = useSelector(
    (state: RootState) => state.ui.isSidebarOpen
  )
  const dispatch: AppDispatch = useDispatch()

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  useEffect(() => {
    const currentItem = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    )
    setActiveKey(currentItem?.key || '')
  }, [location.pathname])

  return (
    <>
      <div
        className={`hidden md:flex h-screen bg-gray-200 text-white flex-col py-4 px-4 gap-y-4 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-24'
        }`}
      >
        <button
          onClick={handleToggleSidebar}
          className='flex items-center justify-center h-12 w-12 rounded-lg hover:bg-gray-300 transition-colors mb-4 cursor-pointer'
        >
          <MenuIcon />
        </button>
        <div className='flex flex-col gap-2'>
          {menuItems.map((item) => {
            const isActive = item.key === activeKey
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`relative flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-300 text-black'
                    : 'hover:bg-gray-500 text-black/30 hover:text-white'
                } ${!isSidebarOpen && 'justify-center'}`}
                onClick={() => setActiveKey(item.key)}
              >
                <div className='w-8 h-8 rounded-lg flex items-center justify-center transition'>
                  {item.icon}
                </div>

                {isSidebarOpen && (
                  <span className='whitespace-nowrap font-medium'>
                    {item.label}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Bottom Navigation Mobile */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 bg-default flex justify-around items-center py-2 z-50 bg-gray-200'>
        {menuItems.map((item) => {
          const isActive = item.key === activeKey
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg transition ${
                isActive ? 'bg-gray-300' : 'hover:bg-gray-500'
              }`}
              onClick={() => setActiveKey(item.key)}
            >
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  isActive ? 'text-black' : 'text-black/40'
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`text-xs mt-1 ${
                  isActive ? 'text-black font-medium' : 'text-black/40'
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </>
  )
}

export default Sidebar
