// src/components/VisitsScreen.js
import React, { useState } from 'react';
import { Card, Button, Accordion, ProgressBar, Badge } from 'react-bootstrap';
import { ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { TerritoriesManager } from '../dataStorage';

const VisitsScreen = ({ territories, setTerritories }) => {
  const [expandedTerritory, setExpandedTerritory] = useState(null);
  const [expandedStreet, setExpandedStreet] = useState(null);

  // Função para registrar interação com uma residência
  const recordInteraction = (territoryId, streetId, residenceId, answer) => {
    // Usar TerritoriesManager para registrar a interação
    const success = TerritoriesManager.recordInteraction(territoryId, streetId, residenceId, answer);
    
    if (success) {
      // Atualizar a lista de territórios no estado do componente pai
      const updatedTerritories = TerritoriesManager.getAll();
      setTerritories(updatedTerritories);
    }
  };

  // Função para contar residências em um território
  const countResidencesInTerritory = (territory) => {
    return territory.streets.reduce((total, street) => {
      return total + (street.residences ? street.residences.length : 0);
    }, 0);
  };

  // Função para contar residências já visitadas em um território
  const countVisitedInTerritory = (territory) => {
    return territory.streets.reduce((total, street) => {
      return total + (street.residences || []).filter(res => res.interaction).length;
    }, 0);
  };

  return (
    <div>
      <h2 className="fs-4 fw-bold mb-3">Visitas aos Territórios</h2>
      
      {territories.length === 0 ? (
        <Card className="text-center p-4">
          <Card.Body>
            <p className="text-muted">Você ainda não tem territórios cadastrados.</p>
          </Card.Body>
        </Card>
      ) : (
        <Accordion className="mb-3">
          {territories.map(territory => {
            const totalResidences = countResidencesInTerritory(territory);
            const visitedResidences = countVisitedInTerritory(territory);
            const progressPercentage = totalResidences > 0 
              ? (visitedResidences / totalResidences) * 100 
              : 0;
            
            return (
              <Card key={territory.id} className="mb-2">
                <Card.Header 
                  className="p-3"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setExpandedTerritory(
                    expandedTerritory === territory.id ? null : territory.id
                  )}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="flex-grow-1">
                      <h5 className="mb-1">{territory.name}</h5>
                      <div className="small text-muted">
                        {visitedResidences} de {totalResidences} visitadas
                      </div>
                      <ProgressBar 
                        now={progressPercentage} 
                        className="mt-2" 
                        style={{ height: '6px' }}
                      />
                    </div>
                    <ChevronRight 
                      size={20}
                      style={{ 
                        transform: expandedTerritory === territory.id ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    />
                  </div>
                </Card.Header>
                
                <Accordion.Collapse eventKey={territory.id} in={expandedTerritory === territory.id}>
                  <Card.Body>
                    {territory.streets && territory.streets.length > 0 ? (
                      territory.streets.map(street => (
                        <Card key={street.id} className="mb-2 bg-light">
                          <Card.Body className="p-2">
                            <div 
                              className="d-flex justify-content-between align-items-center"
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
                              <div className="mt-3 pt-2 border-top">
                                {street.residences && street.residences.length > 0 ? (
                                  <div className="d-flex flex-column gap-2">
                                    {street.residences.map(residence => {
                                      const hasInteraction = residence.interaction && residence.interaction.answer;
                                      let badgeClass = 'bg-secondary';
                                      let textClass = '';
                                      
                                      if (hasInteraction) {
                                        if (residence.interaction.answer === 'sim') {
                                          badgeClass = 'bg-success';
                                        } else {
                                          badgeClass = 'bg-danger';
                                        }
                                      }
                                        
                                      return (
                                        <div 
                                          key={residence.id} 
                                          className={`p-2 rounded d-flex justify-content-between align-items-center ${badgeClass} text-white`}
                                        >
                                          <span>
                                            {residence.number} ({residence.type})
                                            {hasInteraction && (
                                              <small className="ms-2">
                                                {residence.interaction.date}
                                              </small>
                                            )}
                                          </span>
                                          <div className="d-flex gap-2">
                                            <Button 
                                              variant="success"
                                              size="sm"
                                              className="d-flex align-items-center"
                                              onClick={() => recordInteraction(territory.id, street.id, residence.id, 'sim')}
                                            >
                                              <CheckCircle size={14} className="me-1" />
                                              Sim
                                            </Button>
                                            <Button 
                                              variant="danger"
                                              size="sm"
                                              className="d-flex align-items-center"
                                              onClick={() => recordInteraction(territory.id, street.id, residence.id, 'não')}
                                            >
                                              <XCircle size={14} className="me-1" />
                                              Não
                                            </Button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <p className="text-muted small py-2">Não há residências cadastradas nesta rua.</p>
                                )}
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      ))
                    ) : (
                      <p className="text-muted">Não há ruas cadastradas neste território.</p>
                    )}
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            );
          })}
        </Accordion>
      )}
    </div>
  );
};

export default VisitsScreen;