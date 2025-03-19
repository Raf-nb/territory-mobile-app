// src/components/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { Map, Users, Calendar, CheckSquare, BarChart2 } from 'lucide-react';
import { TerritoriesManager, FieldGroupsManager, AssignmentsManager } from '../dataStorage';

const HomeScreen = () => {
  const [stats, setStats] = useState({
    territories: 0,
    fieldGroups: 0,
    assignments: 0,
    residenceCount: 0,
    visitedCount: 0
  });

  // Carregar estatísticas básicas ao iniciar
  useEffect(() => {
    const loadStats = () => {
      try {
        // Obter dados usando os gerenciadores
        const territories = TerritoriesManager.getAll();
        const fieldGroups = FieldGroupsManager.getAll();
        const assignments = AssignmentsManager.getAll();
        const activeAssignments = AssignmentsManager.getActive();
        
        // Calcular estatísticas de residências e visitas
        let totalResidences = 0;
        let visitedResidences = 0;
        
        territories.forEach(territory => {
          territory.streets.forEach(street => {
            const residences = street.residences || [];
            totalResidences += residences.length;
            visitedResidences += residences.filter(res => res.interaction).length;
          });
        });
        
        // Atualizar o estado com as estatísticas calculadas
        setStats({
          territories: territories.length,
          fieldGroups: fieldGroups.length,
          assignments: assignments.length,
          activeAssignments: activeAssignments.length,
          residenceCount: totalResidences,
          visitedCount: visitedResidences
        });
      } catch (error) {
        console.error('Erro ao calcular estatísticas:', error);
      }
    };
    
    loadStats();
  }, []);

  // Calcula a porcentagem de progresso
  const visitProgress = stats.residenceCount > 0 
    ? Math.round((stats.visitedCount / stats.residenceCount) * 100)
    : 0;

  return (
    <div className="d-flex flex-column align-items-center">
      <Card className="w-100 mb-4">
        <Card.Body className="text-center">
          <Card.Title className="mb-3">Bem-vindo ao App de Gestão de Territórios</Card.Title>
          <Card.Text className="text-muted mb-4">
            Este aplicativo ajuda a organizar territórios, grupos de trabalho de campo e designações.
          </Card.Text>
          
          {/* Estatísticas Rápidas */}
          <Card className="bg-light mb-4">
            <Card.Body className="text-center">
              <h4 className="display-6">{stats.visitedCount} / {stats.residenceCount}</h4>
              <p className="text-muted">Residências Visitadas</p>
              
              <ProgressBar 
                now={visitProgress} 
                label={`${visitProgress}%`}
                variant="primary" 
                className="mt-2" 
              />
            </Card.Body>
          </Card>
          
          {/* Cards de Navegação */}
          <Row xs={2} className="g-3">
            <Col>
              <Card className="bg-light h-100">
                <Card.Body className="text-center">
                  <Map size={32} className="mb-2 text-primary" />
                  <Card.Title className="fs-6">Territórios</Card.Title>
                  <Card.Text className="text-muted small">{stats.territories} cadastrados</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="bg-light h-100">
                <Card.Body className="text-center">
                  <Users size={32} className="mb-2 text-success" />
                  <Card.Title className="fs-6">Grupos</Card.Title>
                  <Card.Text className="text-muted small">{stats.fieldGroups} ativos</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="bg-light h-100">
                <Card.Body className="text-center">
                  <Calendar size={32} className="mb-2 text-info" />
                  <Card.Title className="fs-6">Designações</Card.Title>
                  <Card.Text className="text-muted small">
                    <span className="d-block">{stats.assignments} totais</span>
                    <span className="d-block">{stats.activeAssignments || 0} ativas</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="bg-light h-100">
                <Card.Body className="text-center">
                  <BarChart2 size={32} className="mb-2 text-warning" />
                  <Card.Title className="fs-6">Relatórios</Card.Title>
                  <Card.Text className="text-muted small">Estatísticas</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Versão e Info */}
      <div className="text-center text-muted small mb-3">
        <p className="mb-1">Versão 1.0.0</p>
        <p>Todos os dados são armazenados localmente no seu dispositivo</p>
      </div>
    </div>
  );
};

export default HomeScreen;