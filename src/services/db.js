// ============================================================
// src/services/db.js — SQLite Database Service
//
// This is the single source of truth for all database
// interactions in Cashy Lite. It uses expo-sqlite v15 which
// ships with Expo SDK 54.
//
// IMPORTANT API NOTE (Expo SQLite v15):
// The new API uses `openDatabaseSync()` for a synchronous
// connection object. Queries are executed via:
//   db.runSync(sql, params)     → for INSERT/UPDATE/DELETE
//   db.getFirstSync(sql, params) → for SELECT returning one row
//   db.getAllSync(sql, params)   → for SELECT returning all rows
//
// These synchronous methods run on the JS thread but are
// optimized internally. For heavy workloads, use the async
// variants or run inside `db.withTransactionSync()`.
// ============================================================

import * as SQLite from "expo-sqlite";

// ─── Open (or create) the database file ─────────────────────
// The database file is stored in the app's document directory.
// Calling `openDatabaseSync` is idempotent — it returns the
// existing connection if already opened.
const db = SQLite.openDatabaseSync("cashy_lite.db");

// ============================================================
// initDB()
// Creates the `transactions` table if it does not already
// exist. Call this ONCE at app startup (inside App.js useEffect
// or before rendering the navigator).
//
// Schema:
//   id          — auto-incrementing primary key
//   title       — short description of the transaction
//   amount      — monetary value (stored as REAL / float)
//   category    — e.g., "Makanan", "Transportasi", "Hiburan"
//   date        — ISO 8601 string, e.g., "2024-07-15"
//   receipt_uri — local file URI from expo-image-picker (nullable)
// ============================================================
export const initDB = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      amount      REAL    NOT NULL,
      category    TEXT    NOT NULL,
      date        TEXT    NOT NULL,
      receipt_uri TEXT
    );
  `);
  console.log("[DB] Database initialized successfully.");
};

// ============================================================
// addTransaction(transaction)
// Inserts a new transaction row into the database.
//
// @param {Object} transaction
//   @param {string} transaction.title       — Transaction name
//   @param {number} transaction.amount      — Amount in IDR
//   @param {string} transaction.category    — Category label
//   @param {string} transaction.date        — ISO date string
//   @param {string|null} transaction.receipt_uri — Image URI or null
//
// @returns {number} The `lastInsertRowId` of the new record.
// ============================================================
export const addTransaction = ({ title, amount, category, date, receipt_uri }) => {
  const result = db.runSync(
    `INSERT INTO transactions (title, amount, category, date, receipt_uri)
     VALUES (?, ?, ?, ?, ?);`,
    [title, amount, category, date, receipt_uri ?? null]
  );
  console.log(`[DB] Inserted transaction with ID: ${result.lastInsertRowId}`);
  return result.lastInsertRowId;
};

// ============================================================
// getAllTransactions()
// Fetches ALL transactions ordered by date descending
// (most recent first). Used by the History screen.
//
// @returns {Array<Object>} Array of transaction row objects.
// ============================================================
export const getAllTransactions = () => {
  const rows = db.getAllSync(
    `SELECT * FROM transactions ORDER BY date DESC, id DESC;`
  );
  return rows;
};

// ============================================================
// getRecentTransactions(limit)
// Fetches only the N most recent transactions.
// Used by the Dashboard screen to show a summary preview.
//
// @param {number} limit — Maximum number of rows to return.
// @returns {Array<Object>}
// ============================================================
export const getRecentTransactions = (limit = 5) => {
  const rows = db.getAllSync(
    `SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT ?;`,
    [limit]
  );
  return rows;
};

// ============================================================
// getMonthlyTotal(year, month)
// Calculates the SUM of all transaction amounts for a given
// calendar month. Used by the Dashboard summary card.
//
// @param {number} year  — 4-digit year, e.g., 2024
// @param {number} month — 1-indexed month, e.g., 7 for July
// @returns {number} Total amount (0 if no records found).
// ============================================================
export const getMonthlyTotal = (year, month) => {
  // Pad month to 2 digits for ISO string prefix matching
  const monthStr = String(month).padStart(2, "0");
  const prefix = `${year}-${monthStr}`;

  const row = db.getFirstSync(
    `SELECT SUM(amount) AS total FROM transactions WHERE date LIKE ?;`,
    [`${prefix}%`]
  );
  return row?.total ?? 0;
};

// ============================================================
// clearAllTransactions()
// DELETES every row in the transactions table.
// Also resets the AUTOINCREMENT counter via sqlite_sequence.
// Intended for demo resets — shown in the Profile screen.
// ============================================================
export const clearAllTransactions = () => {
  db.execSync(`DELETE FROM transactions;`);
  // Reset the auto-increment counter so IDs start from 1 again
  db.execSync(
    `DELETE FROM sqlite_sequence WHERE name = 'transactions';`
  );
  console.log("[DB] All transactions cleared.");
};
