import React, { useContext } from 'react'
import secureLocalStorage from 'react-secure-storage'
import { NavLink } from 'react-router-dom'
import GeneralButton from '../button/GeneralButton'
import { AuthContext } from '../../../provider/context/AuthProvider'
import mcss from './Navbar.module.css'

export default function Navbar() {
  const { setIsAuth } = useContext(AuthContext)

  const logout = () => {
    setIsAuth(false)
    secureLocalStorage.removeItem('auth')
    secureLocalStorage.removeItem('login')
    secureLocalStorage.removeItem('password')
  }

  return (
    <nav className={mcss.navigation}>
      <div className={mcss.logo}>
        <span>Lainlot - Admin Panel</span>
      </div>
      <ul className={mcss.navLinks}>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? mcss.activeLink : '')}
            to="/about"
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? mcss.activeLink : '')}
            to="/records"
          >
            Records
          </NavLink>
        </li>
      </ul>
      <GeneralButton onClick={logout} className={mcss.logoutButton}>Sign out</GeneralButton>
    </nav>
  )
}
