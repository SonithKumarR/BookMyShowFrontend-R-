import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">ShowTime</h3>
                        <p className="text-gray-400 mb-6">
                            Book your movie tickets online. Experience the best cinema with premium services.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white">
                                <FaFacebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <FaTwitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <FaInstagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white">
                                <FaYoutube size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><a href="/" className="text-gray-400 hover:text-white">Home</a></li>
                            <li><a href="/movies" className="text-gray-400 hover:text-white">Movies</a></li>
                            <li><a href="/theaters" className="text-gray-400 hover:text-white">Theaters</a></li>
                            <li><a href="/my-tickets" className="text-gray-400 hover:text-white">My Tickets</a></li>
                            <li><a href="/profile" className="text-gray-400 hover:text-white">Profile</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center">
                                <FaPhone className="mr-3 text-gray-400" />
                                <span className="text-gray-400">+91 9876543210</span>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="mr-3 text-gray-400" />
                                <span className="text-gray-400">support@showtime.com</span>
                            </li>
                            <li className="flex items-start">
                                <FaMapMarkerAlt className="mr-3 mt-1 text-gray-400" />
                                <span className="text-gray-400">
                                    123 Movie Street,<br />
                                    Chennai, Tamil Nadu 600001
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
                        <p className="text-gray-400 mb-4">
                            Subscribe to get special offers and updates
                        </p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                            />
                            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-r-lg">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-gray-400 text-sm mb-4 md:mb-0">
                            © 2024 ShowTime. All rights reserved.
                        </div>
                        <div className="flex space-x-6 text-sm">
                            <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
                            <a href="/terms" className="text-gray-400 hover:text-white">Terms of Service</a>
                            <a href="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</a>
                            <a href="/faq" className="text-gray-400 hover:text-white">FAQ</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;