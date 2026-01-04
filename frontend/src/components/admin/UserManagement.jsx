import React, { useState, useEffect } from 'react';
import { FaUsers, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getUsers();
            setUsers(response);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async (userId, newRole) => {
        try {
            await adminAPI.updateUserRole(userId, newRole);
            toast.success('User role updated');
            fetchUsers();
        } catch (error) {
            console.error('Error updating role:', error);
            toast.error('Failed to update role');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        
        try {
            await adminAPI.deleteUser(userId);
            toast.success('User deleted');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="bg-gray-900 text-white p-6 rounded-lg">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <FaUsers className="text-3xl text-blue-500 mr-4" />
                    <div>
                        <h2 className="text-2xl font-bold">User Management</h2>
                        <p className="text-gray-400">Manage system users and their roles</p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold">{users.length}</div>
                    <div className="text-sm text-gray-400">Total Users</div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <FaFilter className="text-gray-400" />
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All Roles</option>
                        <option value="USER">Users</option>
                        <option value="ADMIN">Admins</option>
                        <option value="THEATER_OWNER">Theater Owners</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-800">
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
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-8 text-center text-gray-400">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
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
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                                            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="USER">User</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="THEATER_OWNER">Theater Owner</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 bg-red-600 hover:bg-red-700 rounded"
                                                title="Delete User"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-lg font-bold">
                        {users.filter(u => u.role === 'USER').length}
                    </div>
                    <div className="text-sm text-gray-400">Regular Users</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-lg font-bold">
                        {users.filter(u => u.role === 'ADMIN').length}
                    </div>
                    <div className="text-sm text-gray-400">Admins</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-lg font-bold">
                        {users.filter(u => u.role === 'THEATER_OWNER').length}
                    </div>
                    <div className="text-sm text-gray-400">Theater Owners</div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;