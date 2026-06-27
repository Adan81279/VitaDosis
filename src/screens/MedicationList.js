import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, Modal, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomTimePicker from '../components/CustomTimePicker';

const CLASSIFICATIONS = [
  { id: 'Oral', name: 'Oral', icon: 'pill' },
  { id: 'Inyección', name: 'Inyección', icon: 'syringe' },
  { id: 'Inhalador', name: 'Inhalador', icon: 'spray' },
  { id: 'Tópico', name: 'Tópico', icon: 'cream' },
  { id: 'Gotas', name: 'Gotas', icon: 'water' },
];

export default function MedicationList({ medications, onDeleteMedication, onMarkAsTaken, onUpdateMedication, isWatchMode }) {
  // Estados para la edición (CRUD - Update)
  const [editingMed, setEditingMed] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDose, setEditDose] = useState('');
  const [editTime, setEditTime] = useState('08:00');
  const [editFrequency, setEditFrequency] = useState(8);
  const [editDuration, setEditDuration] = useState(5);
  const [editClassification, setEditClassification] = useState('Oral');
  const [showTimePicker, setShowTimePicker] = useState(false);

  const confirmDelete = (med) => {
    Alert.alert(
      'Eliminar Medicamento',
      `¿Estás seguro de que deseas eliminar "${med.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: () => onDeleteMedication(med.id) 
        }
      ]
    );
  };

  const startEdit = (med) => {
    setEditingMed(med);
    setEditName(med.name);
    setEditDose(med.dose);
    setEditTime(med.time);
    setEditFrequency(med.frequency || 8);
    setEditDuration(med.duration || 5);
    setEditClassification(med.classification || 'Oral');
  };

  const handleUpdate = () => {
    if (!editName.trim() || !editDose.trim() || !editTime.trim()) {
      Alert.alert('Campos Incompletos', 'Por favor llena todos los campos.');
      return;
    }

    // Validar duplicados si cambia el nombre
    const duplicate = medications.some(
      (med) => 
        med.id !== editingMed.id && 
        med.name.trim().toLowerCase() === editName.trim().toLowerCase()
    );

    if (duplicate) {
      Alert.alert('Medicamento Duplicado', `Ya tienes programado un medicamento con el nombre "${editName.trim()}".`);
      return;
    }

    const updatedMed = {
      ...editingMed,
      name: editName.trim(),
      dose: editDose.trim(),
      time: editTime,
      frequency: editFrequency,
      duration: editDuration,
      classification: editClassification,
    };

    onUpdateMedication(updatedMed);
    setEditingMed(null);
  };

  const adjustEditFrequency = (value) => {
    setEditFrequency((prev) => Math.max(1, Math.min(prev + value, 24)));
  };

  const adjustEditDuration = (value) => {
    setEditDuration((prev) => Math.max(1, Math.min(prev + value, 90)));
  };

  const getClassificationIcon = (classifId) => {
    const item = CLASSIFICATIONS.find(c => c.id === classifId);
    return item ? item.icon : 'pill';
  };

  const renderItem = ({ item }) => {
    const iconName = getClassificationIcon(item.classification);
    return (
      <View style={styles.medCard}>
        <View style={styles.medHeader}>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name={iconName} size={16} color="#2A9D8F" style={styles.pillIcon} />
            <Text style={styles.medName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          
          <View style={styles.actionIconsRow}>
            {/* Botón Editar */}
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => startEdit(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialCommunityIcons name="pencil-outline" size={14} color="#2A9D8F" />
            </TouchableOpacity>

            {/* Botón Eliminar */}
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => confirmDelete(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <MaterialCommunityIcons name="trash-can-outline" size={14} color="#E76F51" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Detalles de la Toma */}
        <View style={styles.medDetails}>
          <Text style={styles.detailText}>
            Dosis: <Text style={styles.detailBold}>{item.dose}</Text>
          </Text>
          <Text style={styles.detailText}>
            Inicio: <Text style={styles.detailBold}>{item.time}</Text>
          </Text>
        </View>

        {/* Detalles del Tratamiento */}
        <View style={styles.medTreatmentDetails}>
          <Text style={styles.detailText}>
            Frecuencia: <Text style={styles.detailBold}>Cada {item.frequency || 24}h</Text>
          </Text>
          <Text style={styles.detailText}>
            Duración: <Text style={styles.detailBold}>{item.duration || 30} días</Text>
          </Text>
        </View>

        <View style={styles.tagAndCheckRow}>
          <View style={styles.typeTag}>
            <Text style={styles.typeTagText}>{item.classification || 'Oral'}</Text>
          </View>
          
          {/* Botón rápido tipo Check */}
          <TouchableOpacity 
            style={styles.checkButton}
            onPress={() => onMarkAsTaken(item.id)}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="checkbox-marked-circle" size={12} color="#FFFFFF" />
            <Text style={styles.checkText}>Tomar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons name="format-list-bulleted" size={isWatchMode ? 20 : 24} color="#2A9D8F" />
        <Text style={[styles.title, isWatchMode && styles.titleWatch]}>Mis Medicamentos</Text>
      </View>

      {medications.length > 0 ? (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            isWatchMode ? styles.listContentWatch : styles.listContentFull
          ]}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="medical-bag" size={40} color="#90A4AE" />
          <Text style={styles.emptyText}>No tienes medicamentos registrados.</Text>
        </View>
      )}

      {/* Modal de Edición (CRUD - Update) */}
      <Modal
        visible={editingMed !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingMed(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContainer,
            isWatchMode ? styles.modalContainerWatch : styles.modalContainerFull
          ]}>
            <Text style={styles.modalTitle}>Editar Medicamento</Text>
            
            <ScrollView 
              showsVerticalScrollIndicator={false} 
              contentContainerStyle={styles.modalScroll}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.modalLabel}>Nombre</Text>
              <TextInput
                style={styles.modalInput}
                value={editName}
                onChangeText={setEditName}
                maxLength={20}
              />

              <Text style={styles.modalLabel}>Dosis</Text>
              <TextInput
                style={styles.modalInput}
                value={editDose}
                onChangeText={setEditDose}
                maxLength={20}
              />

              <Text style={styles.modalLabel}>Clasificación</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.classifScroll}>
                {CLASSIFICATIONS.map((c) => {
                  const isSelected = c.id === editClassification;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.classifBtn, isSelected && styles.classifBtnSelected]}
                      onPress={() => setEditClassification(c.id)}
                    >
                      <MaterialCommunityIcons 
                        name={c.icon} 
                        size={10} 
                        color={isSelected ? '#FFFFFF' : '#2A9D8F'} 
                      />
                      <Text style={[styles.classifBtnText, isSelected && styles.classifBtnTextSelected]}>
                        {c.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Frecuencia Edición */}
              <Text style={styles.modalLabel}>Frecuencia (Horas)</Text>
              <View style={styles.modalCounterRow}>
                <TouchableOpacity style={styles.modalCounterBtn} onPress={() => adjustEditFrequency(-1)}>
                  <MaterialCommunityIcons name="minus" size={14} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalCounterText}>Cada <Text style={styles.boldNum}>{editFrequency}</Text> hrs</Text>
                <TouchableOpacity style={styles.modalCounterBtn} onPress={() => adjustEditFrequency(1)}>
                  <MaterialCommunityIcons name="plus" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* Duración Edición */}
              <Text style={styles.modalLabel}>Duración (Días)</Text>
              <View style={styles.modalCounterRow}>
                <TouchableOpacity style={styles.modalCounterBtn} onPress={() => adjustEditDuration(-1)}>
                  <MaterialCommunityIcons name="minus" size={14} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.modalCounterText}>Por <Text style={styles.boldNum}>{editDuration}</Text> días</Text>
                <TouchableOpacity style={styles.modalCounterBtn} onPress={() => adjustEditDuration(1)}>
                  <MaterialCommunityIcons name="plus" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalLabel}>Hora de Inicio</Text>
              <TouchableOpacity 
                style={styles.timeSelector}
                onPress={() => setShowTimePicker(true)}
              >
                <MaterialCommunityIcons name="clock-outline" size={14} color="#2A9D8F" />
                <Text style={styles.timeText}>{editTime}</Text>
                <MaterialCommunityIcons name="pencil" size={10} color="#7F8C8D" />
              </TouchableOpacity>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalBtn, styles.modalBtnCancel]} 
                  onPress={() => setEditingMed(null)}
                >
                  <Text style={styles.modalBtnCancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalBtn, styles.modalBtnSave]} 
                  onPress={handleUpdate}
                >
                  <Text style={styles.modalBtnSaveText}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <CustomTimePicker
        visible={showTimePicker}
        initialTime={editTime}
        onClose={() => setShowTimePicker(false)}
        onConfirm={(selectedTime) => setEditTime(selectedTime)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    paddingTop: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 6,
  },
  titleWatch: {
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 4,
  },
  listContentFull: {
    paddingBottom: 60,
  },
  listContentWatch: {
    paddingBottom: 90, // Margen extra para que el scroll supere el corte de pantalla y la barra de navegación del reloj
  },
  medCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 1.5,
    elevation: 2,
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pillIcon: {
    marginRight: 4,
  },
  medName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  actionIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 4,
    marginLeft: 6,
  },
  medDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
    paddingHorizontal: 4,
  },
  medTreatmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 4,
    borderTopWidth: 0.5,
    borderTopColor: '#ECEFF1',
    paddingTop: 3,
  },
  detailText: {
    fontSize: 10,
    color: '#78909C',
  },
  detailBold: {
    color: '#2C3E50',
    fontWeight: '600',
  },
  tagAndCheckRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeTag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingVertical: 1,
    paddingHorizontal: 6,
    borderWidth: 0.5,
    borderColor: '#C8E6C9',
  },
  typeTagText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#2A9D8F',
  },
  checkButton: {
    height: 28,
    backgroundColor: '#2A9D8F',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  emptyText: {
    fontSize: 11,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 6,
  },
  
  // Estilos del Modal de Edición
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalContainerFull: {
    width: '85%',
    maxHeight: '80%',
  },
  modalContainerWatch: {
    width: '90%',
    height: '92%',
    padding: 10,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#7F8C8D',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  modalInput: {
    height: 32,
    backgroundColor: '#F8F9FA',
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 12,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  classifScroll: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  classifBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  classifBtnSelected: {
    backgroundColor: '#2A9D8F',
    borderColor: '#2A9D8F',
  },
  classifBtnText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#2A9D8F',
    marginLeft: 3,
  },
  classifBtnTextSelected: {
    color: '#FFFFFF',
  },
  modalCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 32,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  modalCounterBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2A9D8F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCounterText: {
    fontSize: 11,
    color: '#2C3E50',
    fontWeight: '500',
  },
  boldNum: {
    fontWeight: 'bold',
    color: '#2A9D8F',
  },
  timeSelector: {
    height: 32,
    backgroundColor: '#E8F5E9',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  modalBtn: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  modalBtnCancel: {
    backgroundColor: '#ECEFF1',
  },
  modalBtnCancelText: {
    color: '#607D8B',
    fontWeight: 'bold',
    fontSize: 11,
  },
  modalBtnSave: {
    backgroundColor: '#2A9D8F',
  },
  modalBtnSaveText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 11,
  },
});
