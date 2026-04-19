const summaryTbody = document.getElementById('summary-tbody');

async function fetchSummary() {
    try {
        const response = await fetch('/api/replenishment-summary');
        const data = await response.json();
        renderSummary(data);
    } catch (error) {
        console.error('Error fetching summary:', error);
    }
}

function renderSummary(data) {
    summaryTbody.innerHTML = '';
    if (data.length === 0) {
        summaryTbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No replenishment logs found.</td></tr>';
        return;
    }

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.month}</td>
            <td>${row.person}</td>
            <td>${row.totalQuantity}</td>
            <td>${row.items}</td>
        `;
        summaryTbody.appendChild(tr);
    });
}

fetchSummary();
