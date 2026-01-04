import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';




// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import MyTicketsPage from './pages/MyTicketsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import { ThemeProvider } from './context/ThemeContext';
import NotFoundPage from './pages/NotFoundPage';


// Protected Route
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gray-900">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              
              {/* Protected Routes */}
              <Route path="/booking/:showId" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />
              
              <Route path="/booking-confirmation/:bookingId" element={
                <ProtectedRoute>
                  <BookingConfirmationPage />
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="/my-tickets" element={
                <ProtectedRoute>
                  <MyTicketsPage />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/*" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
              success: {
                style: {
                  background: '#059669',
                  color: '#fff',
                },
              },
              error: {
                style: {
                  background: '#dc2626',
                  color: '#fff',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;