import pool from "../database/db.js";
import cloudinary from "../cloudinary/index.js";
import fs from "fs";


// Controlador para agregar un producto
export const agregarProducto = async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio, stock, estado } = req.body;

    // Validaciones básicas
    if (!nombre || !categoria || !descripcion || !precio || !stock || !estado) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    // Subir imagen a Cloudinary si se envió un archivo
    let imagenUrl = null;
    if (req.file) {
      const resultado = await cloudinary.uploader.upload(req.file.path, {
        folder: "productos",
      });
      imagenUrl = resultado.secure_url;

      // Eliminar archivo temporal
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error al eliminar archivo temporal:", err);
      });
    }

    // Insertar en la base de datos
    const query = `
      INSERT INTO productos (nombre, categoria, descripcion, precio, stock, imagen, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const valores = [
      nombre,
      categoria,
      descripcion,
      precio,
      stock,
      imagenUrl,
      estado,
    ];

    const { rows } = await pool.query(query, valores);

    res.status(201).json({
      mensaje: "Producto agregado exitosamente",
      producto: rows[0],
    });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Controlador para obtener todos los productos
export const obtenerProductos = async (req, res) => {
  try {
    const query = "SELECT * FROM productos ORDER BY id ASC;";
    const { rows } = await pool.query(query);
    res.status(200).json({
      mensaje: "Productos obtenidos exitosamente",
      productos: rows,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Controlador para actualizar un producto
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, descripcion, precio, stock, estado } = req.body;

    // Validar campos obligatorios
    if (!nombre || !categoria || !descripcion || !precio || !stock || !estado) {
      return res.status(400).json({ mensaje: "Faltan campos obligatorios" });
    }

    // Variable para la URL de la imagen
    let imagenUrl = null;

    // Si se envía archivo, sube a Cloudinary
    if (req.file) {
      const resultado = await cloudinary.uploader.upload(req.file.path, { folder: "productos" });
      imagenUrl = resultado.secure_url;

      // Eliminar archivo temporal
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error al eliminar archivo temporal:", err);
      });
    }

    // Armar query según si hay nueva imagen o no
    let query, valores;
    if (imagenUrl) {
      query = `
        UPDATE productos
        SET nombre=$1, categoria=$2, descripcion=$3, precio=$4,
            stock=$5, estado=$6, imagen=$7
        WHERE id=$8
        RETURNING *;
      `;
      valores = [nombre, categoria, descripcion, precio, stock, estado, imagenUrl, id];
    } else {
      query = `
        UPDATE productos
        SET nombre=$1, categoria=$2, descripcion=$3, precio=$4,
            stock=$5, estado=$6
        WHERE id=$7
        RETURNING *;
      `;
      valores = [nombre, categoria, descripcion, precio, stock, estado, id];
    }

    // Ejecutar query
    const { rows } = await pool.query(query, valores);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Responder con el producto actualizado
    res.status(200).json({
      mensaje: "Producto actualizado exitosamente",
      producto: rows[0],
    });

  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

// Controlador para eliminar un producto
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM productos WHERE id = $1 RETURNING *;";
    const valores = [id];

    const { rows } = await pool.query(query, valores);

    if (rows.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    } else {
      res.status(200).json({
        mensaje: "Producto eliminado exitosamente",
        producto: rows[0],
      });
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};