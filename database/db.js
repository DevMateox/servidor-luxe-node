import pkg from "pg";
const { Pool } = pkg;

// Configuración de conexión correcta para Neon
export const pool = new Pool({
  host: "ep-royal-term-aem0mw71-pooler.c-2.us-east-2.aws.neon.tech",
  database: "neondb",
  user: "neondb_owner",
  password: "npg_IDVLiNwG7db2",
  ssl: {
    rejectUnauthorized: false,
  },
});

export default pool;
