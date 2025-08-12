import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';
import { signOut } from '../lib/supabase';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  DollarSign, 
  LogOut, 
  Crown, 
  Settings,
  Bell,
  Download
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscription, currentProduct } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
  };

  const stats = [
    { name: 'Total Revenue', value: '$12,345', icon: DollarSign, change: '+12%', positive: true },
    { name: 'Active Users', value: '1,234', icon: Users, change: '+5%', positive: true },
    { name: 'Conversion Rate', value: '3.24%', icon: TrendingUp, change: '+0.5%', positive: true },
    { name: 'Monthly Growth', value: '23.1%', icon: BarChart3, change: '+2.1%', positive: true },
  ];

  const activities = [
    { time: '2 hours ago', action: 'New user registered', type: 'user' },
    { time: '4 hours ago', action: 'Payment processed', type: 'payment' },
    { time: '6 hours ago', action: 'Data export completed', type: 'system' },
    { time: '8 hours ago', action: 'API integration successful', type: 'integration' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">SaasFlow</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="text-sm text-gray-600">
                {user?.email}
              </div>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Subscription Status */}
          <div className="mb-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🎉 Premium Member</h2>
                <p className="text-purple-100 mb-1">
                  Plan: <span className="font-semibold">{currentProduct?.name || 'Premium'}</span>
                </p>
                <p className="text-purple-100 mb-1">
                  Status: <span className="font-semibold capitalize">{subscription?.subscription_status}</span>
                </p>
                {subscription?.current_period_end && (
                  <p className="text-purple-100">
                    Next billing: {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                  </p>
                )}
              </div>
              <Crown className="h-16 w-16 text-yellow-300" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((item) => (
              <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <item.icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-2xl font-semibold text-gray-900">
                            {item.value}
                          </div>
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            item.positive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.change}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            
            {/* Analytics Chart Placeholder */}
            <div className="lg:col-span-2">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Revenue Analytics
                  </h3>
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Analytics chart would go here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Overview */}
            <div className="lg:col-span-2">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Premium Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-medium text-purple-900 mb-2">Advanced Analytics</h4>
                      <p className="text-sm text-purple-700">Deep insights into your business performance</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Priority Support</h4>
                      <p className="text-sm text-blue-700">24/7 dedicated support for premium members</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Custom Integrations</h4>
                      <p className="text-sm text-green-700">Connect with your favorite tools and services</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">Data Export</h4>
                      <p className="text-sm text-yellow-700">Export your data in multiple formats</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition-colors">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                      <Users className="mr-2 h-4 w-4" />
                      Invite Team
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};