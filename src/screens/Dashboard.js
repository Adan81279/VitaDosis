import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getNextDose, formatDoseTime } from '../utils/time';

const CLASSIFICATIONS = [
  { id: 'Oral', name: 'Oral', icon: 'pill' },
  { id: 'Inyección', name: 'Inyección', icon: 'syringe' },
  { id: 'Inhalador', name: 'Inhalador', icon: 'spray' },
  { id: 'Tópico', name: 'Tópico', icon: 'cream' },
  { id: 'Gotas', name: 'Gotas', icon: 'water' },
];

export default function Dashboard({ medications, history, onMarkAsTaken, onNavigate, isWatchMode }) {
  const nextDoseInfo = getNextDose(medications, history);

  // Calcular estadísticas del día de hoy
  const todayStr = new Date().toDateString();
  const takenTodayCount = history.filter(h => new Date(h.takenAt).toDateString() === todayStr).length;
  const totalMeds = medications.length;

  // --- 1. PROCESAR DATOS PARA LA GRÁFICA SEMANAL ---
  // Días de la semana en español
  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
  const takenPerDay = [0, 0, 0, 0, 0, 0, 0];

  const now = new Date();
  const startOfWeek = new Date(now);
  const currentDayOfWeek = now.getDay(); // 0: Dom, 1: Lun, etc.
  // Encontrar el lunes de la semana actual
  const diff = now.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  history.forEach(entry => {
    const entryDate = new Date(entry.takenAt);
    if (entryDate >= startOfWeek) {
      const entryDay = entryDate.getDay(); // 0: Dom, 1: Lun, etc.
      // Mapear 0->6 (Dom), 1->0 (Lun), 2->1 (Mar), 3->2 (Mié), 4->3 (Jue), 5->4 (Vie), 6->5 (Sáb)
      const mappedIndex = entryDay === 0 ? 6 : entryDay - 1;
      if (mappedIndex >= 0 && mappedIndex < 7) {
        takenPerDay[mappedIndex] += 1;
      }
    }
  });

  const maxTaken = Math.max(...takenPerDay, 1); // Evitar división por cero

  // --- 2. PROCESAR DATOS PARA LA GRÁFICA DE CLASIFICACIÓN ---
  const classifCounts = {
    Oral: 0,
    Inyección: 0,
    Inhalador: 0,
    Tópico: 0,
    Gotas: 0,
  };

  medications.forEach(m => {
    const cat = m.classification || 'Oral';
    if (classifCounts[cat] !== undefined) {
      classifCounts[cat] += 1;
    }
  });

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.scrollContainer,
        isWatchMode ? styles.scrollContainerWatch : styles.scrollContainerFull
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <MaterialCommunityIcons name="heart-pulse" size={isWatchMode ? 22 : 28} color="#2A9D8F" />
        <Text style={[styles.title, isWatchMode && styles.titleWatch]}>VitaDosis</Text>
        {!isWatchMode && <Text style={styles.subtitle}>Wearable Helper</Text>}
      </View>

      {/* Banner de Próxima Toma */}
      <View style={styles.bannerContainer}>
        <Text style={styles.bannerHeader}>Siguiente Dosis</Text>
        
        {nextDoseInfo ? (
          <View style={styles.nextDoseCard}>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: nextDoseInfo.isOverdue ? '#E76F51' : '#2A9D8F' }
            ]}>
              <MaterialCommunityIcons 
                name={nextDoseInfo.isOverdue ? "alert-circle" : "clock-outline"} 
                size={14} 
                color="#FFFFFF" 
              />
              <Text style={styles.statusText}>
                {nextDoseInfo.isOverdue ? 'Atrasado' : 'A Tiempo'}
              </Text>
            </View>

            <View style={styles.medTitleRow}>
              {/* Icono de clasificación en el banner principal */}
              <MaterialCommunityIcons 
                name={CLASSIFICATIONS.find(c => c.id === (nextDoseInfo.medication.classification || 'Oral'))?.icon || 'pill'} 
                size={16} 
                color="#2A9D8F" 
                style={styles.pillIcon} 
              />
              <Text style={styles.medName} numberOfLines={1}>
                {nextDoseInfo.medication.name}
              </Text>
            </View>
            
            <Text style={styles.medDose}>
              Dosis: {nextDoseInfo.medication.dose}
            </Text>

            <Text style={[
              styles.medTime,
              { color: nextDoseInfo.isOverdue ? '#E76F51' : '#2C3E50' }
            ]}>
              {formatDoseTime(nextDoseInfo.targetDate, nextDoseInfo.isOverdue)}
            </Text>

            {/* Botón de Confirmación Grande */}
            <TouchableOpacity 
              style={[
                styles.actionBtn, 
                { backgroundColor: nextDoseInfo.isOverdue ? '#FFCDD2' : '#F8BBD0' },
                isWatchMode && styles.actionBtnWatch
              ]}
              onPress={() => onMarkAsTaken(nextDoseInfo.medication.id)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons 
                name="check-bold" 
                size={isWatchMode ? 16 : 20} 
                color={nextDoseInfo.isOverdue ? '#B71C1C' : '#C2185B'} 
              />
              <Text style={[
                styles.actionBtnText, 
                { color: nextDoseInfo.isOverdue ? '#B71C1C' : '#C2185B' },
                isWatchMode && styles.actionBtnTextWatch
              ]}>Tomar Dosis</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.emptyCard, isWatchMode && styles.emptyCardWatch]}>
            <MaterialCommunityIcons name="pill-off" size={isWatchMode ? 24 : 32} color="#90A4AE" />
            <Text style={styles.emptyText}>Sin tomas pendientes</Text>
            <TouchableOpacity 
              style={styles.addBtn}
              onPress={() => onNavigate('add')}
            >
              <Text style={styles.addBtnText}>+ Agregar Med</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* --- GRÁFICA 1: TOMAS DE LA SEMANA --- */}
      <View style={styles.chartCard}>
        <Text style={styles.chartCardTitle}>Tomas Semanales</Text>
        <View style={styles.barChartContainer}>
          {weekDays.map((day, idx) => {
            const count = takenPerDay[idx];
            // Altura relativa de la barra (Max 50px)
            const barHeight = count > 0 ? (count / maxTaken) * 40 + 6 : 2;
            const isTodayIdx = (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1) === idx;

            return (
              <View key={idx} style={styles.chartColumn}>
                {count > 0 && <Text style={styles.barCountText}>{count}</Text>}
                <View 
                  style={[
                    styles.chartBar, 
                    { height: barHeight },
                    isTodayIdx && styles.chartBarToday,
                    count > 0 && styles.chartBarFilled
                  ]} 
                />
                <Text style={[styles.barDayText, isTodayIdx && styles.barDayToday]}>{day}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* --- GRÁFICA 2: CLASIFICACIÓN DE MEDICAMENTOS --- */}
      {totalMeds > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartCardTitle}>Tipos de Medicamento</Text>
          <View style={styles.classifChartContainer}>
            {CLASSIFICATIONS.map((c) => {
              const count = classifCounts[c.id];
              if (count === 0 && isWatchMode) return null; // Ahorrar espacio en wearables si es cero
              const percent = totalMeds > 0 ? (count / totalMeds) * 100 : 0;
              
              return (
                <View key={c.id} style={styles.classifRow}>
                  <View style={styles.classifRowHeader}>
                    <View style={styles.classifRowLabel}>
                      <MaterialCommunityIcons name={c.icon} size={12} color="#2A9D8F" />
                      <Text style={styles.classifRowText}>{c.name}</Text>
                    </View>
                    <Text style={styles.classifRowVal}>{count}</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Resumen del Día */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Progreso de Hoy</Text>
        <View style={styles.progressRow}>
          <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={16} color="#2A9D8F" />
          <Text style={styles.progressText}>
            {totalMeds === 0 
              ? 'Sin medicamentos' 
              : `${takenTodayCount} de ${totalMeds} tomados`}
          </Text>
        </View>
      </View>
      
      <View style={styles.paddingBottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  scrollContainerFull: {
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 40,
  },
  scrollContainerWatch: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 85, // Gran margen inferior para que suba del tab bar del reloj
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 2,
  },
  titleWatch: {
    fontSize: 14,
  },
  subtitle: {
    fontSize: 10,
    color: '#7F8C8D',
    letterSpacing: 1,
  },
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7F8C8D',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  nextDoseCard: {
    width: '100%',
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
  },
  medTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  pillIcon: {
    marginRight: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginBottom: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  medName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  medDose: {
    fontSize: 11,
    color: '#546E7A',
    marginBottom: 2,
  },
  medTime: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  actionBtn: {
    width: '100%',
    height: 38,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.12,
    shadowRadius: 2.5,
    elevation: 2,
  },
  actionBtnWatch: {
    height: 32,
    borderRadius: 16,
  },
  actionBtnText: {
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4,
  },
  actionBtnTextWatch: {
    fontSize: 11,
  },
  emptyCard: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEFF1',
    borderStyle: 'dashed',
  },
  emptyCardWatch: {
    padding: 10,
  },
  emptyText: {
    color: '#78909C',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: '#F8BBD0',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  addBtnText: {
    color: '#C2185B',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  // Estilos de la Tarjeta de la Gráfica Semanal
  chartCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ECEFF1',
    marginBottom: 8,
  },
  chartCardTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 6,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 62,
    paddingBottom: 4,
  },
  chartColumn: {
    alignItems: 'center',
    width: 24,
  },
  barCountText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#2A9D8F',
    marginBottom: 2,
  },
  chartBar: {
    width: 10,
    backgroundColor: '#ECEFF1',
    borderRadius: 5,
  },
  chartBarFilled: {
    backgroundColor: '#2A9D8F',
  },
  chartBarToday: {
    borderWidth: 1,
    borderColor: '#E76F51',
  },
  barDayText: {
    fontSize: 9,
    color: '#7F8C8D',
    marginTop: 4,
    fontWeight: 'bold',
  },
  barDayToday: {
    color: '#E76F51',
  },

  // Estilos de la Gráfica de Clasificación
  classifChartContainer: {
    paddingHorizontal: 4,
  },
  classifRow: {
    marginBottom: 5,
  },
  classifRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  classifRowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classifRowText: {
    fontSize: 9,
    color: '#2C3E50',
    fontWeight: '600',
    marginLeft: 3,
  },
  classifRowVal: {
    fontSize: 9,
    color: '#7F8C8D',
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#ECEFF1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2A9D8F',
    borderRadius: 3,
  },

  summaryCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECEFF1',
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#7F8C8D',
    marginBottom: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 11,
    color: '#2C3E50',
    fontWeight: '600',
    marginLeft: 4,
  },
  paddingBottom: {
    height: 20,
  },
});
