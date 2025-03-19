// src/components/TerritoryApp.js
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Tab, Row, Col } from 'react-bootstrap';
import { Home, Map, Users, Calendar, CheckSquare, BarChart2 } from 'lucide-react';

// Importação dos gerenciadores de dados
import { TerritoriesManager, FieldGroupsManager, AssignmentsManager } from '../dataStorage';

// Importação dos componentes de tela
import HomeScreen from './HomeScreen';
import TerritoriesScreen from './TerritoriesScreen';
import FieldGroupsScreen from './FieldGroupsScreen';
import AssignmentsScreen from './AssignmentsScreen';
import VisitsScreen from './VisitsScreen';
import ReportsScreen from './ReportsScreen';

// Componente principal do App
const TerritoryApp = () => {
  // Estado para controlar a aba ativa
  const [activeTab, setActiveTab] = useState('home');
  
  // Estados para armazenar os dados
  const [territories, setTerritories] = useState([]);
  const [fieldGroups, setFieldGroups] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  // Estados para controlar a exibição de modais
  const [showNewTerritoryModal, setShowNewTerritoryModal] = useState(false);
  const [showNewFieldGroupModal, setShowNewFieldGroupModal] = useState(false);
  const [showNewAssignmentModal, setShowNewAssignmentModal] = useState(false);
  
  // Efeito para carregar dados usando os gerenciadores ao iniciar
  useEffect(() => {
    const loadData = () => {
      try {
        // Carregar territórios usando TerritoriesManager
        const loadedTerritories = TerritoriesManager.getAll();
        setTerritories(loadedTerritories);
        
        // Carregar grupos de campo usando FieldGroupsManager
        const loadedFieldGroups = FieldGroupsManager.getAll();
        setFieldGroups(loadedFieldGroups);
        
        // Carregar designações usando AssignmentsManager
        const loadedAssignments = AssignmentsManager.getAll();
        setAssignments(loadedAssignments);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    
    loadData();
  }, []);
  
  // Renderização condicional baseada na tab ativa
  const renderContent = () => {
    switch(activeTab) {
      case 'territories':
        return <TerritoriesScreen 
                 territories={territories} 
                 setTerritories={setTerritories} 
                 showModal={showNewTerritoryModal}
                 setShowModal={setShowNewTerritoryModal}
               />;
      case 'fieldGroups':
        return <FieldGroupsScreen 
                 fieldGroups={fieldGroups} 
                 setFieldGroups={setFieldGroups}
                 showModal={showNewFieldGroupModal}
                 setShowModal={setShowNewFieldGroupModal}
               />;
      case 'assignments':
        return <AssignmentsScreen 
                 assignments={assignments}
                 setAssignments={setAssignments}
                 territories={territories}
                 fieldGroups={fieldGroups}
                 showModal={showNewAssignmentModal}
                 setShowModal={setShowNewAssignmentModal}
               />;
      case 'visits':
        return <VisitsScreen 
                 territories={territories} 
                 setTerritories={setTerritories} 
               />;
      case 'reports':
        return <ReportsScreen 
                 territories={territories}
                 assignments={assignments}
               />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="d-flex flex-column vh-100">
      {/* Header */}
      <Navbar bg="primary" variant="dark">
        <Container>
          <Navbar.Brand className="mx-auto">Gestão de Territórios</Navbar.Brand>
        </Container>
      </Navbar>
      
      {/* Conteúdo Principal */}
      <Container className="flex-grow-1 overflow-auto py-3">
        {renderContent()}
      </Container>
      
      {/* Navegação Inferior */}
      <Navbar bg="light" fixed="bottom" className="border-top">
        <Nav className="w-100 justify-content-around">
          <Nav.Link 
            onClick={() => setActiveTab('home')} 
            className={activeTab === 'home' ? 'text-primary' : 'text-secondary'}
          >
            <div className="d-flex flex-column align-items-center">
              <Home size={20} />
              <span className="small mt-1">Início</span>
            </div>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('territories')} 
            className={activeTab === 'territories' ? 'text-primary' : 'text-secondary'}
          >
            <div className="d-flex flex-column align-items-center">
              <Map size={20} />
              <span className="small mt-1">Territórios</span>
            </div>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('fieldGroups')} 
            className={activeTab === 'fieldGroups' ? 'text-primary' : 'text-secondary'}
          >
            <div className="d-flex flex-column align-items-center">
              <Users size={20} />
              <span className="small mt-1">Grupos</span>
            </div>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('assignments')} 
            className={activeTab === 'assignments' ? 'text-primary' : 'text-secondary'}
          >
            <div className="d-flex flex-column align-items-center">
              <Calendar size={20} />
              <span className="small mt-1">Designações</span>
            </div>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('visits')} 
            className={activeTab === 'visits' ? 'text-primary' : 'text-secondary'}
          >
            <div className="d-flex flex-column align-items-center">
              <CheckSquare size={20} />
              <span className="small mt-1">Visitas</span>
            </div>
          </Nav.Link>
          <Nav.Link 
            onClick={() => setActiveTab('reports')} 
            className={activeTab === 'reports' ? 'text-primary' : 'text-secondary'}
          >
            <div className="d-flex flex-column align-items-center">
              <BarChart2 size={20} />
              <span className="small mt-1">Relatórios</span>
            </div>
          </Nav.Link>
        </Nav>
      </Navbar>
    </div>
  );
};

export default TerritoryApp;