# VitaDosis - Recordatorio de Medicamentos (Wearable & Mobile)

**VitaDosis** es una aplicación desarrollada con **React Native** y **Expo SDK 54**, optimizada tanto para teléfonos móviles como para dispositivos wearables (smartwatches con pantallas circulares). La aplicación ayuda a los usuarios a registrar, programar, editar y dar seguimiento a sus tratamientos médicos diarios de manera intuitiva y adaptada al tacto.

---

## 🚀 Características Clave

1. **Diseño Adaptable Dual (Celular y Reloj Inteligente)**:
   - Alterna instantáneamente entre la vista de smartphone y un simulador de reloj circular con un solo toque.
   - Márgenes y espaciados inteligentes (`paddingHorizontal` y `paddingBottom` condicionales) diseñados para prevenir el recorte de contenido en pantallas curvas y circulares.

2. **Dosificación Avanzada**:
   - Permite definir la **Hora de Inicio** de la primera dosis.
   - Configura la **Frecuencia** (cada cuántas horas) y **Duración** del tratamiento (en días) mediante controles táctiles de incremento y decremento `[ - ]` y `[ + ]`.
   - Motor de tiempo que calcula la fecha/hora exacta de la siguiente dosis o detecta si se encuentra atrasada.

3. **CRUD Completo de Medicamentos**:
   - **Crear**: Registro con nombre, dosis, clasificación, frecuencia, duración y hora inicial.
   - **Leer**: Visualización compacta en tarjetas explicativas.
   - **Actualizar**: Modal de edición de campos con validación de no duplicados.
   - **Eliminar**: Confirmaciones táctiles seguras para remover medicamentos.

4. **Gráficos de Progreso Integrados**:
   - **Historial Semanal**: Gráfico de barras que muestra las confirmaciones diarias (de lunes a domingo) destacando el día actual.
   - **Distribución por Categoría**: Barra de progreso horizontal que ilustra la cantidad de medicamentos por tipo (Oral, Inyección, Inhalador, Tópico, Gotas).

5. **Clasificación de Medicamentos**:
   - Identificadores visuales rápidos con iconos dedicados de la librería `@expo/vector-icons` (pastillas, jeringas, inhaladores, gotas, etc.).

6. **Estilo Salud Moderno y Accesible**:
   - Colores contrastantes: Fondo claro (`#F4F9F5`), Verde Clínico (`#2A9D8F`), contenedores suaves y un sistema de botones de interacción destacados en tono **Rosa Claro** (`#F8BBD0`) con texto en **Rosa Oscuro** (`#C2185B`) para una óptima lectura.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalados los siguientes componentes antes de iniciar:

- [Node.js](https://nodejs.org/) (Versión LTS recomendada, v18 o superior).
- [Git](https://git-scm.com/) instalado en tu equipo.
- **Expo Go** (aplicación móvil gratuita disponible en la Google Play Store o Apple App Store) instalada en el celular o reloj donde desees visualizar la aplicación de forma remota.

---

## 📥 Instalación en un Equipo Local

Sigue estos pasos para descargar y configurar el proyecto en tu máquina:

1. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/Adan81279/VitaDosis.git
   ```

2. **Navegar al Directorio del Proyecto**:
   ```bash
   cd VitaDosis
   ```

3. **Instalar Dependencias**:
   ```bash
   npm install
   ```

---

## 🖥️ Cómo Correr la Aplicación

Para poner en marcha el servidor de desarrollo de Expo local:

```bash
npx expo start
```
*(También puedes usar `npm start`)*.

Al ejecutar este comando, se levantará la suite de Expo y se mostrará un código QR gigante en tu consola de comandos, así como una interfaz de control en el navegador.

---

## 📱 Cómo Visualizar la Aplicación en tu Dispositivo Remoto (Celular/Reloj)

Para visualizar los cambios en tiempo real desde tu dispositivo físico sin necesidad de cables:

### Método A: Dispositivos en la misma red Wi-Fi (Recomendado)
1. Conecta tu computadora y tu celular/reloj inteligente a la **misma red Wi-Fi**.
2. Corre `npx expo start`.
3. Abre la aplicación **Expo Go** en tu dispositivo.
4. **Android**: Escanea el código QR que aparece en la terminal de la computadora usando la cámara de la app Expo Go.
5. **iOS**: Escanea el código QR con la app de Cámara nativa del teléfono y pulsa el enlace para abrirlo en Expo Go.

### Método B: Redes diferentes o restricciones de red (Modo Tunnel)
Si estás utilizando una red corporativa, estudiantil o datos móviles en el celular que impiden la conexión directa por IP local:
1. Detén el servidor (`Ctrl + C`).
2. Arranca el servidor utilizando un túnel seguro de Ngrok provisto por Expo:
   ```bash
   npx expo start --tunnel
   ```
3. Escanea el nuevo código QR generado. Este método conecta tu dispositivo y tu computadora a través de internet de forma segura, sin importar en qué red esté cada uno.

### Uso del Emulador en Computadora
- Si deseas correrlo en un simulador local en tu equipo:
  - Presiona `a` en la terminal para abrir el emulador de **Android** (debes tener Android Studio configurado).
  - Presiona `i` en la terminal para abrir el simulador de **iOS** (disponible solo en macOS con Xcode).

---

## 💡 Consejos de Visualización Wearable
Una vez abierta la aplicación en tu celular/reloj, encontrarás un switch de activación en la parte superior derecha que dice **"Vista Reloj"** o **"Vista Celular"**. 

- Activa la **"Vista Reloj"** para recortar visualmente la pantalla a formato circular. Esto te permitirá simular y validar que ningún botón importante o información de medicamentos quede oculta por los bordes físicos de una pantalla redonda de smartwatch.
