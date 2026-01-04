import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
            newErrors.phone = 'Phone must be 10 digits';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        try {
            setLoading(true);
            
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined
            };
            
            const result = await signup(userData);
            
            if (result.success) {
                toast.success('Registration successful! Please check your email to verify your account.');
                navigate('/login');
            } else {
                toast.error(result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Signup error:', error);
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl shadow-2xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-400">
                        Or{' '}
                        <Link to="/login" className="font-medium text-red-500 hover:text-red-400">
                            sign in to existing account
                        </Link>
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                <FaUser className="inline mr-2" />
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                    errors.name ? 'border-red-500' : 'border-gray-600'
                                }`}
                                placeholder="John Doe"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                <FaEnvelope className="inline mr-2" />
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                    errors.email ? 'border-red-500' : 'border-gray-600'
                                }`}
                                placeholder="you@example.com"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>
                        
                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                                <FaPhone className="inline mr-2" />
                                Phone Number (Optional)
                            </label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                    errors.phone ? 'border-red-500' : 'border-gray-600'
                                }`}
                                placeholder="9876543210"
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                            )}
                        </div>
                        
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                <FaLock className="inline mr-2" />
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                    errors.password ? 'border-red-500' : 'border-gray-600'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-400">
                                Must be at least 6 characters
                            </p>
                        </div>
                        
                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                <FaCheck className="inline mr-2" />
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                            )}
                        </div>
                    </div>
                    
                    {/* Terms and Conditions */}
                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            required
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-700"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                            I agree to the{' '}
                            <a href="/terms" className="text-red-500 hover:text-red-400">
                                Terms & Conditions
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-red-500 hover:text-red-400">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                    
                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : 'Create Account'}
                        </button>
                    </div>
                </form>
                
                {/* Demo Info */}
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-800 text-gray-400">
                                For testing purposes
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 text-center text-gray-400 text-sm">
                        <p>Use any valid email. No verification required for demo.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;