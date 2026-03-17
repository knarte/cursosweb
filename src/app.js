import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

import { connectDB } from "./config/db.js"
import authRoutes from "./routes/auth.routes.js"
import courseRoutes from "./routes/course.routes.js"

dotenv.config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

// Necesario en ESM para obtener __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ruta a la carpeta public
const publicPath = path.join(__dirname, "../public")

// Servir archivos estáticos
app.use(express.static(publicPath))

// Abrir index.html en la raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"))
})

// Rutas API
app.use("/api", authRoutes)
app.use("/api", courseRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})