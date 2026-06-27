import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CustomTimePicker from '../components/CustomTimePicker';
import { validateTimeFormat, normalizeTime } from '../utils/time';

const CLASSIFICATIONS = [
  { id: 'Oral', name: 'Oral', icon: 'pill' },
  { id: 'Inyección', name: 'Inyección', icon: 'syringe' },
  { id: 'Inhalador', name: 'Inhalador', icon: 'spray' },
  { id: 'Tópico', name: 'Tópico', icon: 'cream' },
  { id: 'Gotas', name: 'Gotas', icon: 'water' },
];

export default function AddMedication({ medications, onAddMedication, isWatchMode }) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('08:00'); // Hora de inicio para la primera dosis
  const [frequency, setFrequency] = useState(8); // Cada cuánto tiempo (horas)
  const [duration, setDuration] = useState(5); // Por cuánto tiempo (días)
  const [classification, setClassification] = useState('Oral');
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Ajustadores de frecuencia y duración para wearables
  const adjustFrequency = (value) => {
    setFrequency((prev) => Math.max(1, Math.min(prev + value, 24)));
  };

  const adjustDuration = (value) => {
    setDuration((prev) => Math.max(1, Math.min(prev + value, 90)));
  };

  const handleSave = () => {
    // 1. Validar campos vacíos
    if (!name.trim() || !dose.trim() || !time.trim()) {
      Alert.alert(
        'Campos Incompletos',
        'Por favor completa todos los campos para agregar el medicamento.'
      );
      return;
    }

    // 2. Validar formato de hora
    if (!validateTimeFormat(time)) {
      Alert.alert(
        'Hora Inválida',
        'El formato de hora debe ser HH:MM.'
      );
      return;
    }

    const normalizedTime = normalizeTime(time);

    // 3. Validar duplicados (mismo nombre, insensible a mayúsculas/minúsculas)
    const duplicate = medications.some(
      (med) => med.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
      Alert.alert(
        'Medicamento Duplicado',
        `Ya tienes programado un medicamento con el nombre "${name.trim()}".`
      );
      return;
    }

    // 4. Crear objeto de medicamento
    const newMed = {
      id: Date.now().toString(),
      name: name.trim(),
      dose: dose.trim(),
      time: normalizedTime, // Hora de inicio
      frequency: frequency, // En horas
      duration: duration, // En días
      startDate: new Date().toISOString(), // Inicia hoy
      classification,
      lastTaken: null,
    };

    // 5. Callback para agregar al estado global/persistente
    onAddMedication(newMed);

    // 6. Limpiar campos
    setName('');
    setDose('');
    setTime('08:00');
    setFrequency(8);
    setDuration(5);
    setClassification('Oral');
  };

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.scrollContainer,
        isWatchMode ? styles.scrollContainerWatch : styles.scrollContainerFull
      ]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="plus-circle" size={isWatchMode ? 20 : 24} color="#2A9D8F" />
        <Text style={[styles.title, isWatchMode && styles.titleWatch]}>Agregar Med</Text>
      </View>

      <View style={styles.form}>
        {/* Campo: Nombre */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={[styles.input, isWatchMode && styles.inputWatch]}
          placeholder="Ej: Paracetamol"
          placeholderTextColor="#90A4AE"
          value={name}
          onChangeText={setName}
          maxLength={20}
        />

        {/* Campo: Dosis */}
        <Text style={styles.label}>Dosis</Text>
        <TextInput
          style={[styles.input, isWatchMode && styles.inputWatch]}
          placeholder="Ej: 1 pastilla o 5ml"
          placeholderTextColor="#90A4AE"
          value={dose}
          onChangeText={setDose}
          maxLength={20}
        />

        {/* Campo: Clasificación */}
        <Text style={styles.label}>Tipo / Clasificación</Text>
        <View style={styles.classifWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.classifScroll}
          >
            {CLASSIFICATIONS.map((item) => {
              const isSelected = item.id === classification;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.classifBtn,
                    isSelected && styles.classifBtnSelected,
                    isWatchMode && styles.classifBtnWatch
                  ]}
                  onPress={() => setClassification(item.id)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons 
                    name={item.icon} 
                    size={isWatchMode ? 14 : 16} 
                    color={isSelected ? '#C2185B' : '#2A9D8F'} 
                  />
                  <Text style={[
                    styles.classifText,
                    isSelected && styles.classifTextSelected,
                    isWatchMode && styles.classifTextWatch
                  ]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Campo: Frecuencia (Cada cuántas horas) */}
        <Text style={styles.label}>Frecuencia (Horas)</Text>
        <View style={[styles.counterRow, isWatchMode && styles.counterRowWatch]}>
          <TouchableOpacity 
            style={[styles.counterBtn, isWatchMode && styles.counterBtnWatch]} 
            onPress={() => adjustFrequency(-1)}
          >
            <MaterialCommunityIcons name="minus" size={16} color="#C2185B" />
          </TouchableOpacity>
          <Text style={[styles.counterText, isWatchMode && styles.counterTextWatch]}>
            Cada <Text style={styles.boldNum}>{frequency}</Text> hrs
          </Text>
          <TouchableOpacity 
            style={[styles.counterBtn, isWatchMode && styles.counterBtnWatch]} 
            onPress={() => adjustFrequency(1)}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#C2185B" />
          </TouchableOpacity>
        </View>

        {/* Campo: Duración (Por cuántos días) */}
        <Text style={styles.label}>Duración (Días)</Text>
        <View style={[styles.counterRow, isWatchMode && styles.counterRowWatch]}>
          <TouchableOpacity 
            style={[styles.counterBtn, isWatchMode && styles.counterBtnWatch]} 
            onPress={() => adjustDuration(-1)}
          >
            <MaterialCommunityIcons name="minus" size={16} color="#C2185B" />
          </TouchableOpacity>
          <Text style={[styles.counterText, isWatchMode && styles.counterTextWatch]}>
            Por <Text style={styles.boldNum}>{duration}</Text> días
          </Text>
          <TouchableOpacity 
            style={[styles.counterBtn, isWatchMode && styles.counterBtnWatch]} 
            onPress={() => adjustDuration(1)}
          >
            <MaterialCommunityIcons name="plus" size={16} color="#C2185B" />
          </TouchableOpacity>
        </View>

        {/* Campo: Hora de Inicio de Primera Dosis */}
        <Text style={styles.label}>Hora de Inicio</Text>
        <TouchableOpacity 
          style={[styles.timeSelector, isWatchMode && styles.timeSelectorWatch]}
          onPress={() => setShowTimePicker(true)}
        >
          <View style={styles.timeLabelContainer}>
            <MaterialCommunityIcons name="clock-outline" size={16} color="#2A9D8F" />
            <Text style={[styles.timeText, isWatchMode && styles.timeTextWatch]}>{time}</Text>
          </View>
          <MaterialCommunityIcons name="pencil" size={12} color="#7F8C8D" />
        </TouchableOpacity>

        {/* Botón Guardar */}
        <TouchableOpacity 
          style={[styles.saveButton, isWatchMode && styles.saveButtonWatch]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="content-save" size={18} color="#C2185B" />
          <Text style={styles.saveBtnText}>Guardar</Text>
        </TouchableOpacity>
      </View>

      {/* Componente TimePicker Modal */}
      <CustomTimePicker
        visible={showTimePicker}
        initialTime={time}
        onClose={() => setShowTimePicker(false)}
        onConfirm={(selectedTime) => setTime(selectedTime)}
      />

      <View style={styles.paddingBottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  scrollContainerFull: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  scrollContainerWatch: {
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 95, // Margen extra amplio para no taparse con el tab bar del Smartwatch
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 6,
  },
  titleWatch: {
    fontSize: 12,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#7F8C8D',
    marginBottom: 2,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    height: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 12,
    color: '#2C3E50',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 6,
  },
  inputWatch: {
    height: 32,
    fontSize: 10,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  classifWrapper: {
    width: '100%',
    marginBottom: 6,
  },
  classifScroll: {
    paddingVertical: 1,
  },
  classifBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  classifBtnWatch: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 10,
  },
  classifBtnSelected: {
    backgroundColor: '#F8BBD0',
    borderColor: '#F8BBD0',
  },
  classifText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2A9D8F',
    marginLeft: 4,
  },
  classifTextWatch: {
    fontSize: 8,
    marginLeft: 2,
  },
  classifTextSelected: {
    color: '#C2185B',
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    height: 36,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  counterRowWatch: {
    height: 32,
    marginBottom: 4,
  },
  counterBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8BBD0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBtnWatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 12,
    color: '#2C3E50',
    fontWeight: '500',
  },
  counterTextWatch: {
    fontSize: 10,
  },
  boldNum: {
    fontWeight: 'bold',
    color: '#2A9D8F',
  },
  timeSelector: {
    width: '100%',
    height: 36,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    marginBottom: 10,
  },
  timeSelectorWatch: {
    height: 32,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  timeLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginLeft: 6,
  },
  timeTextWatch: {
    fontSize: 11,
  },
  saveButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#F8BBD0',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButtonWatch: {
    height: 34,
    borderRadius: 17,
  },
  saveBtnText: {
    color: '#C2185B',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 6,
  },
  paddingBottom: {
    height: 20,
  },
});
