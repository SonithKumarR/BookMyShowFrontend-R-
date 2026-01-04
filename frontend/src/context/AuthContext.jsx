import React, { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const API_URL = 'http://localhost:8080/api'

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
      // Set default axios header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      })
      
      const { token, ...userData } = response.data
      
      // Store token and user data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(userData)
      toast.success('Login successful!')
      navigate('/')
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData)
      
      toast.success('Registration successful! Please login.')
      navigate('/login')
      
      return { success: true }
    } catch (error) {
      console.error('Signup error:', error)
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return { success: false, message }
    }
  }

  const logout = async () => {
    try {
      // Call logout API
      await axios.post(`${API_URL}/auth/logout`)
    } catch (error) {
      console.error('Logout API error:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Remove axios header
      delete axios.defaults.headers.common['Authorization']
      
      // Clear user state
      setUser(null)
      
      toast.success('Logged out successfully!')
      navigate('/login')
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const response = await axios.put(`${API_URL}/users/profile`, profileData)
      
      // Update local storage
      const updatedUser = { ...user, ...profileData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      toast.success('Profile updated successfully!')
      return { success: true }
    } catch (error) {
      console.error('Update profile error:', error)
      toast.error('Failed to update profile')
      return { success: false }
    }
  }

  const isAdmin = () => {
    return user?.role === 'ADMIN'
  }

  const value = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isAdmin,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext