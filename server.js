const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Hardcoded users for basic login
const users = [
  { username: 'admin', password: 'password', name: 'System Admin' },
  { username: 'alice', password: 'password123', name: 'Alice' },
  { username: 'bob', password: 'password456', name: 'Bob' }
];

let inventory = [
  { id: 1, name: 'Item A', quantity: 10, sku: 'SKU-001', personInCharge: 'Alice' },
  { id: 2, name: 'Item B', quantity: 5, sku: 'SKU-002', personInCharge: 'Bob' }
];
let replenishments = [];
let nextId = 3;

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

// GET all items
app.get('/api/items', (req, res) => {
  res.json(inventory);
});

// POST a new item
app.post('/api/items', (req, res) => {
  const { name, quantity, sku, personInCharge } = req.body;
  if (!name || quantity === undefined || !sku) {
    return res.status(400).json({ error: 'Name, quantity, and SKU are required' });
  }
  const newItem = {
    id: nextId++,
    name,
    quantity: parseInt(quantity),
    sku,
    personInCharge: personInCharge || 'Unassigned'
  };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

// PUT (update) an item
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, quantity, sku, personInCharge } = req.body;
  const itemIndex = inventory.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  const updatedItem = {
    ...inventory[itemIndex],
    name: name || inventory[itemIndex].name,
    quantity: quantity !== undefined ? parseInt(quantity) : inventory[itemIndex].quantity,
    sku: sku || inventory[itemIndex].sku,
    personInCharge: personInCharge || inventory[itemIndex].personInCharge
  };
  inventory[itemIndex] = updatedItem;
  res.json(updatedItem);
});

// DELETE an item
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = inventory.length;
  inventory = inventory.filter(item => item.id !== id);
  if (inventory.length === initialLength) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(204).send();
});

// POST replenish stock
app.post('/api/items/:id/replenish', (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity, person } = req.body;
  const itemIndex = inventory.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  if (!quantity || !person) {
    return res.status(400).json({ error: 'Quantity and person are required' });
  }

  const addedQty = parseInt(quantity);
  inventory[itemIndex].quantity += addedQty;

  const logEntry = {
    itemId: id,
    itemName: inventory[itemIndex].name,
    quantity: addedQty,
    person,
    date: new Date().toISOString()
  };
  replenishments.push(logEntry);

  res.json({ item: inventory[itemIndex], log: logEntry });
});

// GET replenishment summary
app.get('/api/replenishment-summary', (req, res) => {
  const summary = replenishments.reduce((acc, curr) => {
    const date = new Date(curr.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const key = `${monthYear}_${curr.person}`;

    if (!acc[key]) {
      acc[key] = {
        month: monthYear,
        person: curr.person,
        totalQuantity: 0,
        items: new Set()
      };
    }
    acc[key].totalQuantity += curr.quantity;
    acc[key].items.add(curr.itemName);
    return acc;
  }, {});

  const result = Object.values(summary).map(s => ({
    ...s,
    items: Array.from(s.items).join(', ')
  }));

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
