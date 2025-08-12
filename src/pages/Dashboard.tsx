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
  CheckCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { subscription, isActive } = useSubscription();

  const handleSignOut = async () => {
    await signOut();
  };

  // Simple stats for testing
  const stats = [
    { name: 'Total Views', value: '2,345', icon: BarChart3 },
    { name: 'Active Users', value: '156', icon: Users },
    { name: 'Growth Rate', value: '12.5%', icon: TrendingUp },
    { name: 'Revenue', value: '$1,234', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Welcome Section */}
          <div className="mb-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">🎉 Bem-vindo ao Dashboard Premium!</h2>
                <p className="text-purple-100 mb-1">
                  Email: <span className="font-semibold">{user?.email}</span>
                </p>
                <p className="text-purple-100 mb-1">
                  Status da Assinatura: <span className="font-semibold capitalize">
                    {isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </p>
                {subscription?.current_period_end && (
                  <p className="text-purple-100">
                    Próxima cobrança: {new Date(subscription.current_period_end * 1000).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              <Crown className="h-16 w-16 text-yellow-300" />
            </div>
          </div>

          {/* Status Check */}
          <div className="mb-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Acesso</h3>
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <p className="text-green-800 font-medium">✅ Acesso Premium Confirmado</p>
                <p className="text-gray-600 text-sm">Você tem acesso completo ao dashboard premium.</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((item) => (
              <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
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
                        <dd className="text-2xl font-semibold text-gray-900">
                          {item.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Content Areas */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            
            {/* Analytics Preview */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Análises Premium
                </h3>
                <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium">Gráficos de Analytics</p>
                    <p className="text-gray-500 text-sm">Dados em tempo real disponíveis</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Recursos Premium
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Dashboard avançado</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Relatórios detalhados</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Suporte prioritário</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Integrações personalizadas</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">Exportação de dados</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Test Content */}
            <div className="lg:col-span-2 bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Conteúdo de Teste
                </h3>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    Este é um dashboard simples para testar o acesso premium. 
                    Apenas usuários com assinatura ativa podem ver este conteúdo.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-purple-100 p-4 rounded-lg text-center">
                      <h4 className="font-semibold text-purple-900">Funcionalidade 1</h4>
                      <p className="text-purple-700 text-sm mt-2">Recurso exclusivo premium</p>
                    </div>
                    <div className="bg-blue-100 p-4 rounded-lg text-center">
                      <h4 className="font-semibold text-blue-900">Funcionalidade 2</h4>
                      <p className="text-blue-700 text-sm mt-2">Análises avançadas</p>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg text-center">
                      <h4 className="font-semibold text-green-900">Funcionalidade 3</h4>
                      <p className="text-green-700 text-sm mt-2">Relatórios personalizados</p>
                    </div>
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