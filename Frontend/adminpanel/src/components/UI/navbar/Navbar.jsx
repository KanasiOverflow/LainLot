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
      <GeneralButton onClick={logout}>Sign out</GeneralButton>
      <ul className="stroke-animation">
        <li>
          <NavLink
            className={({ isActive }) => (isActive ? 'active' : '')}
            to="/about"
          >
            About site
          </NavLink>
        </li>
        <li>
          <NavLink to="/records">Records</NavLink>
        </li>
      </ul>
    </nav>
  )
}
