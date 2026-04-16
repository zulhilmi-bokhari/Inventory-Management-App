const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let inventory = [
  { id: 1, name: 'Item A', quantity: 10, price: 5.0 },
  { id: 2, name: 'Item B', quantity: 5, price: 10.0 }
];
let nextId = 3;

// GET all items
app.get('/api/items', (req, res) => {
  res.json(inventory);
});

// POST a new item
app.post('/api/items', (req, res) => {
  const { name, quantity, price } = req.body;
  if (!name || quantity === undefined) {
    return res.status(400).json({ error: 'Name and quantity are required' });
  }
  const newItem = {
    id: nextId++,
    name,
    quantity: parseInt(quantity),
    price: price ? parseFloat(price) : 0
  };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

// PUT (update) an item
app.put('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, quantity, price } = req.body;
  const itemIndex = inventory.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  const updatedItem = {
    ...inventory[itemIndex],
    name: name || inventory[itemIndex].name,
    quantity: quantity !== undefined ? parseInt(quantity) : inventory[itemIndex].quantity,
    price: price !== undefined ? parseFloat(price) : inventory[itemIndex].price
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
