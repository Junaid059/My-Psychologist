// Simple in-memory database with file persistence
// This replaces the better-sqlite3 requirement
import fs from 'fs';
import path from 'path';

interface DatabaseStore {
  [tableName: string]: Record<string, any>[];
}

class InMemoryDatabase {
  private data: DatabaseStore = {};
  private filePath: string;

  constructor(filename: string) {
    this.filePath = path.join(process.cwd(), 'data', filename);
    this.ensureDir();
    this.load();
  }

  private ensureDir() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const content = fs.readFileSync(this.filePath, 'utf-8');
        this.data = JSON.parse(content);
      }
    } catch (error) {
      console.error('Error loading database:', error);
      this.data = {};
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  createTable(name: string) {
    if (!this.data[name]) {
      this.data[name] = [];
      this.save();
    }
  }

  insert(table: string, record: Record<string, any>) {
    if (!this.data[table]) {
      this.createTable(table);
    }
    this.data[table].push(record);
    this.save();
  }

  find(table: string, filter?: (record: Record<string, any>) => boolean) {
    if (!this.data[table]) {
      return [];
    }
    if (!filter) {
      return this.data[table];
    }
    return this.data[table].filter(filter);
  }

  findOne(table: string, filter: (record: Record<string, any>) => boolean) {
    const results = this.find(table, filter);
    return results.length > 0 ? results[0] : null;
  }

  update(table: string, filter: (record: Record<string, any>) => boolean, updates: Record<string, any>) {
    if (!this.data[table]) {
      return;
    }
    const records = this.data[table];
    for (let i = 0; i < records.length; i++) {
      if (filter(records[i])) {
        this.data[table][i] = { ...this.data[table][i], ...updates };
      }
    }
    this.save();
  }

  delete(table: string, filter: (record: Record<string, any>) => boolean) {
    if (!this.data[table]) {
      return;
    }
    this.data[table] = this.data[table].filter((record) => !filter(record));
    this.save();
  }

  deleteOne(table: string, filter: (record: Record<string, any>) => boolean) {
    if (!this.data[table]) {
      return;
    }
    const index = this.data[table].findIndex((record) => filter(record));
    if (index !== -1) {
      this.data[table].splice(index, 1);
      this.save();
    }
  }

  clear(table: string) {
    if (this.data[table]) {
      this.data[table] = [];
      this.save();
    }
  }

  getAllTables() {
    return Object.keys(this.data);
  }

  getTableData(table: string) {
    return this.data[table] || [];
  }
}

export default InMemoryDatabase;
