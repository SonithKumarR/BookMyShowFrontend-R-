import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import { theaterAPI } from '../../services/api';
import toast from 'react-hot-toast';

const TheaterManagement = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    totalScreens: 1,
    facilities: ''
  });

  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      const response = await theaterAPI.getAll();
      setTheaters(response);
    } catch (error) {
      console.error('Error fetching theaters:', error);
      toast.error('Failed to load theaters');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await theaterAPI.create(formData);
      toast.success('Theater created successfully');
      setShowForm(false);
      setFormData({
        name: '',
        address: '',
        city: '',
        phone: '',
        email: '',
        totalScreens: 1,
        facilities: ''
      });
      fetchTheaters();
    } catch (error) {
      console.error('Error creating theater:', error);
      toast.error('Failed to create theater');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this theater?')) {
      return;
    }
    try {
      await theaterAPI.delete(id);
      toast.success('Theater deleted successfully');
      fetchTheaters();
    } catch (error) {
      console.error('Error deleting theater:', error);
      toast.error('Failed to delete theater');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Theater Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Theater
        </button>
      </div>

      {/* Theater Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Add New Theater</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Theater Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
              <textarea
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows="2"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  required
                />
                <input
                  type="number"
                  placeholder="Screens"
                  value={formData.totalScreens}
                  onChange={(e) => setFormData({...formData, totalScreens: e.target.value})}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                  min="1"
                  required
                />
              </div>
              <textarea
                placeholder="Facilities (comma separated)"
                value={formData.facilities}
                onChange={(e) => setFormData({...formData, facilities: e.target.value})}
                rows="2"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
                >
                  Create Theater
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Theaters Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-700 rounded-lg p-6 animate-pulse h-48"></div>
          ))}
        </div>
      ) : theaters.length === 0 ? (
        <div className="text-center py-12">
          <FaMapMarkerAlt className="text-4xl text-gray-600 mx-auto mb-4" />
          <div className="text-gray-400">No theaters found</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {theaters.map(theater => (
            <div key={theater.id} className="bg-gray-700 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">{theater.name}</h3>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded">
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(theater.id)}
                    className="p-2 bg-red-600 hover:bg-red-700 rounded"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-400">
                  <FaMapMarkerAlt className="mr-3" />
                  <span>{theater.address}, {theater.city}</span>
                </div>
                <div>
                  <div className="text-gray-400">Phone:</div>
                  <div>{theater.phone}</div>
                </div>
                <div>
                  <div className="text-gray-400">Screens:</div>
                  <div>{theater.totalScreens}</div>
                </div>
                {theater.facilities && (
                  <div>
                    <div className="text-gray-400">Facilities:</div>
                    <div className="text-sm text-gray-300">
                      {theater.facilities.split(',').slice(0, 3).join(', ')}
                      {theater.facilities.split(',').length > 3 && '...'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TheaterManagement;