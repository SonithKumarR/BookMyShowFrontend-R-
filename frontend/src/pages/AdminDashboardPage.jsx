import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaFilm, 
  FaTheaterMasks, 
  FaTicketAlt,
  FaRupeeSign,
  FaChartLine,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt
} from 'react-icons/fa';
import { adminAPI, movieAPI, theaterAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalMovies: 0,
    totalTheaters: 0,
    totalUsers: 0,
    totalRevenue: 0,
    revenueChart: []
  });
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [users, setUsers] = useState([]);
  const [showMovieForm, setShowMovieForm] = useState(false);
  const [showTheaterForm, setShowTheaterForm] = useState(false);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    cast: '',
    director: '',
    duration: '',
    language: '',
    genre: '',
    releaseDate: '',
    posterUrl: '',
    trailerUrl: ''
  });
  const [theaterForm, setTheaterForm] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    totalScreens: 1,
    facilities: ''
  });

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchDashboardData();
    }
  }, [user]);

  useEffect(() => {
    if (activeSection === 'movies') {
      fetchMovies();
    } else if (activeSection === 'theaters') {
      fetchTheaters();
    } else if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const response = await movieAPI.getAll();
      setMovies(response);
    } catch (error) {
      console.error('Error fetching movies:', error);
      toast.error('Failed to load movies');
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await theaterAPI.getAll();
      setTheaters(response);
    } catch (error) {
      console.error('Error fetching theaters:', error);
      toast.error('Failed to load theaters');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  const handleCreateMovie = async () => {
    try {
      await movieAPI.create(movieForm);
      toast.success('Movie created successfully');
      setShowMovieForm(false);
      setMovieForm({
        title: '',
        description: '',
        cast: '',
        director: '',
        duration: '',
        language: '',
        genre: '',
        releaseDate: '',
        posterUrl: '',
        trailerUrl: ''
      });
      fetchMovies();
    } catch (error) {
      console.error('Error creating movie:', error);
      toast.error('Failed to create movie');
    }
  };

  const handleCreateTheater = async () => {
    try {
      await theaterAPI.create(theaterForm);
      toast.success('Theater created successfully');
      setShowTheaterForm(false);
      setTheaterForm({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
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

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) {
      return;
    }
    try {
      await movieAPI.delete(id);
      toast.success('Movie deleted successfully');
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('Failed to delete movie');
    }
  };

  const handleDeleteTheater = async (id) => {
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

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-400">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="flex">
        <div className="w-64 bg-gray-800 min-h-screen p-6">
          <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            {['dashboard', 'movies', 'theaters', 'users', 'bookings', 'reports'].map(section => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors capitalize ${
                  activeSection === section
                    ? 'bg-red-600'
                    : 'hover:bg-gray-700'
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeSection === 'dashboard' && (
            <div>
              <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold">{stats.totalBookings}</div>
                      <div className="text-gray-400">Total Bookings</div>
                    </div>
                    <FaTicketAlt className="text-3xl text-red-500" />
                  </div>
                  <div className="text-sm text-green-400">
                    +12% from last month
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold">{stats.totalMovies}</div>
                      <div className="text-gray-400">Total Movies</div>
                    </div>
                    <FaFilm className="text-3xl text-blue-500" />
                  </div>
                  <div className="text-sm text-green-400">
                    +5 new this month
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold">{stats.totalTheaters}</div>
                      <div className="text-gray-400">Total Theaters</div>
                    </div>
                    <FaTheaterMasks className="text-3xl text-yellow-500" />
                  </div>
                  <div className="text-sm text-green-400">
                    +2 new this month
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
                      <div className="text-gray-400">Total Revenue</div>
                    </div>
                    <FaRupeeSign className="text-3xl text-green-500" />
                  </div>
                  <div className="text-sm text-green-400">
                    +18% from last month
                  </div>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-gray-800 p-6 rounded-lg mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Revenue Overview</h3>
                  <FaChartLine className="text-2xl text-green-500" />
                </div>
                <div className="h-64 flex items-end space-x-2">
                  {stats.revenueChart.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-red-500 rounded-t-lg"
                        style={{ height: `${(item.revenue / 10000) * 100}%` }}
                      />
                      <div className="text-sm text-gray-400 mt-2">{item.month}</div>
                      <div className="text-xs">₹{item.revenue}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                      <div>
                        <div className="font-semibold">New booking received</div>
                        <div className="text-sm text-gray-400">Booking #BKG{Date.now() + index}</div>
                      </div>
                      <div className="text-sm text-gray-400">2 hours ago</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'movies' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Movie Management</h1>
                <button
                  onClick={() => setShowMovieForm(true)}
                  className="flex items-center px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Add New Movie
                </button>
              </div>

              {/* Movies List */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="p-4 text-left">Movie</th>
                        <th className="p-4 text-left">Language</th>
                        <th className="p-4 text-left">Genre</th>
                        <th className="p-4 text-left">Release Date</th>
                        <th className="p-4 text-left">Rating</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {movies.map(movie => (
                        <tr key={movie.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={movie.posterUrl}
                                alt={movie.title}
                                className="w-12 h-16 object-cover rounded"
                              />
                              <div>
                                <div className="font-semibold">{movie.title}</div>
                                <div className="text-sm text-gray-400">{movie.duration} mins</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{movie.language}</td>
                          <td className="p-4">{movie.genre}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-2 text-gray-400" />
                              {new Date(movie.releaseDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="px-2 py-1 bg-yellow-900/30 text-yellow-400 rounded text-sm">
                                {movie.rating}/10
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded">
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteMovie(movie.id)}
                                className="p-2 bg-red-600 hover:bg-red-700 rounded"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'theaters' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Theater Management</h1>
                <button
                  onClick={() => setShowTheaterForm(true)}
                  className="flex items-center px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Add New Theater
                </button>
              </div>

              {/* Theaters List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {theaters.map(theater => (
                  <div key={theater.id} className="bg-gray-800 rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">{theater.name}</h3>
                    <div className="text-gray-400 mb-4">{theater.address}, {theater.city}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Screens:</span>
                        <span>{theater.totalScreens}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Phone:</span>
                        <span>{theater.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span>{theater.email}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-6">
                      <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                        <FaEdit className="mx-auto" />
                      </button>
                      <button
                        onClick={() => handleDeleteTheater(theater.id)}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                      >
                        <FaTrash className="mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <h1 className="text-3xl font-bold mb-8">User Management</h1>
              
              {/* Users List */}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="p-4 text-left">User</th>
                        <th className="p-4 text-left">Email</th>
                        <th className="p-4 text-left">Phone</th>
                        <th className="p-4 text-left">Role</th>
                        <th className="p-4 text-left">Joined</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                <FaUsers />
                              </div>
                              <div>
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-sm text-gray-400">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{user.email}</td>
                          <td className="p-4">{user.phone || 'N/A'}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              user.role === 'ADMIN'
                                ? 'bg-purple-900/30 text-purple-400'
                                : 'bg-green-900/30 text-green-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                                Edit Role
                              </button>
                              <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
                                Block
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Movie Form Modal */}
      {showMovieForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Add New Movie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  value={movieForm.title}
                  onChange={e => setMovieForm({...movieForm, title: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Director</label>
                <input
                  type="text"
                  value={movieForm.director}
                  onChange={e => setMovieForm({...movieForm, director: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cast</label>
                <input
                  type="text"
                  value={movieForm.cast}
                  onChange={e => setMovieForm({...movieForm, cast: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration (mins)</label>
                <input
                  type="number"
                  value={movieForm.duration}
                  onChange={e => setMovieForm({...movieForm, duration: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                <input
                  type="text"
                  value={movieForm.language}
                  onChange={e => setMovieForm({...movieForm, language: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                <input
                  type="text"
                  value={movieForm.genre}
                  onChange={e => setMovieForm({...movieForm, genre: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Release Date</label>
                <input
                  type="date"
                  value={movieForm.releaseDate}
                  onChange={e => setMovieForm({...movieForm, releaseDate: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Poster URL</label>
                <input
                  type="text"
                  value={movieForm.posterUrl}
                  onChange={e => setMovieForm({...movieForm, posterUrl: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={movieForm.description}
                  onChange={e => setMovieForm({...movieForm, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Trailer URL</label>
                <input
                  type="text"
                  value={movieForm.trailerUrl}
                  onChange={e => setMovieForm({...movieForm, trailerUrl: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleCreateMovie}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
              >
                Create Movie
              </button>
              <button
                onClick={() => setShowMovieForm(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theater Form Modal */}
      {showTheaterForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-6">Add New Theater</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  value={theaterForm.name}
                  onChange={e => setTheaterForm({...theaterForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
                <input
                  type="text"
                  value={theaterForm.city}
                  onChange={e => setTheaterForm({...theaterForm, city: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <textarea
                  value={theaterForm.address}
                  onChange={e => setTheaterForm({...theaterForm, address: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">State</label>
                <input
                  type="text"
                  value={theaterForm.state}
                  onChange={e => setTheaterForm({...theaterForm, state: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pincode</label>
                <input
                  type="text"
                  value={theaterForm.pincode}
                  onChange={e => setTheaterForm({...theaterForm, pincode: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={theaterForm.phone}
                  onChange={e => setTheaterForm({...theaterForm, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={theaterForm.email}
                  onChange={e => setTheaterForm({...theaterForm, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Total Screens</label>
                <input
                  type="number"
                  value={theaterForm.totalScreens}
                  onChange={e => setTheaterForm({...theaterForm, totalScreens: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Facilities</label>
                <textarea
                  value={theaterForm.facilities}
                  onChange={e => setTheaterForm({...theaterForm, facilities: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleCreateTheater}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold"
              >
                Create Theater
              </button>
              <button
                onClick={() => setShowTheaterForm(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;