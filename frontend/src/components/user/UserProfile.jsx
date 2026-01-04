import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEdit, FaSave } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Profile Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          {isEditing ? (
            <>
              <FaSave className="mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <FaEdit className="mr-2" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <FaUser className="mr-2" />
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            ) : (
              <div className="px-4 py-3 bg-gray-700 rounded-lg">{user.name}</div>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <FaEnvelope className="mr-2" />
              Email Address
            </label>
            <div className="px-4 py-3 bg-gray-700 rounded-lg">{user.email}</div>
            <p className="text-sm text-gray-400 mt-1">Email cannot be changed</p>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <FaPhone className="mr-2" />
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            ) : (
              <div className="px-4 py-3 bg-gray-700 rounded-lg">
                {user.phone || 'Not provided'}
              </div>
            )}
          </div>

          {/* Joined Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              <FaCalendarAlt className="mr-2" />
              Member Since
            </label>
            <div className="px-4 py-3 bg-gray-700 rounded-lg">
              {new Date(user.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <button
              type="submit"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: user.name,
                  phone: user.phone
                });
              }}
              className="ml-4 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default UserProfile;