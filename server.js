const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let inventory = [
  { id: 1, name: 'Item A', quantity: 10, price: 5.0, personInCharge: 'Alice' },
  { id: 2, name: 'Item B', quantity: 5, price: 10.0, personInCharge: 'Bob' }
];
let replenishments = [];
let nextId = 3;

// GET all items
app.get('/api/items', (req, res) => {
  res.json(inventory);
});

// POST a new item
app.post('/api/items', (req, res) => {
  const { name, quantity, price, personInCharge } = req.body;
  if (!name || quantity === undefined) {
    return res.status(400).json({ error: 'Name and quantity are required' });
  }
  const newItem = {
    id: nextId++,
    name,
    quantity: parseInt(quantity),
    price: price ? parseFloat(price) : 0,
    personInCharge: personInCharge || 'Unassigned'
  };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

// PUT (update) an item
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, quantity, price, personInCharge } = req.body;
  const itemIndex = inventory.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  const updatedItem = {
    ...inventory[itemIndex],
    name: name || inventory[itemIndex].name,
    quantity: quantity !== undefined ? parseInt(quantity) : inventory[itemIndex].quantity,
    price: price !== undefined ? parseFloat(price) : inventory[itemIndex].price,
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
