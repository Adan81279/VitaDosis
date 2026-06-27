import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const KEYS = {
  MEDICATIONS: '@vitadosis_medications',
  HISTORY: '@vitadosis_history',
};

/**
 * Obtiene la lista de medicamentos guardados.
 * Muestra una alerta amigable en caso de error.
 */
export const getMedications = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.MEDICATIONS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error al leer medicamentos:', error);
    Alert.alert(
      'Error de Lectura',
      'No se pudieron cargar los medicamentos guardados. Por favor, intenta de nuevo.'
    );
    return [];
  }
};

/**
 * Guarda la lista de medicamentos completa.
 */
export const saveMedications = async (medications) => {
  try {
    const jsonValue = JSON.stringify(medications);
    await AsyncStorage.setItem(KEYS.MEDICATIONS, jsonValue);
  } catch (error) {
    console.error('Error al guardar medicamentos:', error);
    Alert.alert(
      'Error de Escritura',
      'No se pudo guardar la lista de medicamentos. Revisa el espacio de almacenamiento.'
    );
    throw error;
  }
};

/**
 * Obtiene el historial de tomas de medicamentos.
 */
export const getHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(KEYS.HISTORY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error al leer el historial:', error);
    Alert.alert(
      'Error de Lectura',
      'No se pudo cargar el historial de tomas. Por favor, intenta de nuevo.'
    );
    return [];
  }
};

/**
 * Guarda el historial completo de tomas.
 */
export const saveHistory = async (history) => {
  try {
    const jsonValue = JSON.stringify(history);
    await AsyncStorage.setItem(KEYS.HISTORY, jsonValue);
  } catch (error) {
    console.error('Error al guardar historial:', error);
    Alert.alert(
      'Error de Escritura',
      'No se pudo registrar la toma en el historial persistente.'
    );
    throw error;
  }
};

/**
 * Limpia todos los datos de la aplicación (útil para pruebas).
 */
export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.MEDICATIONS);
    await AsyncStorage.removeItem(KEYS.HISTORY);
  } catch (error) {
    console.error('Error al limpiar datos:', error);
  }
};
