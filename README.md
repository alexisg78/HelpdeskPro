# HelpdeskPro

## 🚀 Desarrollo (Dev)

```sh
# 1️⃣ Clonar el proyecto  
git clone https://github.com/alexisg78/AppHelpDesk.git
cd AppHelpdesk

# 2️⃣ Instalar dependencias  
npm install

# 3️⃣ Configurar el entorno  
# Editar el archivo src/environments/environment.ts y asegurarse de que contenga lo siguiente:

"export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'
};" 

# 4️⃣ Levantar el backend  
npm run backend

# 5️⃣ Ejecutar la app  
# Opción 1 (Ionic CLI)
ionic serve

# Opción 2 (Angular CLI)
ng serve -o
