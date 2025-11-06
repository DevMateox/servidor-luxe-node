import express from "express";
import multer from "multer";
import {
  agregarProducto,
  obtenerProductos,
  actualizarProducto,
  eliminarProducto,
} from "../controllers/productosControllers.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Crear producto
router.post("/productos", upload.single("imagen"), agregarProducto);

// Obtener todos los productos
router.get("/obtener", obtenerProductos);

// Actualizar producto
router.put("/actualizar/:id", upload.single("imagen"), actualizarProducto);

// Eliminar producto
router.delete("/eliminar/:id", eliminarProducto);

export default router;
