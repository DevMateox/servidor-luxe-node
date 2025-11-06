import express from "express";
import productosRoutes from "../routes/productosRoutes.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["https://dashborad-luxe-ventas.vercel.app", "https://pagina-luxe-front.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api", productosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
