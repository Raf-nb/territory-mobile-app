// src/components/AssignmentsScreen.js
import React, { useState } from 'react';
import { Card, Button, Form, Modal, Nav, Badge } from 'react-bootstrap';
import { PlusCircle, Calendar, MapPin, Users, X } from 'lucide-react';
import { AssignmentsManager, Utils } from '.utils/dataStorage';

const AssignmentsScreen = ({ 
  assignments, 
  setAssignments, 
  territories, 
  fieldGroups,
  showModal, 
  setShowModal 
}) => {
  // Estados para controlar a criação de designações
  const [selectedTerritory, setSelectedTerritory] = useState('');
  const [selectedFieldGroup, setSelectedFieldGroup] = useState('');
  const [assignmentDate, setAssignmentDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  // Estado para filtrar designações
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'completed'

  // Função para adicionar uma nova designação
  const addAssignment = () => {
    if (!selectedTerritory || !selectedFieldGroup || !assignmentDate || !returnDate) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    if (new Date(returnDate) < new Date(assignmentDate)) {
      alert('A data de devolução não pode ser anterior à data de designação.');
      return;
    }
    
    const territory = territories.find(t => t.id === selectedTerritory);
    const fieldGroup = fieldGroups.find(f => f.id === selectedFieldGroup);
    
    if (!territory || !fieldGroup) {
      alert('Território ou grupo não encontrado.');
      return;
    }
    
    const newAssignment = {
      territoryId: selectedTerritory,
      territoryName: territory.name,
      fieldId: selectedFieldGroup,
      fieldName: fieldGroup.name,
      fieldDay: fieldGroup.day,
      assignmentDate,
      returnDate,
      createdAt: new Date().toISOString()
    };
    
    // Usar AssignmentsManager para salvar a designação
    const success = AssignmentsManager.save(newAssignment);
    
    if (success) {
      // Atualizar a lista de designações no estado do componente pai
      const updatedAssignments = AssignmentsManager.getAll();
      setAssignments(updatedAssignments);
      
      // Limpar o formulário
      setSelectedTerritory('');
      setSelectedFieldGroup('');
      setAssignmentDate('');
      setReturnDate('');
      setShowModal(false);
    }
  };

  // Função para remover uma designação
  const removeAssignment = (assignmentId) => {
    if (!window.confirm('Tem certeza que deseja remover esta designação?')) return;
    
    // Usar AssignmentsManager para remover a designação
    const success = AssignmentsManager.remove(assignmentId);
    
    if (success) {
      // Atualizar a lista de designações no estado do componente pai
      const updatedAssignments = AssignmentsManager.getAll();
      setAssignments(updatedAssignments);
    }
  };

  // Função para formatar data usando Utils
  const formatDate = (dateString) => {
    return Utils.formatDate(dateString);
  };

  // Função para verificar se uma designação está ativa usando Utils
  const isActiveAssignment = (assignment) => {
    return !Utils.isPastDate(assignment.returnDate);
  };

  // Função para filtrar as designações
  const getFilteredAssignments = () => {
    if (filter === 'active') {
      return assignments.filter(isActiveAssignment);
    } else if (filter === 'completed') {
      return assignments.filter(assignment => !isActiveAssignment(assignment));
    }
    return assignments;
  };

  // Ordenar designações por data (mais recentes primeiro)
  const sortedAssignments = getFilteredAssignments().sort((a, b) => {
    return new Date(b.createdAt || b.assignmentDate) - new Date(a.createdAt || a.assignmentDate);
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fs-4 fw-bold mb-0">Designações</h2>
        <Button 
          variant="primary" 
          className="rounded-circle p-2"
          onClick={() => setShowModal(true)}
        >
          <PlusCircle size={20} />
        </Button>
      </div>
      
      {/* Filtros */}
      <Card className="mb-3">
        <Card.Body className="p-0">
          <Nav variant="pills" className="nav-fill">
            <Nav.Item>
              <Nav.Link 
                active={filter === 'all'} 
                onClick={() => setFilter('all')}
                className="rounded-0"
              >
                Todas
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={filter === 'active'} 
                onClick={() => setFilter('active')}
                className="rounded-0"
              >
                Ativas
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={filter === 'completed'} 
                onClick={() => setFilter('completed')}
                className="rounded-0"
              >
                Concluídas
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Body>
      </Card>
      
      {/* Lista de Designações */}
      {sortedAssignments.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <p className="text-muted mb-3">
              Não há designações {filter !== 'all' ? `${filter === 'active' ? 'ativas' : 'concluídas'}` : ''} no momento.
            </p>
            <Button 
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              Criar Designação
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <div className="mb-3">
          {sortedAssignments.map(assignment => {
            const isActive = isActiveAssignment(assignment);
            const borderClass = isActive ? 'border-success' : 'border-secondary';
            
            return (
              <Card 
                key={assignment.id} 
                className={`mb-2 ${borderClass}`}
                style={{ borderLeftWidth: '4px' }}
              >
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <h5 className="mb-0">{assignment.territoryName}</h5>
                    <Button
                      variant="link"
                      className="text-danger p-0"
                      onClick={() => removeAssignment(assignment.id)}
                    >
                      <X size={18} />
                    </Button>
                  </div>
                  
                  <div className="mt-2">
                    <div className="d-flex align-items-center text-muted small mb-1">
                      <Users size={14} className="me-1" />
                      <span>{assignment.fieldName} ({assignment.fieldDay})</span>
                    </div>
                    
                    <div className="d-flex align-items-center text-muted small mb-1">
                      <Calendar size={14} className="me-1" />
                      <span>Designado: {formatDate(assignment.assignmentDate)}</span>
                    </div>
                    
                    <div className="d-flex align-items-center small mb-1">
                      <Calendar size={14} className="me-1" />
                      <span className={!isActive ? 'text-danger fw-medium' : 'text-muted'}>
                        Devolução: {formatDate(assignment.returnDate)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    {isActive ? (
                      <Badge bg="success">Ativo</Badge>
                    ) : (
                      <Badge bg="secondary">Concluído</Badge>
                    )}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Modal de Nova Designação */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Nova Designação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Território</Form.Label>
            <Form.Select
              value={selectedTerritory}
              onChange={(e) => setSelectedTerritory(e.target.value)}
            >
              <option value="">Selecione um território</option>
              {territories.map(territory => (
                <option key={territory.id} value={territory.id}>
                  {territory.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Grupo de Campo</Form.Label>
            <Form.Select
              value={selectedFieldGroup}
              onChange={(e) => setSelectedFieldGroup(e.target.value)}
            >
              <option value="">Selecione um grupo</option>
              {fieldGroups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.day})
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Data de Designação</Form.Label>
            <Form.Control
              type="date"
              value={assignmentDate}
              onChange={(e) => setAssignmentDate(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Data de Devolução</Form.Label>
            <Form.Control
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={addAssignment}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AssignmentsScreen;