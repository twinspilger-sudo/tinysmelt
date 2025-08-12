import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Crown } from 'lucide-react';

export const Success: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Welcome to SaasFlow Premium!
          </h2>
          <p className="text-lg text-gray-600">
            Your subscription is now active and ready to use.
          </p>
          {sessionId && (
            <p className="mt-2 text-xs text-gray-500">
              Session ID: {sessionId}
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center mb-4">
            <Crown className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">What's included:</h3>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              Full access to premium dashboard
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              Advanced analytics and reporting
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              Priority customer support
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              Custom integrations and API access
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
              Team collaboration tools
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:scale-105"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Dashboard
          </Link>
          
          <Link
            to="/dashboard"
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
          >
            Explore Features
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our{' '}
            <a href="mailto:support@saasflow.com" className="text-purple-600 hover:text-purple-500">
              support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};