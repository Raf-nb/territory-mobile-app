// src/components/TerritoriesScreen.js
import React, { useState } from 'react';
import { Card, Button, Form, Modal, Accordion, Badge, InputGroup } from 'react-bootstrap';
import { ChevronRight, PlusCircle, X, Edit, Save } from 'lucide-react';
import { TerritoriesManager } from '../dataStorage';

const TerritoriesScreen = ({ territories, setTerritories, showModal, setShowModal }) => {
  // Estados para controlar a UI
  const [newTerritoryName, setNewTerritoryName] = useState('');
  const [expandedTerritory, setExpandedTerritory] = useState(null);
  const [expandedStreet, setExpandedStreet] = useState(null);
  
  // Estados para adicionar novas entidades
  const [newStreetName, setNewStreetName] = useState('');
  const [newHouseNumber, setNewHouseNumber] = useState('');
  const [newHouseType, setNewHouseType] = useState('Residência');
  
  // Estados para edição
  const [editMode, setEditMode] = useState(false);
  const [editTerritoryId, setEditTerritoryId] = useState(null);
  const [editTerritoryName, setEditTerritoryName] = useState('');

  // Função para adicionar um novo território
  const addTerritory = () => {
    if (!newTerritoryName.trim()) return;
    
    const newTerritory = {
      name: newTerritoryName.trim(),
      streets: []
    };
    
    // Usar TerritoriesManager para salvar o território
    const success = TerritoriesManager.save(newTerritory);
    
    if (success) {
      // Atualizar a lista de territórios no estado do componente pai
      const updatedTerritories = TerritoriesManager.getAll();
      setTerritories(updatedTerritories);
      
      setNewTerritoryName('');
      setShowModal(false);
    }
  };

  // Função para adicionar uma rua a um território
  const addStreet = (territoryId) => {
    if (!newStreetName.trim()) return;
    
    const newStreet = {
      name: newStreetName.trim(),
      residences: []
    };
    
    // Usar TerritoriesManager para adicionar a rua
    const success = TerritoriesManager.addStreet(territoryId, newStreet);
    
    if (success) {
      // Atualizar a lista de territórios no estado do componente pai
      const updatedTerritories = TerritoriesManager.getAll();
      setTerritories(updatedTerritories);
      
      setNewStreetName('');
    }
  };

  // Função para adicionar uma residência a uma rua
  const addHouse = (territoryId, streetId) => {
    if (!newHouseNumber.trim()) return;
    
    const newHouse = {
      number: newHouseNumber.trim(),
      type: newHouseType
    };
    
    // Usar TerritoriesManager para adicionar a residência
    const success = TerritoriesManager.addResidence(territoryId, streetId, newHouse);
    
    if (success) {
      // Atualizar a lista de territórios no estado do componente pai
      const updatedTerritories = TerritoriesManager.getAll();
      setTerritories(updatedTerritories);
      
      setNewHouseNumber('');
    }
  };

  // Função para remover um território
  const removeTerritory = (territoryId) => {
    if (!window.confirm('Tem certeza que deseja remover este território?')) return;
    
    // Usar TerritoriesManager para remover o território
    const success = TerritoriesManager.remove(territoryId);
    
    if (success) {
      // Atualizar a lista de territórios no estado do componente pai
      const updatedTerritories = TerritoriesManager.getAll();
      setTerritories(updatedTerritories);
      
      if (expandedTerritory === territoryId) {
        setExpandedTerritory(null);
      }
    }
  };

  // Funções para edição
  const startEditTerritory = (territory) => {
    setEditMode(true);
    setEditTerritoryId(territory.id);
    setEditTerritoryName(territory.name);
  };

  const saveEditTerritory = () => {
    if (!editTerritoryName.trim()) return;
    
    // Obter o território atual
    const territoryToUpdate = territories.find(t => t.id === editTerritoryId);
    if (!territoryToUpdate) return;
    
    // Criar o objeto de território atualizado
    const updatedTerritory = {
      ...territoryToUpdate,
      name: editTerritoryName.trim()
    };
    
    // Usar TerritoriesManager para salvar as alterações
    const success = TerritoriesManager.save(updatedTerritory);
    
    if (success) {
      // Atualizar a lista de territórios no estado do componente pai
      const updatedTerritories = TerritoriesManager.getAll();
      setTerritories(updatedTerritories);
      
      // Limpar o estado de edição
      setEditMode(false);
      setEditTerritoryId(null);
      setEditTerritoryName('');
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditTerritoryId(null);
    setEditTerritoryName('');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fs-4 fw-bold mb-0">Territórios</h2>
        <Button 
          variant="primary" 
          className="rounded-circle p-2"
          onClick={() => setShowModal(true)}
        >
          <PlusCircle size={20} />
        </Button>
      </div>
      
      {/* Lista de Territórios */}
      {territories.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <p className="text-muted mb-3">Você ainda não tem territórios cadastrados.</p>
            <Button 
              variant="primary"
              onClick={() => setShowModal(true)}
            >
              Adicionar Território
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Accordion className="mb-3">
          {territories.map((territory, index) => (
            <Card key={territory.id} className="mb-2">
              <Card.Header className="d-flex justify-content-between align-items-center p-3">
                {editMode && editTerritoryId === territory.id ? (
                  <Form.Control
                    type="text"
                    value={editTerritoryName}
                    onChange={(e) => setEditTerritoryName(e.target.value)}
                    className="me-2"
                    autoFocus
                  />
                ) : (
                  <Accordion.Toggle 
                    as={Button} 
                    variant="link" 
                    eventKey={territory.id}
                    className="text-decoration-none text-dark fw-medium p-0"
                    onClick={() => setExpandedTerritory(
                      expandedTerritory === territory.id ? null : territory.id
                    )}
                  >
                    {territory.name}
                  </Accordion.Toggle>
                )}
                
                <div className="d-flex align-items-center">
                  {editMode && editTerritoryId === territory.id ? (
                    <>
                      <Button 
                        variant="link" 
                        className="text-success p-1"
                        onClick={saveEditTerritory}
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
                        onClick={() => startEditTerritory(territory)}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-danger p-1"
                        onClick={() => removeTerritory(territory.id)}
                      >
                        <X size={18} />
                      </Button>
                      <Button 
                        variant="link" 
                        className="text-dark p-1"
                        onClick={() => setExpandedTerritory(
                          expandedTerritory === territory.id ? null : territory.id
                        )}
                      >
                        <ChevronRight 
                          size={20} 
                          className={expandedTerritory === territory.id ? "rotate-90" : ""}
                          style={{ 
                            transform: expandedTerritory === territory.id ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s'
                          }}
                        />
                      </Button>
                    </>
                  )}
                </div>
              </Card.Header>
              
              <Accordion.Collapse eventKey={territory.id} in={expandedTerritory === territory.id}>
                <Card.Body>
                  <div className="mb-3">
                    <h5 className="mb-2">Adicionar Rua</h5>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={newStreetName}
                        onChange={(e) => setNewStreetName(e.target.value)}
                        placeholder="Nome da rua"
                      />
                      <Button 
                        variant="success"
                        onClick={() => addStreet(territory.id)}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </div>
                  
                  {/* Lista de Ruas */}
                  {territory.streets && territory.streets.length > 0 ? (
                    <div className="ms-3">
                      {territory.streets.map(street => (
                        <Card key={street.id} className="mb-2 bg-light">
                          <Card.Body className="p-2">
                            <div 
                              className="d-flex justify-content-between align-items-center cursor-pointer"
                              onClick={() => setExpandedStreet(
                                expandedStreet === street.id ? null : street.id
                              )}
                              style={{ cursor: 'pointer' }}
                            >
                              <span>{street.name}</span>
                              <ChevronRight 
                                size={16} 
                                style={{ 
                                  transform: expandedStreet === street.id ? 'rotate(90deg)' : 'rotate(0deg)',
                                  transition: 'transform 0.2s'
                                }}
                              />
                            </div>
                            
                            {expandedStreet === street.id && (
                              <div className="mt-2 pt-2 border-top">
                                <h6 className="mb-2">Adicionar Residência</h6>
                                <Form.Group className="mb-2">
                                  <Form.Control
                                    type="text"
                                    value={newHouseNumber}
                                    onChange={(e) => setNewHouseNumber(e.target.value)}
                                    placeholder="Número"
                                    className="mb-2"
                                  />
                                  <Form.Select
                                    value={newHouseType}
                                    onChange={(e) => setNewHouseType(e.target.value)}
                                    className="mb-2"
                                  >
                                    <option value="Residência">Residência</option>
                                    <option value="Prédio">Prédio</option>
                                    <option value="Vila">Vila</option>
                                    <option value="Comércio">Comércio</option>
                                  </Form.Select>
                                  <Button 
                                    variant="success"
                                    onClick={() => addHouse(territory.id, street.id)}
                                  >
                                    Adicionar
                                  </Button>
                                </Form.Group>
                                
                                {/* Lista de Residências */}
                                <div className="d-flex flex-wrap gap-2 mt-2">
                                  {street.residences && street.residences.map(house => (
                                    <Badge 
                                      key={house.id} 
                                      bg="secondary" 
                                      className="p-2"
                                    >
                                      {house.number} ({house.type})
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted">Não há ruas cadastradas neste território.</p>
                  )}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
      )}
      
      {/* Modal de Novo Território */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Novo Território</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              value={newTerritoryName}
              onChange={(e) => setNewTerritoryName(e.target.value)}
              placeholder="Nome do território"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={addTerritory}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TerritoriesScreen;