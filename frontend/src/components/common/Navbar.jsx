import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser, FaTicketAlt, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Theaters', path: '/theaters' },
  ]

  if (isAdmin()) {
    menuItems.push({ name: 'Admin', path: '/admin' })
  }

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FaTicketAlt className="text-2xl text-red-500" />
            <span className="text-2xl font-bold">ShowTime</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="hover:text-red-400 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/my-tickets"
                  className="flex items-center space-x-2 hover:text-red-400"
                >
                  <FaTicketAlt />
                  <span>My Tickets</span>
                </Link>
                
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 hover:text-red-400"
                >
                  <FaUser />
                  <span>{user.name}</span>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-red-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="hover:text-red-400 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/my-tickets"
                    className="flex items-center space-x-2 hover:text-red-400 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaTicketAlt />
                    <span>My Tickets</span>
                  </Link>
                  
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 hover:text-red-400 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FaUser />
                    <span>{user.name}</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-left"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:text-red-400 transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors text-center py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar