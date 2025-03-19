import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Map, Users, BarChart2, Filter } from 'lucide-react';

// Componente de Relatórios e Estatísticas
const ReportsScreen = () => {
  const [territories, setTerritories] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState('progress');
  const [filterPeriod, setFilterPeriod] = useState('month');
  
  // Carrega dados do localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTerritories = JSON.parse(localStorage.getItem('territories')) || [];
        const savedAssignments = JSON.parse(localStorage.getItem('designations')) || [];
        
        setTerritories(savedTerritories);
        setAssignments(savedAssignments);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Calcula estatísticas para os gráficos
  const calculateStats = () => {
    // Estatísticas de progresso de visitas
    const progressStats = territories.reduce((stats, territory) => {
      territory.streets.forEach(street => {
        street.residences.forEach(residence => {
          if (residence.interaction) {
            if (residence.interaction.answer === 'sim') {
              stats.atendeu++;
            } else {
              stats.naoAtendeu++;
            }
            stats.visitados++;
          } else {
            stats.naoVisitados++;
          }
        });
      });
      return stats;
    }, { visitados: 0, naoVisitados: 0, atendeu: 0, naoAtendeu: 0 });
    
    // Calcula total de residências
    const totalResidencias = progressStats.visitados + progressStats.naoVisitados;
    
    // Dados para gráfico de pizza de progresso
    const progressPieData = [
      { name: 'Visitados', value: progressStats.visitados },
      { name: 'Não Visitados', value: progressStats.naoVisitados }
    ];
    
    // Dados para gráfico de pizza de atendimento
    const atendimentoPieData = [
      { name: 'Atendeu', value: progressStats.atendeu },
      { name: 'Não Atendeu', value: progressStats.naoAtendeu }
    ];
    
    // Estatísticas por tipo de imóvel
    const residenceTypeStats = territories.reduce((stats, territory) => {
      territory.streets.forEach(street => {
        street.residences.forEach(residence => {
          const type = residence.type || 'Desconhecido';
          if (!stats[type]) stats[type] = 0;
          stats[type]++;
        });
      });
      return stats;
    }, {});
    
    // Converte para formato de array para gráfico
    const residenceTypeData = Object.keys(residenceTypeStats).map(type => ({
      name: type,
      value: residenceTypeStats[type]
    }));
    
    // Estatísticas de designações por mês
    const assignmentsByMonth = assignments.reduce((stats, assignment) => {
      const date = new Date(assignment.assignmentDate);
      const month = date.toLocaleString('pt-BR', { month: 'long' });
      
      if (!stats[month]) stats[month] = 0;
      stats[month]++;
      
      return stats;
    }, {});
    
    // Converte para formato de array para gráfico
    const monthlyAssignmentData = Object.keys(assignmentsByMonth).map(month => ({
      name: month,
      quantidade: assignmentsByMonth[month]
    }));
    
    // Calcula porcentagens
    const percentageVisited = totalResidencias > 0 
      ? Math.round((progressStats.visitados / totalResidencias) * 100) 
      : 0;
    
    const percentageAnswered = progressStats.visitados > 0 
      ? Math.round((progressStats.atendeu / progressStats.visitados) * 100) 
      : 0;
    
    return {
      progressStats,
      totalResidencias,
      progressPieData,
      atendimentoPieData,
      residenceTypeData,
      monthlyAssignmentData,
      percentageVisited,
      percentageAnswered
    };
  };
  
  const stats = calculateStats();
  
  // Cores para os gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Renderiza a aba atual
  const renderTabContent = () => {
    switch (activeTab) {
      case 'progress':
        return (
          <div>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="text-lg font-bold mb-2">Progresso de Visitas</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <span className="block text-2xl font-bold">{stats.progressStats.visitados}</span>
                  <span className="text-sm text-gray-600">Residências Visitadas</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <span className="block text-2xl font-bold">{stats.progressStats.naoVisitados}</span>
                  <span className="text-sm text-gray-600">Pendentes</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progresso Total:</span>
                  <span>{stats.percentageVisited}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${stats.percentageVisited}%` }}></div>
                </div>
              </div>
              
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.progressPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.progressPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="text-lg font-bold mb-2">Estatísticas de Atendimento</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <span className="block text-2xl font-bold">{stats.progressStats.atendeu}</span>
                  <span className="text-sm text-gray-600">Atenderam</span>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <span className="block text-2xl font-bold">{stats.progressStats.naoAtendeu}</span>
                  <span className="text-sm text-gray-600">Não Atenderam</span>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Taxa de Atendimento:</span>
                  <span>{stats.percentageAnswered}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${stats.percentageAnswered}%` }}></div>
                </div>
              </div>
              
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.atendimentoPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#22c55e" />
                      <Cell fill="#ef4444" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      
      case 'distribution':
        return (
          <div>
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="text-lg font-bold mb-2">Distribuição por Tipo de Imóvel</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats.residenceTypeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {stats.residenceTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h3 className="text-lg font-bold mb-2">Designações por Mês</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={stats.monthlyAssignmentData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="quantidade" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div>Selecione uma aba para visualizar estatísticas</div>;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Relatórios</h2>
        <div className="flex space-x-2">
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="month">Último Mês</option>
            <option value="quarter">Último Trimestre</option>
            <option value="year">Último Ano</option>
            <option value="all">Todo o Período</option>
          </select>
        </div>
      </div>
      
      {/* Tabs de navegação */}
      <div className="bg-white rounded-lg shadow mb-4">
        <div className="flex">
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('progress')}
          >
            Progresso
          </button>
          <button
            className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'distribution' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('distribution')}
          >
            Distribuição
          </button>
        </div>
      </div>
      
      {/* Conteúdo da aba */}
      {renderTabContent()}
    </div>
  );
};

export default ReportsScreen;