import React, { Component } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // Log error to error reporting service
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
                    <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 text-center">
                        <div className="inline-block p-4 bg-red-900/30 rounded-full mb-6">
                            <FaExclamationTriangle className="text-4xl text-red-400" />
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
                        <p className="text-gray-400 mb-6">
                            We're sorry for the inconvenience. Please try again.
                        </p>
                        
                        <div className="space-y-4">
                            <button
                                onClick={this.handleRetry}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
                            >
                                Reload Page
                            </button>
                            
                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full py-3 border border-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Go to Homepage
                            </button>
                        </div>
                        
                        {import.meta.env.DEV && this.state.error && (
                            <div className="mt-6 p-4 bg-gray-900 rounded-lg text-left">
                                <div className="text-sm text-gray-400 mb-2">Error Details:</div>
                                <div className="text-xs text-red-400 font-mono overflow-auto">
                                    {this.state.error.toString()}
                                    <br />
                                    {this.state.errorInfo?.componentStack}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;