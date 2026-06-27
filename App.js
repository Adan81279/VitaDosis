import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Componentes y Pantallas
import SmartwatchWrapper from './src/components/SmartwatchWrapper';
import Dashboard from './src/screens/Dashboard';
import AddMedication from './src/screens/AddMedication';
import MedicationList from './src/screens/MedicationList';
import HistoryList from './src/screens/HistoryList';

// Persistencia y utilidades
import { getMedications, saveMedications, getHistory, saveHistory } from './src/utils/storage';

export default function App() {
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWatchMode, setIsWatchMode] = useState(true); // Iniciamos en modo wearable para destacar el diseño compacto

  // Cargar datos en el arranque de la app
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const storedMeds = await getMedications();
        const storedHistory = await getHistory();
        setMedications(storedMeds);
        setHistory(storedHistory);
      } catch (error) {
        console.error('Error cargando los datos iniciales:', error);
      }
    };
    loadAppData();
  }, []);

  // Agregar nuevo medicamento con persistencia
  const handleAddMedication = async (newMed) => {
    try {
      const updatedMeds = [...medications, newMed];
      setMedications(updatedMeds);
      await saveMedications(updatedMeds);
      
      Alert.alert(
        '¡Éxito!',
        `Medicamento "${newMed.name}" programado a las ${newMed.time}.`,
        [{ text: 'Entendido', onPress: () => setActiveTab('dashboard') }]
      );
    } catch (error) {
      console.error('Error al agregar medicamento:', error);
    }
  };

  // Eliminar medicamento con persistencia
  const handleDeleteMedication = async (id) => {
    try {
      const updatedMeds = medications.filter(med => med.id !== id);
      setMedications(updatedMeds);
      await saveMedications(updatedMeds);
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
    }
  };

  // Actualizar un medicamento (CRUD - Update)
  const handleUpdateMedication = async (updatedMed) => {
    try {
      const updatedMeds = medications.map(m => m.id === updatedMed.id ? updatedMed : m);
      setMedications(updatedMeds);
      await saveMedications(updatedMeds);
    } catch (error) {
      console.error('Error al actualizar medicamento:', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar la información del medicamento.'
      );
    }
  };

  // Registrar toma (Marcar como tomado)
  const handleMarkAsTaken = async (medId) => {
    try {
      const med = medications.find(m => m.id === medId);
      if (!med) return;

      // 1. Crear registro en el historial
      const newHistoryEntry = {
        id: Date.now().toString(),
        medicationId: medId,
        name: med.name,
        dose: med.dose,
        takenAt: new Date().toISOString(),
      };

      const updatedHistory = [newHistoryEntry, ...history];
      setHistory(updatedHistory);
      await saveHistory(updatedHistory);

      // 2. Actualizar última toma en el medicamento (por si sirve para otros cálculos)
      const updatedMeds = medications.map(m => {
        if (m.id === medId) {
          return { ...m, lastTaken: newHistoryEntry.takenAt };
        }
        return m;
      });
      setMedications(updatedMeds);
      await saveMedications(updatedMeds);

      Alert.alert(
        'Toma Registrada',
        `Has tomado tu dosis de ${med.name} (${med.dose}).`
      );
    } catch (error) {
      console.error('Error al registrar toma:', error);
    }
  };

  // Vaciar el historial de tomas
  const handleClearHistory = async () => {
    try {
      setHistory([]);
      await saveHistory([]);
    } catch (error) {
      console.error('Error al limpiar el historial:', error);
    }
  };

  // Renderizado dinámico de la pantalla activa
  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            medications={medications}
            history={history}
            onMarkAsTaken={handleMarkAsTaken}
            onNavigate={setActiveTab}
            isWatchMode={isWatchMode}
          />
        );
      case 'list':
        return (
          <MedicationList 
            medications={medications}
            onDeleteMedication={handleDeleteMedication}
            onMarkAsTaken={handleMarkAsTaken}
            onUpdateMedication={handleUpdateMedication}
            isWatchMode={isWatchMode}
          />
        );
      case 'add':
        return (
          <AddMedication 
            medications={medications}
            onAddMedication={handleAddMedication}
            isWatchMode={isWatchMode}
          />
        );
      case 'history':
        return (
          <HistoryList 
            history={history}
            onClearHistory={handleClearHistory}
            isWatchMode={isWatchMode}
          />
        );
      default:
        return (
          <Dashboard 
            medications={medications}
            history={history}
            onMarkAsTaken={handleMarkAsTaken}
            onNavigate={setActiveTab}
            isWatchMode={isWatchMode}
          />
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isWatchMode ? "light-content" : "dark-content"} backgroundColor={isWatchMode ? "#1C1C1E" : "#2A9D8F"} />
      
      <SmartwatchWrapper 
        isWatchMode={isWatchMode} 
        onToggleMode={() => setIsWatchMode(!isWatchMode)}
      >
        {/* Contenedor del contenido de la pantalla activa */}
        <View style={styles.screenContainer}>
          {renderScreen()}
        </View>

        {/* Tab Bar de Navegación Compacto (Táctil y adaptable) */}
        <View style={[styles.tabBar, isWatchMode ? styles.tabBarWatch : styles.tabBarFull]}>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'dashboard' && styles.activeTabItem]}
            onPress={() => setActiveTab('dashboard')}
          >
            <MaterialCommunityIcons 
              name="calendar-clock" 
              size={20} 
              color={activeTab === 'dashboard' ? '#FFFFFF' : '#7F8C8D'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'list' && styles.activeTabItem]}
            onPress={() => setActiveTab('list')}
          >
            <MaterialCommunityIcons 
              name="pill" 
              size={20} 
              color={activeTab === 'list' ? '#FFFFFF' : '#7F8C8D'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'add' && styles.activeTabItem]}
            onPress={() => setActiveTab('add')}
          >
            <MaterialCommunityIcons 
              name="plus-circle" 
              size={20} 
              color={activeTab === 'add' ? '#FFFFFF' : '#7F8C8D'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'history' && styles.activeTabItem]}
            onPress={() => setActiveTab('history')}
          >
            <MaterialCommunityIcons 
              name="history" 
              size={20} 
              color={activeTab === 'history' ? '#FFFFFF' : '#7F8C8D'} 
            />
          </TouchableOpacity>
        </View>
      </SmartwatchWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  screenContainer: {
    flex: 1,
    width: '100%',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  tabBarFull: {
    height: 56,
    paddingBottom: 6,
  },
  tabBarWatch: {
    height: 38,
    borderRadius: 19,
    marginBottom: 10, // Margen incrementado para que no se oculte en pantallas circulares
    borderWidth: 1,
    borderColor: '#ECEFF1',
    paddingHorizontal: 8,
    width: '85%', // Un poco más angosto para caber mejor en la parte inferior del círculo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.5,
    elevation: 2,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 38,
    height: 30,
    borderRadius: 15,
  },
  activeTabItem: {
    backgroundColor: '#2A9D8F',
  },
});
