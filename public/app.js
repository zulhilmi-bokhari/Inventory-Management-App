const itemForm = document.getElementById('item-form');
const inventoryTbody = document.getElementById('inventory-tbody');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

let items = [];

// Fetch and display items
async function fetchItems() {
    const response = await fetch('/api/items');
    items = await response.json();
    renderItems();
}

function renderItems() {
    inventoryTbody.innerHTML = '';
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button class="edit-btn" onclick="editItem(${item.id})">Edit</button>
                <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        inventoryTbody.appendChild(tr);
    });
}

// Add or Update item
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('item-id').value;
    const name = document.getElementById('name').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;

    const itemData = { name, quantity, price };

    if (id) {
        // Update
        await fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });
    } else {
        // Create
        await fetch('/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData)
        });
    }

    resetForm();
    fetchItems();
});

function editItem(id) {
    const item = items.find(i => i.id === id);
    if (item) {
        document.getElementById('item-id').value = item.id;
        document.getElementById('name').value = item.name;
        document.getElementById('quantity').value = item.quantity;
        document.getElementById('price').value = item.price;

        formTitle.innerText = 'Edit Item';
        submitBtn.innerText = 'Update Item';
        cancelBtn.style.display = 'inline-block';
    }
}

async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        await fetch(`/api/items/${id}`, { method: 'DELETE' });
        fetchItems();
    }
}

cancelBtn.addEventListener('click', () => {
    resetForm();
});

function resetForm() {
    itemForm.reset();
    document.getElementById('item-id').value = '';
    formTitle.innerText = 'Add New Item';
    submitBtn.innerText = 'Add Item';
    cancelBtn.style.display = 'none';
}

// Initial fetch
fetchItems();
