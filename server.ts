import express from 'express';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import 'dotenv/config';
import path from 'path';
import { MOCK_VEHICLES, MOCK_CONTACT_MESSAGES, MOCK_INVOICES, MOCK_TRANSACTIONS, MOCK_BILLS, MOCK_CONTACT_ENTITIES } from './constants.ts';
import { Vehicle, ContactMessage, Invoice, Transaction, VendorBill, ContactEntity } from './types.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize MySQL Connection
  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'oldroad_db'
  });

  console.log('--- CONNECTED TO SEPARATE MYSQL SERVER ---');

  // --- DATABASE SCHEMA SETUP (MySQL Syntax) ---
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id VARCHAR(255) PRIMARY KEY,
        vin VARCHAR(255),
        year INT,
        make VARCHAR(255),
        model VARCHAR(255),
        trim VARCHAR(255),
        price INT,
        km INT,
        fuelType VARCHAR(50),
        bodyStyle VARCHAR(50),
        status VARCHAR(50),
        location VARCHAR(255),
        images TEXT,
        description TEXT,
        carfaxUrl TEXT,
        features TEXT,
        readyToSaleDate VARCHAR(50),
        postDate VARCHAR(50),
        inventoryImage TEXT,
        contractUrl TEXT,
        dischargeUrl TEXT,
        isDischarged TINYINT(1),
        accessories TEXT,
        transmission VARCHAR(255),
        engine VARCHAR(255),
        drivetrain VARCHAR(255),
        soldById VARCHAR(255),
        saleDate VARCHAR(50),
        buyerName VARCHAR(255)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(255) PRIMARY KEY,
        fullName VARCHAR(255),
        email VARCHAR(255),
        subject VARCHAR(255),
        message TEXT,
        status VARCHAR(50),
        createdAt VARCHAR(50)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS invoices (
        id VARCHAR(255) PRIMARY KEY,
        date VARCHAR(50),
        dueDate VARCHAR(50),
        customerId VARCHAR(255),
        customerName VARCHAR(255),
        amount DOUBLE,
        taxAmount DOUBLE,
        status VARCHAR(50),
        items TEXT,
        notes TEXT
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(255) PRIMARY KEY,
        postingDate VARCHAR(50),
        invoiceDate VARCHAR(50),
        systemEntryDate VARCHAR(50),
        type VARCHAR(50),
        category VARCHAR(255),
        amount DOUBLE,
        taxAmount DOUBLE,
        description TEXT,
        locationId VARCHAR(255),
        accountCode VARCHAR(50),
        periodId VARCHAR(50),
        referenceId VARCHAR(255)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS bills (
        id VARCHAR(255) PRIMARY KEY,
        billNumber VARCHAR(255),
        postingDate VARCHAR(50),
        invoiceDate VARCHAR(50),
        systemEntryDate VARCHAR(50),
        dueDate VARCHAR(50),
        vendorName VARCHAR(255),
        vendorType VARCHAR(255),
        amount DOUBLE,
        taxAmount DOUBLE,
        status VARCHAR(50),
        category VARCHAR(255),
        notes TEXT
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS entities (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        category VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        address TEXT,
        notes TEXT,
        attachmentUrl TEXT,
        attachmentName TEXT,
        createdAt VARCHAR(50)
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        role VARCHAR(50),
        location VARCHAR(255)
      )
    `);
    console.log('--- DATABASE SCHEMA VERIFIED ---');
  } catch (err) {
    console.error('--- ERROR SETTING UP DATABASE SCHEMA ---', err);
  }

  // --- SEEDING (MySQL Syntax) ---
  try {
    const [userRows] = await db.execute('SELECT COUNT(*) as count FROM users');
    if ((userRows as any)[0].count === 0) {
      const mockUsers = [
        { id: 'u1', email: 'admin@oldroad.auto', password: 'password123', firstName: 'Admin', lastName: 'User', role: 'ADMIN', location: 'Main Showroom' },
        { id: 'u2', email: 'sales@oldroad.auto', password: 'password123', firstName: 'Sales', lastName: 'Rep', role: 'SALES', location: 'Downtown Lot' },
        { id: 'u3', email: 'customer@gmail.com', password: 'password123', firstName: 'John', lastName: 'Customer', role: 'CUSTOMER', location: 'Main Showroom' }
      ];
      for (const u of mockUsers) {
        await db.execute(
          `INSERT INTO users (id, email, password, firstName, lastName, role, location) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [u.id, u.email, u.password, u.firstName, u.lastName, u.role, u.location]
        );
      }
      console.log('--- USERS SEEDED ---');
    }
  } catch (err) {
    console.error('--- ERROR SEEDING USERS ---', err);
  }

  const [vehicleRows] = await db.execute('SELECT COUNT(*) as count FROM vehicles');
  if ((vehicleRows as any)[0].count === 0) {
    for (const v of MOCK_VEHICLES) {
      await db.execute(
        `INSERT INTO vehicles (id, vin, year, make, model, trim, price, km, fuelType, bodyStyle, status, location, images, description, carfaxUrl, features, readyToSaleDate, postDate, inventoryImage, contractUrl, dischargeUrl, isDischarged, accessories, transmission, engine, drivetrain, soldById, saleDate, buyerName) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          v.id ?? null, v.vin ?? null, v.year ?? null, v.make ?? null, v.model ?? null, v.trim ?? null, 
          v.price ?? null, v.km ?? null, v.fuelType ?? null, v.bodyStyle ?? null, v.status ?? null, 
          v.location ?? null, JSON.stringify(v.images ?? []), v.description ?? null, v.carfaxUrl ?? null, 
          JSON.stringify(v.features ?? {}), v.readyToSaleDate ?? null, v.postDate ?? null, 
          v.inventoryImage ?? null, v.contractUrl ?? null, v.dischargeUrl ?? null, 
          v.isDischarged ? 1 : 0, JSON.stringify(v.accessories ?? []), v.transmission ?? null, 
          v.engine ?? null, v.drivetrain ?? null, v.soldById ?? null, v.saleDate ?? null, v.buyerName ?? null
        ]
      );
    }
  }

  const [messageRows] = await db.execute('SELECT COUNT(*) as count FROM messages');
  if ((messageRows as any)[0].count === 0) {
    for (const m of MOCK_CONTACT_MESSAGES) {
      await db.execute(
        `INSERT INTO messages (id, fullName, email, subject, message, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [m.id ?? null, m.fullName ?? null, m.email ?? null, m.subject ?? null, m.message ?? null, m.status ?? null, m.createdAt ?? null]
      );
    }
  }

  const [invoiceRows] = await db.execute('SELECT COUNT(*) as count FROM invoices');
  if ((invoiceRows as any)[0].count === 0) {
    for (const inv of MOCK_INVOICES) {
      await db.execute(
        `INSERT INTO invoices (id, date, dueDate, customerId, customerName, amount, taxAmount, status, items, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [inv.id ?? null, inv.date ?? null, inv.dueDate ?? null, inv.customerId ?? null, inv.customerName ?? null, inv.amount ?? null, inv.taxAmount ?? null, inv.status ?? null, JSON.stringify(inv.items ?? []), inv.notes ?? null]
      );
    }
  }

  const [transactionRows] = await db.execute('SELECT COUNT(*) as count FROM transactions');
  if ((transactionRows as any)[0].count === 0) {
    for (const t of MOCK_TRANSACTIONS) {
      await db.execute(
        `INSERT INTO transactions (id, postingDate, invoiceDate, systemEntryDate, type, category, amount, taxAmount, description, locationId, accountCode, periodId, referenceId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [t.id ?? null, t.postingDate ?? null, t.invoiceDate ?? null, t.systemEntryDate ?? null, t.type ?? null, t.category ?? null, t.amount ?? null, t.taxAmount ?? null, t.description ?? null, t.locationId ?? null, t.accountCode ?? null, t.periodId ?? null, t.referenceId ?? null]
      );
    }
  }

  const [billRows] = await db.execute('SELECT COUNT(*) as count FROM bills');
  if ((billRows as any)[0].count === 0) {
    for (const b of MOCK_BILLS) {
      await db.execute(
        `INSERT INTO bills (id, billNumber, postingDate, invoiceDate, systemEntryDate, dueDate, vendorName, vendorType, amount, taxAmount, status, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [b.id ?? null, b.billNumber ?? null, b.postingDate ?? null, b.invoiceDate ?? null, b.systemEntryDate ?? null, b.dueDate ?? null, b.vendorName ?? null, b.vendorType ?? null, b.amount ?? null, b.taxAmount ?? null, b.status ?? null, b.category ?? null, b.notes ?? null]
      );
    }
  }

  const [entityRows] = await db.execute('SELECT COUNT(*) as count FROM entities');
  if ((entityRows as any)[0].count === 0) {
    for (const e of MOCK_CONTACT_ENTITIES) {
      await db.execute(
        `INSERT INTO entities (id, name, category, email, phone, address, notes, attachmentUrl, attachmentName, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [e.id ?? null, e.name ?? null, e.category ?? null, e.email ?? null, e.phone ?? null, e.address ?? null, e.notes ?? null, e.attachmentUrl ?? null, e.attachmentName ?? null, e.createdAt ?? null]
      );
    }
  }

  // --- AUTH API ---
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
      const user = (rows as any[])[0];
      if (user) {
        res.json(user);
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/auth/signup', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const id = `u-${Math.random().toString(36).substr(2, 9)}`;
    const role = 'CUSTOMER';
    const location = 'Main Showroom';
    try {
      await db.execute(
        `INSERT INTO users (id, email, password, firstName, lastName, role, location) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, email, password, firstName, lastName, role, location]
      );
      const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
      res.status(201).json((rows as any[])[0]);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: 'Email already exists' });
      } else {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

  // --- VEHICLE API ---
  app.get('/api/vehicles', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM vehicles');
    const result = (rows as any[]).map(v => ({
      ...v,
      images: JSON.parse(v.images || '[]'),
      features: JSON.parse(v.features || '{}'),
      accessories: JSON.parse(v.accessories || '[]'),
      isDischarged: v.isDischarged === 1
    }));
    res.json(result);
  });

  app.post('/api/vehicles', async (req, res) => {
    const v = req.body;
    console.log('--- ATTEMPTING TO SAVE VEHICLE ---', v.vin);
    const id = v.id || `v-${Math.random().toString(36).substr(2, 9)}`;
    try {
      await db.execute(
        `INSERT INTO vehicles (id, vin, year, make, model, trim, price, km, fuelType, bodyStyle, status, location, images, description, carfaxUrl, features, readyToSaleDate, postDate, inventoryImage, contractUrl, dischargeUrl, isDischarged, accessories, transmission, engine, drivetrain, soldById, saleDate, buyerName) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, v.vin ?? null, v.year ?? null, v.make ?? null, v.model ?? null, v.trim ?? null, 
          v.price ?? null, v.km ?? null, v.fuelType ?? null, v.bodyStyle ?? null, v.status ?? null, 
          v.location ?? null, JSON.stringify(v.images || []), v.description ?? null, v.carfaxUrl ?? null, 
          JSON.stringify(v.features || {}), v.readyToSaleDate ?? null, v.postDate ?? null, 
          v.inventoryImage ?? null, v.contractUrl ?? null, v.dischargeUrl ?? null, 
          v.isDischarged ? 1 : 0, JSON.stringify(v.accessories || []), v.transmission ?? null, 
          v.engine ?? null, v.drivetrain ?? null, v.soldById ?? null, v.saleDate ?? null, v.buyerName ?? null
        ]
      );
      console.log('--- VEHICLE SAVED SUCCESSFULLY ---', id);
      const [savedRows] = await db.execute('SELECT * FROM vehicles WHERE id = ?', [id]);
      const saved = (savedRows as any[])[0];
      res.status(201).json({
        ...saved,
        images: JSON.parse(saved.images || '[]'),
        features: JSON.parse(saved.features || '{}'),
        accessories: JSON.parse(saved.accessories || '[]'),
        isDischarged: saved.isDischarged === 1
      });
    } catch (error) {
      console.error('--- ERROR SAVING VEHICLE ---', error);
      res.status(500).json({ error: 'Failed to save vehicle' });
    }
  });

  app.put('/api/vehicles/:id', async (req, res) => {
    const { id } = req.params;
    const v = req.body;
    console.log('--- ATTEMPTING TO UPDATE VEHICLE ---', id, v.vin);
    
    try {
      const [currentRows] = await db.execute('SELECT * FROM vehicles WHERE id = ?', [id]);
      const current = (currentRows as any[])[0];
      if (!current) {
        console.warn('--- VEHICLE NOT FOUND FOR UPDATE ---', id);
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      const updated = { ...current, ...v };
      
      await db.execute(
        `UPDATE vehicles SET 
          vin = ?, year = ?, make = ?, model = ?, trim = ?, price = ?, km = ?, fuelType = ?, bodyStyle = ?, status = ?, location = ?, images = ?, description = ?, carfaxUrl = ?, features = ?, readyToSaleDate = ?, postDate = ?, inventoryImage = ?, contractUrl = ?, dischargeUrl = ?, isDischarged = ?, accessories = ?, transmission = ?, engine = ?, drivetrain = ?, soldById = ?, saleDate = ?, buyerName = ?
         WHERE id = ?`,
        [
          updated.vin ?? null, updated.year ?? null, updated.make ?? null, updated.model ?? null, updated.trim ?? null, 
          updated.price ?? null, updated.km ?? null, updated.fuelType ?? null, updated.bodyStyle ?? null, updated.status ?? null, 
          updated.location ?? null, typeof updated.images === 'string' ? updated.images : JSON.stringify(updated.images || []), 
          updated.description ?? null, updated.carfaxUrl ?? null, typeof updated.features === 'string' ? updated.features : JSON.stringify(updated.features || {}), 
          updated.readyToSaleDate ?? null, updated.postDate ?? null, updated.inventoryImage ?? null, updated.contractUrl ?? null, 
          updated.dischargeUrl ?? null, updated.isDischarged ? 1 : 0, typeof updated.accessories === 'string' ? updated.accessories : JSON.stringify(updated.accessories || []), 
          updated.transmission ?? null, updated.engine ?? null, updated.drivetrain ?? null, updated.soldById ?? null, updated.saleDate ?? null, updated.buyerName ?? null, id
        ]
      );
      
      console.log('--- VEHICLE UPDATED SUCCESSFULLY ---', id);
      const [finalRows] = await db.execute('SELECT * FROM vehicles WHERE id = ?', [id]);
      const final = (finalRows as any[])[0];
      res.json({
        ...final,
        images: JSON.parse(final.images || '[]'),
        features: JSON.parse(final.features || '{}'),
        accessories: JSON.parse(final.accessories || '[]'),
        isDischarged: final.isDischarged === 1
      });
    } catch (error) {
      console.error('--- ERROR UPDATING VEHICLE ---', error);
      res.status(500).json({ error: 'Failed to update vehicle' });
    }
  });

  app.delete('/api/vehicles/:id', async (req, res) => {
    const { id } = req.params;
    await db.execute('DELETE FROM vehicles WHERE id = ?', [id]);
    res.status(204).send();
  });

  // --- MESSAGES API ---
  app.get('/api/messages', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM messages ORDER BY createdAt DESC');
    res.json(rows);
  });

  app.post('/api/messages', async (req, res) => {
    const m = req.body;
    console.log('--- ATTEMPTING TO SAVE MESSAGE ---', m.email);
    const id = `msg-${Math.random().toString(36).substr(2, 9)}`;
    const createdAt = new Date().toISOString();
    const status = 'New';
    try {
      await db.execute(
        `INSERT INTO messages (id, fullName, email, subject, message, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, m.fullName ?? null, m.email ?? null, m.subject ?? null, m.message ?? null, status, createdAt]
      );
      console.log('--- MESSAGE SAVED SUCCESSFULLY ---', id);
      const [savedRows] = await db.execute('SELECT * FROM messages WHERE id = ?', [id]);
      res.status(201).json((savedRows as any[])[0]);
    } catch (error) {
      console.error('--- ERROR SAVING MESSAGE ---', error);
      res.status(500).json({ error: 'Failed to save message' });
    }
  });

  app.put('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    const m = req.body;
    const [currentRows] = await db.execute('SELECT * FROM messages WHERE id = ?', [id]);
    const current = (currentRows as any[])[0];
    if (!current) return res.status(404).json({ error: 'Message not found' });
    const updated = { ...current, ...m };
    await db.execute(
      `UPDATE messages SET fullName = ?, email = ?, subject = ?, message = ?, status = ? WHERE id = ?`,
      [updated.fullName ?? null, updated.email ?? null, updated.subject ?? null, updated.message ?? null, updated.status ?? null, id]
    );
    const [finalRows] = await db.execute('SELECT * FROM messages WHERE id = ?', [id]);
    res.json((finalRows as any[])[0]);
  });

  app.delete('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    await db.execute('DELETE FROM messages WHERE id = ?', [id]);
    res.status(204).send();
  });

  // --- INVOICES API ---
  app.get('/api/invoices', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM invoices ORDER BY date DESC');
    const result = (rows as any[]).map(inv => ({
      ...inv,
      items: JSON.parse(inv.items || '[]')
    }));
    res.json(result);
  });

  app.post('/api/invoices', async (req, res) => {
    const inv = req.body;
    const id = inv.id || `inv-${Math.random().toString(36).substr(2, 9)}`;
    await db.execute(
      `INSERT INTO invoices (id, date, dueDate, customerId, customerName, amount, taxAmount, status, items, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, inv.date ?? null, inv.dueDate ?? null, inv.customerId ?? null, inv.customerName ?? null, inv.amount ?? null, inv.taxAmount ?? null, inv.status ?? null, JSON.stringify(inv.items || []), inv.notes ?? null]
    );
    const [savedRows] = await db.execute('SELECT * FROM invoices WHERE id = ?', [id]);
    const saved = (savedRows as any[])[0];
    res.status(201).json({
      ...saved,
      items: JSON.parse(saved.items || '[]')
    });
  });

  app.put('/api/invoices/:id', async (req, res) => {
    const { id } = req.params;
    const inv = req.body;
    const [currentRows] = await db.execute('SELECT * FROM invoices WHERE id = ?', [id]);
    const current = (currentRows as any[])[0];
    if (!current) return res.status(404).json({ error: 'Invoice not found' });
    const updated = { ...current, ...inv };
    await db.execute(
      `UPDATE invoices SET date = ?, dueDate = ?, customerId = ?, customerName = ?, amount = ?, taxAmount = ?, status = ?, items = ?, notes = ? WHERE id = ?`,
      [updated.date ?? null, updated.dueDate ?? null, updated.customerId ?? null, updated.customerName ?? null, updated.amount ?? null, updated.taxAmount ?? null, updated.status ?? null, typeof updated.items === 'string' ? updated.items : JSON.stringify(updated.items || []), updated.notes ?? null, id]
    );
    const [finalRows] = await db.execute('SELECT * FROM invoices WHERE id = ?', [id]);
    const final = (finalRows as any[])[0];
    res.json({
      ...final,
      items: JSON.parse(final.items || '[]')
    });
  });

  // --- BILLS API ---
  app.get('/api/bills', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM bills ORDER BY postingDate DESC');
    res.json(rows);
  });

  app.post('/api/bills', async (req, res) => {
    const b = req.body;
    const id = b.id || `bill-${Math.random().toString(36).substr(2, 9)}`;
    await db.execute(
      `INSERT INTO bills (id, billNumber, postingDate, invoiceDate, systemEntryDate, dueDate, vendorName, vendorType, amount, taxAmount, status, category, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, b.billNumber ?? null, b.postingDate ?? null, b.invoiceDate ?? null, b.systemEntryDate ?? null, b.dueDate ?? null, b.vendorName ?? null, b.vendorType ?? null, b.amount ?? null, b.taxAmount ?? null, b.status ?? null, b.category ?? null, b.notes ?? null]
    );
    const [savedRows] = await db.execute('SELECT * FROM bills WHERE id = ?', [id]);
    res.status(201).json((savedRows as any[])[0]);
  });

  app.put('/api/bills/:id', async (req, res) => {
    const { id } = req.params;
    const b = req.body;
    const [currentRows] = await db.execute('SELECT * FROM bills WHERE id = ?', [id]);
    const current = (currentRows as any[])[0];
    if (!current) return res.status(404).json({ error: 'Bill not found' });
    const updated = { ...current, ...b };
    await db.execute(
      `UPDATE bills SET billNumber = ?, postingDate = ?, invoiceDate = ?, systemEntryDate = ?, dueDate = ?, vendorName = ?, vendorType = ?, amount = ?, taxAmount = ?, status = ?, category = ?, notes = ? WHERE id = ?`,
      [updated.billNumber ?? null, updated.postingDate ?? null, updated.invoiceDate ?? null, updated.systemEntryDate ?? null, updated.dueDate ?? null, updated.vendorName ?? null, updated.vendorType ?? null, updated.amount ?? null, updated.taxAmount ?? null, updated.status ?? null, updated.category ?? null, updated.notes ?? null, id]
    );
    const [finalRows] = await db.execute('SELECT * FROM bills WHERE id = ?', [id]);
    res.json((finalRows as any[])[0]);
  });

  // --- TRANSACTIONS API ---
  app.get('/api/transactions', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM transactions ORDER BY postingDate DESC');
    res.json(rows);
  });

  app.post('/api/transactions', async (req, res) => {
    const t = req.body;
    const id = t.id || `tx-${Math.random().toString(36).substr(2, 9)}`;
    await db.execute(
      `INSERT INTO transactions (id, postingDate, invoiceDate, systemEntryDate, type, category, amount, taxAmount, description, locationId, accountCode, periodId, referenceId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, t.postingDate ?? null, t.invoiceDate ?? null, t.systemEntryDate ?? null, t.type ?? null, t.category ?? null, t.amount ?? null, t.taxAmount ?? null, t.description ?? null, t.locationId ?? null, t.accountCode ?? null, t.periodId ?? null, t.referenceId ?? null]
    );
    const [savedRows] = await db.execute('SELECT * FROM transactions WHERE id = ?', [id]);
    res.status(201).json((savedRows as any[])[0]);
  });

  // --- ENTITIES API ---
  app.get('/api/entities', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM entities');
    res.json(rows);
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.APP_MODE !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('--- PRODUCTION MODE: Serving static files from dist/ ---');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
