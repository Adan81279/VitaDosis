import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HistoryList({ history, onClearHistory, isWatchMode }) {

  const confirmClearAll = () => {
    Alert.alert(
      'Limpiar Historial',
      '¿Estás seguro de que deseas vaciar todo el historial de tomas? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Vaciar', 
          style: 'destructive', 
          onPress: onClearHistory 
        }
      ]
    );
  };

  const formatExactDate = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Obtener día y mes corto
    const day = date.getDate();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = months[date.getMonth()];

    return `${day} ${month} - ${hours}:${minutes}`;
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.historyCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.medName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.checkBadge}>
            <MaterialCommunityIcons name="check" size={8} color="#FFFFFF" />
            <Text style={styles.badgeText}>Tomado</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.doseText}>
            Dosis: {item.dose}
          </Text>
          <Text style={styles.timeText}>
            {formatExactDate(item.takenAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, isWatchMode && styles.headerWatch]}>
        <MaterialCommunityIcons name="history" size={isWatchMode ? 20 : 24} color="#2A9D8F" />
        <Text style={[styles.title, isWatchMode && styles.titleWatch]}>Historial</Text>
        
        {history.length > 0 && (
          <TouchableOpacity 
            style={[styles.clearBtn, isWatchMode && styles.clearBtnWatch]} 
            onPress={confirmClearAll}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons name="delete-sweep-outline" size={isWatchMode ? 16 : 18} color="#E76F51" />
          </TouchableOpacity>
        )}
      </View>

      {history.length > 0 ? (
        <FlatList
          data={history}
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
          <MaterialCommunityIcons name="calendar-clock" size={40} color="#90A4AE" />
          <Text style={styles.emptyText}>
            Aún no has registrado ninguna toma.
          </Text>
        </View>
      )}
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
    marginBottom: 8,
    position: 'relative',
    paddingTop: 8,
    width: '100%',
  },
  headerWatch: {
    justifyContent: 'center',
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
  clearBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  clearBtnWatch: {
    position: 'relative',
    right: 0,
    top: 0,
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: 4,
  },
  listContentFull: {
    paddingBottom: 60,
  },
  listContentWatch: {
    paddingBottom: 90, // Espacio suficiente para evitar el recorte del smartwatch y la barra de tabs
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 6,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#2A9D8F',
    borderWidth: 1,
    borderColor: '#ECEFF1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  medName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2C3E50',
    flex: 1,
  },
  checkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A9D8F',
    paddingVertical: 1,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: 'bold',
    marginLeft: 1.5,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  doseText: {
    fontSize: 9,
    color: '#78909C',
  },
  timeText: {
    fontSize: 9,
    color: '#546E7A',
    fontWeight: '600',
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
    marginTop: 8,
  },
});
