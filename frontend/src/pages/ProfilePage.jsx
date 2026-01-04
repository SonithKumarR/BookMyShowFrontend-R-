import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userAPI, bookingAPI } from '../services/api'
import { FaUser, FaEnvelope, FaPhone, FaTicketAlt, FaCalendarAlt } from 'react-icons/fa'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const { user, updateProfile } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      })
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings()
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await updateProfile(formData)
    if (result.success) {
      toast.success('Profile updated successfully!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-1/4">
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{user?.name}</h3>
                    <p className="text-gray-400 text-sm">{user?.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-red-600' 
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'bookings' 
                        ? 'bg-red-600' 
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    My Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === 'settings' 
                        ? 'bg-red-600' 
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    Account Settings
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:w-3/4">
              {activeTab === 'profile' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FaUser className="inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FaEnvelope className="inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                        disabled
                      />
                      <p className="text-gray-400 text-sm mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        <FaPhone className="inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                      Update Profile
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
                  
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <FaTicketAlt className="text-6xl text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">No bookings yet</p>
                      <a 
                        href="/" 
                        className="inline-block mt-4 text-red-400 hover:text-red-300"
                      >
                        Book your first ticket →
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div key={booking.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-lg">
                                {booking.show?.movie?.title}
                              </h3>
                              <div className="flex items-center text-gray-400 text-sm mt-1">
                                <FaCalendarAlt className="mr-2" />
                                {new Date(booking.show?.showDate).toLocaleDateString()} at{' '}
                                {booking.show?.showTime}
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                              booking.paymentStatus === 'COMPLETED' 
                                ? 'bg-green-900 text-green-300'
                                : booking.paymentStatus === 'PENDING'
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-red-900 text-red-300'
                            }`}>
                              {booking.paymentStatus}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400">Theater</p>
                              <p className="font-semibold">{booking.show?.theater?.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Seats</p>
                              <p className="font-semibold">{booking.seats}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Amount</p>
                              <p className="font-semibold">₹{booking.totalAmount}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Booking ID</p>
                              <p className="font-semibold">{booking.bookingReference}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="border-b border-gray-700 pb-6">
                      <h3 className="text-lg font-semibold mb-3">Change Password</h3>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>
                    
                    <div className="border-b border-gray-700 pb-6">
                      <h3 className="text-lg font-semibold mb-3">Notification Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <span>Email notifications for new bookings</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" defaultChecked />
                          <span>SMS notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-3" />
                          <span>Promotional offers</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="text-red-400">
                      <h3 className="text-lg font-semibold mb-3">Danger Zone</h3>
                      <button className="border border-red-400 text-red-400 hover:bg-red-400 hover:text-white px-4 py-2 rounded-lg transition-colors">
                        Delete Account
                      </button>
                      <p className="text-sm text-gray-400 mt-2">
                        Once you delete your account, there is no going back.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage