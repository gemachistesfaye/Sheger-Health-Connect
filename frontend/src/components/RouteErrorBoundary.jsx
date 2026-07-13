import React from 'react';
import { AlertTriangle, RefreshCcw, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('RouteErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={36} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Something went wrong</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              An unexpected error occurred in this section. Please try refreshing or navigate back.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <RefreshCcw size={16} />
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <ArrowLeft size={16} />
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RouteErrorBoundary;