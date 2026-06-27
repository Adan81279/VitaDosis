/**
 * Valida si una cadena de texto tiene el formato de hora HH:MM de 24 horas.
 * Admite formatos como "08:00", "8:00", "23:59", etc.
 */
export const validateTimeFormat = (timeStr) => {
  if (!timeStr) return false;
  const regex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return regex.test(timeStr.trim());
};

/**
 * Normaliza una cadena de hora a formato de dos dígitos (ej. "8:05" -> "08:05").
 */
export const normalizeTime = (timeStr) => {
  if (!validateTimeFormat(timeStr)) return timeStr;
  const [hours, minutes] = timeStr.trim().split(':');
  const h = hours.padStart(2, '0');
  const m = minutes.padStart(2, '0');
  return `${h}:${m}`;
};

/**
 * Calcula cuál es la próxima toma de medicamentos a partir de la lista de medicamentos
 * y el historial de tomas guardado, considerando:
 * - Hora de inicio (startTime)
 * - Frecuencia (cada X horas)
 * - Duración (por Y días)
 * 
 * Retorna un objeto con la información de la toma o null si no hay medicamentos pendientes.
 */
export const getNextDose = (medications, history) => {
  if (!medications || medications.length === 0) return null;

  const now = new Date();

  const candidates = medications.map((med) => {
    // 1. Determinar fecha de inicio
    // Si no tiene med.startDate, asumimos que inició el día de su registro (derivado del ID)
    const startDate = med.startDate ? new Date(med.startDate) : new Date(parseInt(med.id, 10) || Date.now());
    
    // Configurar horas y minutos de inicio
    const [hours, minutes] = (med.time || "08:00").split(':').map(Number);
    startDate.setHours(hours, minutes, 0, 0);

    // 2. Determinar fecha de fin de tratamiento
    const durationDays = parseInt(med.duration, 10) || 30; // por defecto 30 días si no tiene
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + durationDays);

    // Si ya expiró el tratamiento completo
    if (now > endDate) {
      return {
        medication: med,
        targetDate: null,
        isOverdue: false,
        isCompleted: true,
      };
    }

    const freqHours = parseInt(med.frequency, 10) || 24; // por defecto cada 24 horas si no tiene
    let slotDate = new Date(startDate);
    
    let targetDate = null;
    let isOverdue = false;

    // Buscar el primer slot de dosis no tomado
    while (slotDate <= endDate) {
      // Definir ventana de toma alrededor de este slot
      // Se considera tomado si hay una toma en el historial en el rango [Slot - 2h, Slot + Frecuencia/2]
      const windowStart = new Date(slotDate);
      windowStart.setHours(windowStart.getHours() - 2);

      const windowEnd = new Date(slotDate);
      windowEnd.setHours(windowEnd.getHours() + Math.max(freqHours / 2, 1)); // mínimo 1h de margen

      const wasTaken = history.some((hist) => {
        if (hist.medicationId !== med.id) return false;
        const takenDate = new Date(hist.takenAt);
        return takenDate >= windowStart && takenDate <= windowEnd;
      });

      if (!wasTaken) {
        // Encontramos el primer slot pendiente
        targetDate = new Date(slotDate);
        if (slotDate <= now) {
          isOverdue = true;
        }
        break;
      }

      // Avanzar al siguiente slot según la frecuencia
      slotDate.setHours(slotDate.getHours() + freqHours);
    }

    return {
      medication: med,
      targetDate,
      isOverdue,
      isCompleted: targetDate === null,
    };
  });

  // Filtrar candidatos completados o sin tomas pendientes
  const activeCandidates = candidates.filter(c => !c.isCompleted && c.targetDate !== null);

  if (activeCandidates.length === 0) return null;

  // Ordenar candidatos:
  // 1. Las tomas retrasadas (isOverdue === true) van primero, ordenadas por antigüedad de retraso.
  // 2. Luego las tomas futuras, ordenadas por cercanía cronológica.
  activeCandidates.sort((a, b) => {
    if (a.isOverdue && !b.isOverdue) return -1;
    if (!a.isOverdue && b.isOverdue) return 1;
    return a.targetDate - b.targetDate;
  });

  return activeCandidates[0];
};

/**
 * Formatea una fecha en una cadena legible en español (ej. "Hoy, 14:30", "Mañana, 08:00").
 */
export const formatDoseTime = (targetDate, isOverdue) => {
  if (!targetDate) return 'Tratamiento completado';
  
  const now = new Date();
  const todayStr = now.toDateString();
  
  const tomorrow = new Date();
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toDateString();

  const targetStr = targetDate.toDateString();

  const hours = String(targetDate.getHours()).padStart(2, '0');
  const minutes = String(targetDate.getMinutes()).padStart(2, '0');
  const timeFormatted = `${hours}:${minutes}`;

  if (isOverdue) {
    return `Retrasado desde las ${timeFormatted}`;
  }

  if (targetStr === todayStr) {
    return `Hoy a las ${timeFormatted}`;
  } else if (targetStr === tomorrowStr) {
    return `Mañana a las ${timeFormatted}`;
  } else {
    // Otro día (formato corto)
    const options = { day: 'numeric', month: 'short' };
    const dateFormatted = targetDate.toLocaleDateString('es-ES', options);
    return `${dateFormatted} a las ${timeFormatted}`;
  }
};
