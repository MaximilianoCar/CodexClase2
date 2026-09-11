import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import path from 'path';

let dbInstance = null;

export async function connectDB() {
  if (dbInstance) return dbInstance;

  // 1. abrir la conexión al archivo .sqlite
  dbInstance = await open({
    filename: path.join(process.cwd(), 'database.sqlite'),
    driver: sqlite3.Database
  });

  // 2. ejecutar el schema.sql
  const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
  const schemaSql = await fs.readFile(schemaPath, 'utf-8');
  await dbInstance.exec(schemaSql);

  // 3. ejecutar el seed.sql
  const seedPath = path.join(process.cwd(), 'src', 'db', 'seed.sql');
  const seedSql = await fs.readFile(seedPath, 'utf-8');
  await dbInstance.exec(seedSql);

  // 4. Imprimir estado de la conexión y conteo de tablas/registros
  console.log('Conexión con SQLite establecida exitosamente.');

  const tables = await dbInstance.all(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
  );

  console.log('Estado de las tablas:');
  for (const table of tables) {
    const countResult = await dbInstance.get(`SELECT COUNT(*) as total FROM ${table.name}`);
    console.log(`   • Tabla '${table.name}': ${countResult.total} registros.`);
  }

  return dbInstance;
}

export function getDB() {
  if (!dbInstance) {
    throw new Error('La base de datos aún no ha sido inicializada.');
  }
  return dbInstance;
}