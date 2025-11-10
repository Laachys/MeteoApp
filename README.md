# 🌤️ MeteoAPP

**MeteoAPP* es una aplicación desarrollada en Angular que muestra, a partir de un archivo YAML de datos meteorológicos, la evolución de la **temperatura** y la **energía (kW)** en tiempo real.

Cada 5 segundos actualiza la información simulando un entorno dinámico, mostrando además los valores promedio acumulados desde que se inicia la aplicación.

---

## 🧠 Características principales

  - Visualización de temperatura y potencia en gráficas dinámicas (Ngx-Charts)
  - Actualización automática cada 5 segundos
  - Conversión de potencia a energía en kWh
  - Cálculo de temperatura promedio desde el inicio
  - Lectura de datos desde un archivo YAML (`assets/data/data.yml`)
  - Interfaz moderna y responsive con Angular Material

---

## ⚙️ Tecnologías utilizadas

| Tecnología | Descripción |
|-------------|-------------|
| **Angular** | Framework principal de la aplicación |
| **RxJS**    | Manejo de flujos de datos reactivos |
| **TypeScript** | Tipado estático y modularidad del código |
| **Ngx-Charts** | Librería para la generación de gráficas |
| **Angular Material** | Componentes UI modernos y accesibles |
| **js-yaml** | Parser para leer y procesar archivos YAML |

---

## 🚀 Instalación y ejecución

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/MeteoAPP.git
   cd MeteoAPP
2. **Instala las dependencias**
  npm install
3. **Ejecuta el servidor de desarrollo**
  ng serve
4. **Abre tu navegador en la ruta generada**
  Ejemplo: http://localhost:4200

## 🌐 Despliegue en GitHub Pages
1. Instalar herramienta:
   npm install -g angular-cli-ghpages
2. Construir el proyecto para producción:
   ng build --output-path dist/Meteo-app --base-href "https://TU-USUARIO.github.io/Meteo-app/"
3. Publicar en GitHub Pages:
   npx angular-cli-ghpages --dir=dist/Meteo-app
4. Ver en:
   https://TU-USUARIO.github.io/Meteo-app/
Reemplaza TU-USUARIO con tu nombre de usuario de GitHub.
Cada vez que actualices el proyecto, vuelve a ejecutar los pasos 2 y 3.

## 📦 Estructura del proyecto
src/
├─ app/
│ ├─ core/
│ │ ├─ models/ # Interfaces y tipos de datos
│ │ └─ services/ # Servicios principales (DataWeatherService, etc.)
│ ├─ features/
│ │ └─ dashboard-weather/ # Componente principal del dashboard
│ │ ├─ dashboard-weather.component.html
│ │ ├─ dashboard-weather.component.scss
│ │ ├─ dashboard-weather.component.spec.ts
│ │ └─ dashboard-weather.component.ts
│ ├─ app.component.html
│ ├─ app.component.scss
│ ├─ app.component.ts
│ ├─ app.config.ts
│ └─ app.routes.ts
│
├─ assets/
│ ├─ data/
│ │ └─ data.yml # Archivo YAML con datos meteorológicos
│ └─ img/
│ └─ nube.png # Recursos gráficos
│
├─ styles/
│ ├─ base/
│ │ └─ variables.scss # Variables globales de estilo
│ ├─ features/
│ │ └─ dashboard.scss # Estilos específicos del dashboard
│ ├─ layout/
│ │ └─ header.scss # Estilos de layout
│ └─ main.scss # Archivo SCSS principal
│
├─ index.html
├─ main.ts
└─ styles.scss

## 🧩 Estructura de datos YAML
temperature:
  unit: "dk"
  values:
    - time: "00:00:00"
      value: 280
    - time: "00:05:00"
      value: 281
power:
  unit: "MW"
  values:
    - time: "00:00:00"
      value: 1.5
    - time: "00:05:00"
      value: 1.7

## 👨‍💻 Autor
Desarrollado con ❤️ por Laura Picazo, https://github.com/Laachys 