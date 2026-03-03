import express from 'express';
import { createServer as createViteServer } from 'vite';
import 'dotenv/config';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  console.log('--- CONNECTED TO SUPABASE ---');

  // --- AUTH API ---
  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        res.json(data);
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
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role,
          location
        }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: 'Email already exists' });
        }
        throw error;
      }

      res.status(201).json(data);
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // --- VEHICLE API ---
  app.get('/api/vehicles', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*');

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Get vehicles error:', error);
      res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
  });

  app.post('/api/vehicles', async (req, res) => {
    const v = req.body;
    const id = v.id || `v-${Math.random().toString(36).substr(2, 9)}`;

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          id,
          vin: v.vin,
          year: v.year,
          make: v.make,
          model: v.model,
          trim: v.trim,
          price: v.price,
          km: v.km,
          fuel_type: v.fuelType,
          body_style: v.bodyStyle,
          status: v.status,
          location: v.location,
          images: v.images || [],
          description: v.description,
          carfax_url: v.carfaxUrl,
          features: v.features || {},
          ready_to_sale_date: v.readyToSaleDate,
          post_date: v.postDate,
          inventory_image: v.inventoryImage,
          contract_url: v.contractUrl,
          discharge_url: v.dischargeUrl,
          is_discharged: v.isDischarged || false,
          accessories: v.accessories || [],
          transmission: v.transmission,
          engine: v.engine,
          drivetrain: v.drivetrain,
          sold_by_id: v.soldById,
          sale_date: v.saleDate,
          buyer_name: v.buyerName,
          color: v.color,
          ribbon: v.ribbon,
          is_carfax_one_owner: v.isCarfaxOneOwner
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Create vehicle error:', error);
      res.status(500).json({ error: 'Failed to create vehicle' });
    }
  });

  app.put('/api/vehicles/:id', async (req, res) => {
    const { id } = req.params;
    const v = req.body;

    try {
      const updateData: any = {};
      if (v.vin !== undefined) updateData.vin = v.vin;
      if (v.year !== undefined) updateData.year = v.year;
      if (v.make !== undefined) updateData.make = v.make;
      if (v.model !== undefined) updateData.model = v.model;
      if (v.trim !== undefined) updateData.trim = v.trim;
      if (v.price !== undefined) updateData.price = v.price;
      if (v.km !== undefined) updateData.km = v.km;
      if (v.fuelType !== undefined) updateData.fuel_type = v.fuelType;
      if (v.bodyStyle !== undefined) updateData.body_style = v.bodyStyle;
      if (v.status !== undefined) updateData.status = v.status;
      if (v.location !== undefined) updateData.location = v.location;
      if (v.images !== undefined) updateData.images = v.images;
      if (v.description !== undefined) updateData.description = v.description;
      if (v.carfaxUrl !== undefined) updateData.carfax_url = v.carfaxUrl;
      if (v.features !== undefined) updateData.features = v.features;
      if (v.readyToSaleDate !== undefined) updateData.ready_to_sale_date = v.readyToSaleDate;
      if (v.postDate !== undefined) updateData.post_date = v.postDate;
      if (v.inventoryImage !== undefined) updateData.inventory_image = v.inventoryImage;
      if (v.contractUrl !== undefined) updateData.contract_url = v.contractUrl;
      if (v.dischargeUrl !== undefined) updateData.discharge_url = v.dischargeUrl;
      if (v.isDischarged !== undefined) updateData.is_discharged = v.isDischarged;
      if (v.accessories !== undefined) updateData.accessories = v.accessories;
      if (v.transmission !== undefined) updateData.transmission = v.transmission;
      if (v.engine !== undefined) updateData.engine = v.engine;
      if (v.drivetrain !== undefined) updateData.drivetrain = v.drivetrain;
      if (v.soldById !== undefined) updateData.sold_by_id = v.soldById;
      if (v.saleDate !== undefined) updateData.sale_date = v.saleDate;
      if (v.buyerName !== undefined) updateData.buyer_name = v.buyerName;
      if (v.color !== undefined) updateData.color = v.color;
      if (v.ribbon !== undefined) updateData.ribbon = v.ribbon;
      if (v.isCarfaxOneOwner !== undefined) updateData.is_carfax_one_owner = v.isCarfaxOneOwner;

      const { data, error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Update vehicle error:', error);
      res.status(500).json({ error: 'Failed to update vehicle' });
    }
  });

  app.delete('/api/vehicles/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      console.error('Delete vehicle error:', error);
      res.status(500).json({ error: 'Failed to delete vehicle' });
    }
  });

  // --- MESSAGES API ---
  app.get('/api/messages', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Get messages error:', error);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

  app.post('/api/messages', async (req, res) => {
    const m = req.body;
    const id = `msg-${Math.random().toString(36).substr(2, 9)}`;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          id,
          full_name: m.fullName,
          email: m.email,
          subject: m.subject,
          message: m.message,
          status: 'New'
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Create message error:', error);
      res.status(500).json({ error: 'Failed to create message' });
    }
  });

  app.put('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    const m = req.body;

    try {
      const updateData: any = {};
      if (m.fullName !== undefined) updateData.full_name = m.fullName;
      if (m.email !== undefined) updateData.email = m.email;
      if (m.subject !== undefined) updateData.subject = m.subject;
      if (m.message !== undefined) updateData.message = m.message;
      if (m.status !== undefined) updateData.status = m.status;

      const { data, error } = await supabase
        .from('messages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Update message error:', error);
      res.status(500).json({ error: 'Failed to update message' });
    }
  });

  app.delete('/api/messages/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.status(204).send();
    } catch (error) {
      console.error('Delete message error:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  });

  // --- INVOICES API ---
  app.get('/api/invoices', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Get invoices error:', error);
      res.status(500).json({ error: 'Failed to fetch invoices' });
    }
  });

  app.post('/api/invoices', async (req, res) => {
    const inv = req.body;
    const id = inv.id || `inv-${Math.random().toString(36).substr(2, 9)}`;

    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert([{
          id,
          date: inv.date,
          due_date: inv.dueDate,
          customer_id: inv.customerId,
          customer_name: inv.customerName,
          amount: inv.amount,
          tax_amount: inv.taxAmount,
          status: inv.status,
          items: inv.items || [],
          notes: inv.notes
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Create invoice error:', error);
      res.status(500).json({ error: 'Failed to create invoice' });
    }
  });

  app.put('/api/invoices/:id', async (req, res) => {
    const { id } = req.params;
    const inv = req.body;

    try {
      const updateData: any = {};
      if (inv.date !== undefined) updateData.date = inv.date;
      if (inv.dueDate !== undefined) updateData.due_date = inv.dueDate;
      if (inv.customerId !== undefined) updateData.customer_id = inv.customerId;
      if (inv.customerName !== undefined) updateData.customer_name = inv.customerName;
      if (inv.amount !== undefined) updateData.amount = inv.amount;
      if (inv.taxAmount !== undefined) updateData.tax_amount = inv.taxAmount;
      if (inv.status !== undefined) updateData.status = inv.status;
      if (inv.items !== undefined) updateData.items = inv.items;
      if (inv.notes !== undefined) updateData.notes = inv.notes;

      const { data, error } = await supabase
        .from('invoices')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Update invoice error:', error);
      res.status(500).json({ error: 'Failed to update invoice' });
    }
  });

  // --- BILLS API ---
  app.get('/api/bills', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('bills')
        .select('*')
        .order('posting_date', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Get bills error:', error);
      res.status(500).json({ error: 'Failed to fetch bills' });
    }
  });

  app.post('/api/bills', async (req, res) => {
    const b = req.body;
    const id = b.id || `bill-${Math.random().toString(36).substr(2, 9)}`;

    try {
      const { data, error } = await supabase
        .from('bills')
        .insert([{
          id,
          bill_number: b.billNumber,
          posting_date: b.postingDate,
          invoice_date: b.invoiceDate,
          system_entry_date: b.systemEntryDate,
          due_date: b.dueDate,
          vendor_name: b.vendorName,
          vendor_type: b.vendorType,
          amount: b.amount,
          tax_amount: b.taxAmount,
          status: b.status,
          category: b.category,
          notes: b.notes
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Create bill error:', error);
      res.status(500).json({ error: 'Failed to create bill' });
    }
  });

  app.put('/api/bills/:id', async (req, res) => {
    const { id } = req.params;
    const b = req.body;

    try {
      const updateData: any = {};
      if (b.billNumber !== undefined) updateData.bill_number = b.billNumber;
      if (b.postingDate !== undefined) updateData.posting_date = b.postingDate;
      if (b.invoiceDate !== undefined) updateData.invoice_date = b.invoiceDate;
      if (b.systemEntryDate !== undefined) updateData.system_entry_date = b.systemEntryDate;
      if (b.dueDate !== undefined) updateData.due_date = b.dueDate;
      if (b.vendorName !== undefined) updateData.vendor_name = b.vendorName;
      if (b.vendorType !== undefined) updateData.vendor_type = b.vendorType;
      if (b.amount !== undefined) updateData.amount = b.amount;
      if (b.taxAmount !== undefined) updateData.tax_amount = b.taxAmount;
      if (b.status !== undefined) updateData.status = b.status;
      if (b.category !== undefined) updateData.category = b.category;
      if (b.notes !== undefined) updateData.notes = b.notes;

      const { data, error } = await supabase
        .from('bills')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error('Update bill error:', error);
      res.status(500).json({ error: 'Failed to update bill' });
    }
  });

  // --- TRANSACTIONS API ---
  app.get('/api/transactions', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('posting_date', { ascending: false });

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Get transactions error:', error);
      res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  });

  app.post('/api/transactions', async (req, res) => {
    const t = req.body;
    const id = t.id || `tx-${Math.random().toString(36).substr(2, 9)}`;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          id,
          posting_date: t.postingDate,
          invoice_date: t.invoiceDate,
          system_entry_date: t.systemEntryDate,
          type: t.type,
          category: t.category,
          amount: t.amount,
          tax_amount: t.taxAmount,
          description: t.description,
          location_id: t.locationId,
          account_code: t.accountCode,
          period_id: t.periodId,
          reference_id: t.referenceId
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(201).json(data);
    } catch (error) {
      console.error('Create transaction error:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  });

  // --- ENTITIES API ---
  app.get('/api/entities', async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('entities')
        .select('*');

      if (error) throw error;
      res.json(data || []);
    } catch (error) {
      console.error('Get entities error:', error);
      res.status(500).json({ error: 'Failed to fetch entities' });
    }
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
