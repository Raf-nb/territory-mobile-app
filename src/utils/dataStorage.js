// dataStorage.js
// Esta implementação ajuda a gerenciar o armazenamento de dados no localStorage
// com funções para leitura, gravação e manipulação de dados

// Funções de armazenamento genéricas
const StorageManager = {
    // Função para obter dados do localStorage com fallback para array vazio
    getData: (key) => {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error(`Erro ao ler dados da chave ${key}:`, error);
        return [];
      }
    },
  
    // Função para salvar dados no localStorage
    saveData: (key, data) => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
      } catch (error) {
        console.error(`Erro ao salvar dados na chave ${key}:`, error);
        return false;
      }
    },
  
    // Função para remover item por ID
    removeItemById: (key, id) => {
      try {
        const data = StorageManager.getData(key);
        const filteredData = data.filter(item => item.id !== id);
        return StorageManager.saveData(key, filteredData);
      } catch (error) {
        console.error(`Erro ao remover item ${id} da chave ${key}:`, error);
        return false;
      }
    },
    
    // Função para atualizar item por ID
    updateItemById: (key, id, updates) => {
      try {
        const data = StorageManager.getData(key);
        const updatedData = data.map(item => 
          item.id === id ? { ...item, ...updates } : item
        );
        return StorageManager.saveData(key, updatedData);
      } catch (error) {
        console.error(`Erro ao atualizar item ${id} da chave ${key}:`, error);
        return false;
      }
    }
  };
  
  // Gerenciadores específicos para cada tipo de dado
  const TerritoriesManager = {
    // Obter todos os territórios
    getAll: () => StorageManager.getData('territories'),
    
    // Salvar território
    save: (territory) => {
      const territories = TerritoriesManager.getAll();
      
      // Se o território já existe, atualize-o
      if (territory.id) {
        return StorageManager.updateItemById('territories', territory.id, territory);
      }
      
      // Caso contrário, crie um novo território com ID
      const newTerritory = {
        ...territory,
        id: Math.random().toString(36).substr(2, 9),
        streets: territory.streets || []
      };
      
      territories.push(newTerritory);
      return StorageManager.saveData('territories', territories);
    },
    
    // Remover território
    remove: (id) => StorageManager.removeItemById('territories', id),
    
    // Adicionar rua a um território
    addStreet: (territoryId, street) => {
      const territories = TerritoriesManager.getAll();
      const territory = territories.find(t => t.id === territoryId);
      
      if (!territory) return false;
      
      const newStreet = {
        ...street,
        id: Math.random().toString(36).substr(2, 9),
        residences: street.residences || []
      };
      
      territory.streets = territory.streets || [];
      territory.streets.push(newStreet);
      
      return StorageManager.saveData('territories', territories);
    },
    
    // Adicionar residência a uma rua
    addResidence: (territoryId, streetId, residence) => {
      const territories = TerritoriesManager.getAll();
      const territory = territories.find(t => t.id === territoryId);
      
      if (!territory) return false;
      
      const street = territory.streets?.find(s => s.id === streetId);
      if (!street) return false;
      
      const newResidence = {
        ...residence,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      street.residences = street.residences || [];
      street.residences.push(newResidence);
      
      return StorageManager.saveData('territories', territories);
    },
    
    // Registrar interação com residência
    recordInteraction: (territoryId, streetId, residenceId, answer) => {
      const territories = TerritoriesManager.getAll();
      const territory = territories.find(t => t.id === territoryId);
      
      if (!territory) return false;
      
      const street = territory.streets?.find(s => s.id === streetId);
      if (!street) return false;
      
      const residence = street.residences?.find(r => r.id === residenceId);
      if (!residence) return false;
      
      residence.interaction = {
        answer,
        date: new Date().toLocaleDateString('pt-BR')
      };
      
      return StorageManager.saveData('territories', territories);
    }
  };
  
  const FieldGroupsManager = {
    // Obter todos os grupos de campo
    getAll: () => StorageManager.getData('fields'),
    
    // Salvar grupo de campo
    save: (fieldGroup) => {
      const fieldGroups = FieldGroupsManager.getAll();
      
      // Se o grupo já existe, atualize-o
      if (fieldGroup.id) {
        return StorageManager.updateItemById('fields', fieldGroup.id, fieldGroup);
      }
      
      // Caso contrário, crie um novo grupo com ID
      const newFieldGroup = {
        ...fieldGroup,
        id: Math.random().toString(36).substr(2, 9),
        leaders: fieldGroup.leaders || []
      };
      
      fieldGroups.push(newFieldGroup);
      return StorageManager.saveData('fields', fieldGroups);
    },
    
    // Remover grupo de campo
    remove: (id) => StorageManager.removeItemById('fields', id),
    
    // Adicionar dirigente a um grupo
    addLeader: (fieldGroupId, leaderName) => {
      const fieldGroups = FieldGroupsManager.getAll();
      const fieldGroup = fieldGroups.find(fg => fg.id === fieldGroupId);
      
      if (!fieldGroup) return false;
      
      fieldGroup.leaders = fieldGroup.leaders || [];
      fieldGroup.leaders.push(leaderName);
      
      return StorageManager.saveData('fields', fieldGroups);
    },
    
    // Remover dirigente de um grupo
    removeLeader: (fieldGroupId, leaderIndex) => {
      const fieldGroups = FieldGroupsManager.getAll();
      const fieldGroup = fieldGroups.find(fg => fg.id === fieldGroupId);
      
      if (!fieldGroup || !fieldGroup.leaders) return false;
      
      fieldGroup.leaders.splice(leaderIndex, 1);
      
      return StorageManager.saveData('fields', fieldGroups);
    }
  };
  
  const AssignmentsManager = {
    // Obter todas as designações
    getAll: () => StorageManager.getData('designations'),
    
    // Salvar designação
    save: (assignment) => {
      const assignments = AssignmentsManager.getAll();
      
      // Se a designação já existe, atualize-a
      if (assignment.id) {
        return StorageManager.updateItemById('designations', assignment.id, assignment);
      }
      
      // Caso contrário, crie uma nova designação com ID
      const newAssignment = {
        ...assignment,
        id: Math.random().toString(36).substr(2, 9),
      };
      
      assignments.push(newAssignment);
      return StorageManager.saveData('designations', assignments);
    },
    
    // Remover designação
    remove: (id) => StorageManager.removeItemById('designations', id),
    
    // Obter designações ativas (data de devolução futura)
    getActive: () => {
      const assignments = AssignmentsManager.getAll();
      const today = new Date();
      
      return assignments.filter(assignment => {
        const returnDate = new Date(assignment.returnDate);
        return returnDate >= today;
      });
    },
    
    // Obter histórico de designações para um território específico
    getHistoryForTerritory: (territoryId) => {
      const assignments = AssignmentsManager.getAll();
      return assignments.filter(assignment => assignment.territoryId === territoryId);
    }
  };
  
  // Funções de utilidade
  const Utils = {
    // Gerar ID único
    generateId: () => Math.random().toString(36).substr(2, 9),
    
    // Formatar data para exibição
    formatDate: (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    },
    
    // Verificar se data está no passado
    isPastDate: (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    
    // Verificar se data está no futuro
    isFutureDate: (dateString) => {
      const date = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today;
    },
    
    // Calcular diferença em dias entre duas datas
    daysBetween: (dateString1, dateString2) => {
      const date1 = new Date(dateString1);
      const date2 = new Date(dateString2);
      const differenceInTime = Math.abs(date2 - date1);
      return Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
    },
    
    // Exportar todos os dados como JSON
    exportData: () => {
      const data = {
        territories: StorageManager.getData('territories'),
        fields: StorageManager.getData('fields'),
        designations: StorageManager.getData('designations')
      };
      
      return JSON.stringify(data, null, 2);
    },
    
    // Importar dados a partir de JSON
    importData: (jsonString) => {
      try {
        const data = JSON.parse(jsonString);
        
        if (data.territories) {
          StorageManager.saveData('territories', data.territories);
        }
        
        if (data.fields) {
          StorageManager.saveData('fields', data.fields);
        }
        
        if (data.designations) {
          StorageManager.saveData('designations', data.designations);
        }
        
        return true;
      } catch (error) {
        console.error('Erro ao importar dados:', error);
        return false;
      }
    }
  };
  
  export { 
    TerritoriesManager, 
    FieldGroupsManager, 
    AssignmentsManager, 
    Utils 
  };