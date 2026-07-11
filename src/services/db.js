import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("cashy_lite.db");

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

export const addTransaction = ({ title, amount, category, date, receipt_uri }) => {
  const result = db.runSync(
    `INSERT INTO transactions (title, amount, category, date, receipt_uri)
     VALUES (?, ?, ?, ?, ?);`,
    [title, amount, category, date, receipt_uri ?? null]
  );
  console.log(`[DB] Inserted transaction with ID: ${result.lastInsertRowId}`);
  return result.lastInsertRowId;
};

export const getAllTransactions = () => {
  const rows = db.getAllSync(
    `SELECT * FROM transactions ORDER BY date DESC, id DESC;`
  );
  return rows;
};

export const getRecentTransactions = (limit = 5) => {
  const rows = db.getAllSync(
    `SELECT * FROM transactions ORDER BY date DESC, id DESC LIMIT ?;`,
    [limit]
  );
  return rows;
};

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

export const clearAllTransactions = () => {
  db.execSync(`DELETE FROM transactions;`);
  // Reset the auto-increment counter so IDs start from 1 again
  db.execSync(
    `DELETE FROM sqlite_sequence WHERE name = 'transactions';`
  );
  console.log("[DB] All transactions cleared.");
};
