import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function CustomTimePicker({ visible, onClose, onConfirm, initialTime = "08:00" }) {
  const [hours, setHours] = useState(() => {
    const [h] = initialTime.split(':');
    return parseInt(h, 10) || 8;
  });
  
  const [minutes, setMinutes] = useState(() => {
    const [, m] = initialTime.split(':');
    return parseInt(m, 10) || 0;
  });

  const incrementHours = () => setHours((h) => (h + 1) % 24);
  const decrementHours = () => setHours((h) => (h - 1 + 24) % 24);
  
  const incrementMinutes = () => setMinutes((m) => (m + 5) % 60); // Incrementos de 5 minutos son prácticos para wearables
  const decrementMinutes = () => setMinutes((m) => (m - 5 + 60) % 60);

  const handleConfirm = () => {
    const hStr = String(hours).padStart(2, '0');
    const mStr = String(minutes).padStart(2, '0');
    onConfirm(`${hStr}:${mStr}`);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Configurar Hora</Text>

          <View style={styles.pickerContainer}>
            {/* Control Hora */}
            <View style={styles.column}>
              <TouchableOpacity style={styles.arrowBtn} onPress={incrementHours}>
                <MaterialCommunityIcons name="chevron-up" size={32} color="#2A9D8F" />
              </TouchableOpacity>
              <View style={styles.numberBox}>
                <Text style={styles.numberText}>{String(hours).padStart(2, '0')}</Text>
              </View>
              <TouchableOpacity style={styles.arrowBtn} onPress={decrementHours}>
                <MaterialCommunityIcons name="chevron-down" size={32} color="#2A9D8F" />
              </TouchableOpacity>
            </View>

            {/* Separador de dos puntos */}
            <Text style={styles.separator}>:</Text>

            {/* Control Minuto */}
            <View style={styles.column}>
              <TouchableOpacity style={styles.arrowBtn} onPress={incrementMinutes}>
                <MaterialCommunityIcons name="chevron-up" size={32} color="#2A9D8F" />
              </TouchableOpacity>
              <View style={styles.numberBox}>
                <Text style={styles.numberText}>{String(minutes).padStart(2, '0')}</Text>
              </View>
              <TouchableOpacity style={styles.arrowBtn} onPress={decrementMinutes}>
                <MaterialCommunityIcons name="chevron-down" size={32} color="#2A9D8F" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Botones de Acción */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionBtn, styles.confirmBtn]} onPress={handleConfirm}>
              <Text style={styles.confirmBtnText}>Listo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 270,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  column: {
    alignItems: 'center',
  },
  arrowBtn: {
    padding: 6,
  },
  numberBox: {
    width: 60,
    height: 50,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  numberText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  separator: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginHorizontal: 12,
    paddingBottom: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelBtn: {
    backgroundColor: '#ECEFF1',
  },
  cancelBtnText: {
    color: '#607D8B',
    fontWeight: 'bold',
    fontSize: 13,
  },
  confirmBtn: {
    backgroundColor: '#2A9D8F',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
