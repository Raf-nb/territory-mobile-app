// src/components/FieldGroupsScreen.js
import React, { useState } from 'react';
import { Card, Button, Form, Modal, Accordion, ListGroup, InputGroup } from 'react-bootstrap';
import { ChevronRight, PlusCircle, X, Edit, Save, UserPlus } from 'lucide-react';
import { FieldGroupsManager } from '../dataStorage';

const FieldGroupsScreen = ({ fieldGroups, setFieldGroups, showModal, setShowModal }) => {
  // Estados para controlar entrada de dados
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDay, setNewGroupDay] = useState('');
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [newLeaderName, setNewLeaderName] = useState('');
  
  // Estados para controlar modo de edição
  const [editMode, setEditMode] = useState(false);
  const [editGroupId, setEditGroupId] = useState(null);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupDay, setEditGroupDay] = useState('');

  // Função para adicionar um novo grupo de campo
  const addFieldGroup = () => {
    if (!newGroupName.trim() || !newGroupDay) return;
    
    const newGroup = {
      name: newGroupName.trim(),
      day: newGroupDay,
      leaders: []
    };
    
    // Usar FieldGroupsManager para salvar o grupo
    const success = FieldGroupsManager.save(newGroup);
    
    if (success) {
      // Atualizar a lista de grupos no estado do componente pai
      const updatedGroups = FieldGroupsManager.getAll();
      setFieldGroups(updatedGroups);
      
      setNewGroupName('');
      setNewGroupDay('');
      setShowModal(false);
    }
  };

  // Função para adicionar um dirigente a um grupo
  const addLeader = (groupId) => {
    if (!newLeaderName.trim()) return;
    
    // Usar FieldGroupsManager para adicionar o dirigente
    const success = FieldGroupsManager.addLeader(groupId, newLeaderName.trim());
    
    if (success) {
      // Atualizar a lista de grupos no estado do componente pai
      const updatedGroups = FieldGroupsManager.getAll();
      setFieldGroups(updatedGroups);
      
      setNewLeaderName('');
    }
  };

  // Função para remover um dirigente de um grupo
  const removeLeader = (groupId, leaderIndex) => {
    // Usar FieldGroupsManager para remover o dirigente
    const success = FieldGroupsManager.removeLeader(groupId, leaderIndex);
    
    if (success) {
      // Atualizar a lista de grupos no estado do componente pai
      const updatedGroups = FieldGroupsManager.getAll();
      setFieldGroups(updatedGroups);
    }
  };

  // Função para remover um grupo
  const removeGroup = (groupId) => {
    if (!window.confirm('Tem certeza que deseja remover este grupo?')) return;
    
    // Usar FieldGroupsManager para remover o grupo
    const success = FieldGroupsManager.remove(groupId);
    
    if (success) {
      // Atualizar a lista de grupos no estado do componente pai
      const updatedGroups = FieldGroupsManager.getAll();
      setFieldGroups(updatedGroups);
      
      if (expandedGroup === groupId) {
        setExpandedGroup(null);
      }
    }
  };

  // Função para iniciar a edição de um grupo
  const startEditGroup = (group) => {
    setEditMode(true);
    setEditGroupId(group.id);
    setEditGroupName(group.name);
    setEditGroupDay(group.day);
  };

  // Função para salvar a edição de um grupo
  const saveEditGroup = () => {
    if (!editGroupName.trim() || !editGroupDay) return;
    
    // Obter o grupo atual
    const groupToUpdate = fieldGroups.find(g => g.id === editGroupId);
    if (!groupToUpdate) return;
    
    // Criar o objeto de grupo atualizado
    const updatedGroup = {
      ...groupToUpdate,
      name: editGroupName.trim(),
      day: editGroupDay
    };
    
    // Usar FieldGroupsManager para salvar as alterações
    const success = FieldGroupsManager.save(updatedGroup);
    
    if (success) {
      // Atualizar a lista de grupos no estado do componente pai
      const updatedGroups = FieldGroupsManager.getAll();
      setFieldGroups(updatedGroups);
      
      // Limpar o estado de edição
      setEditMode(false);
      setEditGroupId(null);
      setEditGroupName('');
      setEditGroupDay('');
    }
  };

  // Função para cancelar a edição
  const cancelEdit = () => {
    setEditMode(false);
    setEditGroupId(null);
    setEditGroupName('');
    setEditGroupDay('');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fs-4 fw-bold mb-0">Grupos de Campo</h2>
        <Button 
          variant="primary" 
          className="rounded-circle p-2"
          onClick={() => setShowModal(true)}
        >
          <PlusCircle size={20} />
        </Button>
      </div>
      
      {/* Lista de Grupos */}
      {fieldGroups.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <p className="text-muted mb-3">Você ainda não tem grupos de campo cadastrados.</p>
            <Button 
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              Adicionar Grupo
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Accordion className="mb-3">
          {fieldGroups.map((group, index) => (
            <Card key={group.id} className="mb-2">
              <Card.Header className="d-flex justify-content-between align-items-center p-3">
                {editMode && editGroupId === group.id ? (
                  <div className="flex-grow-1 me-2">
                    <Form.Control
                      type="text"
                      value={editGroupName}
                      onChange={(e) => setEditGroupName(e.target.value)}
                      placeholder="Nome do grupo"
                      className="mb-2"
                      autoFocus
                    />
                    <Form.Select
                      value={editGroupDay}
                      onChange={(e) => setEditGroupDay(e.target.value)}
                    >
                      <option value="" disabled>Selecione o dia</option>
                      <option value="Segunda-feira">Segunda-feira</option>
                      <option value="Terça-feira">Terça-feira</option>
                      <option value="Quarta-feira">Quarta-feira</option>
                      <option value="Quinta-feira">Quinta-feira</option>
                      <option value="Sexta-feira">Sexta-feira</option>
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </Form.Select>
                  </div>
                ) : (
                  <Accordion.Toggle 
                    as={Button} 
                    variant="link" 
                    eventKey={group.id}
                    className="text-decoration-none text-dark fw-medium p-0"
                    onClick={() => setExpandedGroup(
                      expandedGroup === group.id ? null : group.id
                    )}
                  >
                    <span>{group.name}</span>
                    <span className="text-muted ms-2">({group.day})</span>
                  </Accordion.Toggle>
                )}
                
                <div className="d-flex align-items-center">
                  {editMode && editGroupId === group.id ? (
                    <>
                      <Button 
                        variant="link" 
                        className="text-success p-1"
                        onClick={saveEditGroup}
                      >
                        <Save size={18} />
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-secondary p-1"
                        onClick={cancelEdit}
                      >
                        <X size={18} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="link" 
                        className="text-primary p-1"
                        onClick={() => startEditGroup(group)}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-danger p-1"
                        onClick={() => removeGroup(group.id)}
                      >
                        <X size={18} />
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-dark p-1"
                        onClick={() => setExpandedGroup(
                          expandedGroup === group.id ? null : group.id
                        )}
                      >
                        <ChevronRight 
                          size={20}
                          style={{ 
                            transform: expandedGroup === group.id ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </Button>
                    </>
                  )}
                </div>
              </Card.Header>
              
              <Accordion.Collapse eventKey={group.id} in={expandedGroup === group.id}>
                <Card.Body>
                  <div className="mb-3">
                    <h5 className="mb-2">Dirigentes</h5>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={newLeaderName}
                        onChange={(e) => setNewLeaderName(e.target.value)}
                        placeholder="Nome do dirigente"
                      />
                      <Button 
                        variant="success"
                        onClick={() => addLeader(group.id)}
                        className="d-flex align-items-center"
                      >
                        <UserPlus size={18} />
                      </Button>
                    </InputGroup>
                  </div>
                  
                  {/* Lista de Dirigentes */}
                  {group.leaders && group.leaders.length > 0 ? (
                    <ListGroup>
                      {group.leaders.map((leader, index) => (
                        <ListGroup.Item 
                          key={index}
                          className="d-flex justify-content-between align-items-center bg-light"
                        >
                          <span>{leader}</span>
                          <Button
                            variant="link"
                            className="text-danger p-0"
                            onClick={() => removeLeader(group.id, index)}
                          >
                            <X size={16} />
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p className="text-muted">Não há dirigentes cadastrados para este grupo.</p>
                  )}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
      )}
      
      {/* Modal de Novo Grupo */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Novo Grupo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nome do grupo</Form.Label>
            <Form.Control
              type="text"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Nome do grupo"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Dia da semana</Form.Label>
            <Form.Select
              value={newGroupDay}
              onChange={(e) => setNewGroupDay(e.target.value)}
            >
              <option value="" disabled>Selecione o dia</option>
              <option value="Segunda-feira">Segunda-feira</option>
              <option value="Terça-feira">Terça-feira</option>
              <option value="Quarta-feira">Quarta-feira</option>
              <option value="Quinta-feira">Quinta-feira</option>
              <option value="Sexta-feira">Sexta-feira</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={addFieldGroup}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FieldGroupsScreen;