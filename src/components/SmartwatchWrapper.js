import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, Platform, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function SmartwatchWrapper({ children, isWatchMode, onToggleMode }) {
  if (!isWatchMode) {
    return (
      <View style={styles.fullscreenContainer}>
        {/* Barra superior de control para activar modo reloj */}
        <View style={styles.topControlBar}>
          <Text style={styles.controlTitle}>VitaDosis Mobile</Text>
          <TouchableOpacity style={styles.controlBtn} onPress={onToggleMode}>
            <MaterialCommunityIcons name="watch" size={18} color="#FFFFFF" />
            <Text style={styles.controlBtnText}>Modo Wearable</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fullscreenContent}>{children}</View>
      </View>
    );
  }

  return (
    <View style={styles.watchOuterContainer}>
      {/* Botón para regresar a pantalla completa */}
      <TouchableOpacity style={styles.floatingControlBtn} onPress={onToggleMode}>
        <MaterialCommunityIcons name="cellphone" size={16} color="#FFFFFF" />
        <Text style={styles.floatingControlText}>Pantalla Completa</Text>
      </TouchableOpacity>

      {/* Cuerpo del Smartwatch */}
      <View style={styles.watchBody}>
        {/* Correas del Reloj (Simuladas con diseño CSS) */}
        <View style={styles.strapTop} />
        <View style={styles.strapBottom} />

        {/* Bisel del Reloj (Borders y sombras) */}
        <View style={styles.watchBezel}>
          {/* Botón Corona Lateral Derecho */}
          <View style={styles.watchCrown} />
          
          {/* Botón Físico Inferior */}
          <View style={styles.watchButton} />

          {/* Pantalla Circular Interna */}
          <View style={styles.watchScreen}>
            {/* Contenido de la App con restricciones circulares */}
            <View style={styles.watchContentContainer}>
              {children}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#F4F9F5',
  },
  topControlBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 15,
    height: Platform.OS === 'android' ? StatusBar.currentHeight + 50 : 60,
    backgroundColor: '#2A9D8F',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E7A6E',
  },
  controlTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  controlBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  controlBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  fullscreenContent: {
    flex: 1,
  },
  
  // Estilos del Simulador de Smartwatch
  watchOuterContainer: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingControlBtn: {
    position: 'absolute',
    top: 50,
    backgroundColor: '#2A9D8F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingControlText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  watchBody: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 380,
    height: 380,
  },
  strapTop: {
    position: 'absolute',
    top: -50,
    width: 110,
    height: 90,
    backgroundColor: '#3A3A3C',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  strapBottom: {
    position: 'absolute',
    bottom: -50,
    width: 110,
    height: 90,
    backgroundColor: '#3A3A3C',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  watchBezel: {
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: '#2C2C2E',
    borderWidth: 8,
    borderColor: '#48484A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  watchCrown: {
    position: 'absolute',
    right: -13,
    top: 140,
    width: 12,
    height: 45,
    backgroundColor: '#636366',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  watchButton: {
    position: 'absolute',
    right: -10,
    top: 205,
    width: 8,
    height: 30,
    backgroundColor: '#48484A',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  watchScreen: {
    width: 312,
    height: 312,
    borderRadius: 156,
    backgroundColor: '#F4F9F5',
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#1C1C1E',
  },
  watchContentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
