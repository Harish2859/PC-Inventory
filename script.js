let allComponents = []; 
let selectedComponentIds = []; 
let totalBuildCost = 0;
let totalBuildWattage = 0;
const WATTAGE_LIMIT = 600;

// 1. Load data
async function getComponents() {
    try {
        const response = await fetch('http://localhost:5000/api/components');
        allComponents = await response.json();
        renderCards(allComponents); 
    } catch (err) {
        console.error("Error loading components:", err);
    }
}

// 2. Render UI
function renderCards(data) {
    const grid = document.getElementById('component-grid');
    grid.innerHTML = ''; 

    if (data.length === 0) {
        grid.innerHTML = '<p class="loading-text">No components found.</p>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'component-card';
        card.setAttribute('data-id', `#${item.component_id}`);
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p><strong>Brand</strong> ${item.brand}</p>
            <p><strong>Price</strong> ₹${item.price}</p>
            <p><strong>Wattage</strong> ${item.wattage}W</p>
            <div class="stock-tag ${item.stock_qty < 5 ? 'low-stock' : ''}">
                Stock: ${item.stock_qty}
            </div>
            <div class="card-actions">
                <button class="select-btn" onclick="addToBuild(${item.component_id}, '${item.name}', ${item.price}, ${item.wattage})">
                    + Select for Build
                </button>
                <button class="delete-btn" onclick="deleteComponent(${item.component_id})">🗑️</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 3. Calculator Logic
function addToBuild(id, name, price, wattage) {
    const component = allComponents.find(item => item.component_id === id);

    if (component && component.stock_qty > 0) {
        component.stock_qty -= 1; 
        selectedComponentIds.push(id);
        totalBuildCost += parseFloat(price);
        totalBuildWattage += parseInt(wattage);

        renderCards(allComponents); 
        updateBuildSummary();
    } else {
        alert("Out of stock!");
    }
}

function updateBuildSummary() {
    const costText = document.getElementById('total-cost');
    const wattageText = document.getElementById('total-wattage');
    const buildCount = document.getElementById('build-count');

    costText.innerText = `₹${totalBuildCost.toFixed(2)}`;
    wattageText.innerText = `${totalBuildWattage}W`;

    // Over-limit visual feedback (new CSS class, no logic change)
    if (totalBuildWattage > WATTAGE_LIMIT) {
        wattageText.classList.add('over-limit');
    } else {
        wattageText.classList.remove('over-limit');
    }

    // Update header stat chip
    if (buildCount) {
        buildCount.textContent = `${selectedComponentIds.length} PART${selectedComponentIds.length !== 1 ? 'S' : ''}`;
    }
}

// 4. Finalize (Send to Database)
async function finalizeBuild() {
    if (selectedComponentIds.length === 0) return alert("Select parts first!");

    try {
        const response = await fetch('http://localhost:5000/api/build/finalize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedComponentIds })
        });

        if (response.ok) {
            alert("Build complete! Stock updated in database.");
            location.reload();
        }
    } catch (err) {
        console.error("Build failed:", err);
    }
}

// 5. Search Logic
document.getElementById('search-bar').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allComponents.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.brand.toLowerCase().includes(searchTerm)
    );
    renderCards(filtered);
});

// 6. Form Submission
document.getElementById('part-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPart = {
        name: document.getElementById('name').value,
        brand: document.getElementById('brand').value,
        price: document.getElementById('price').value,
        wattage: document.getElementById('wattage').value || 0,
        stock: document.getElementById('stock').value
    };

    const response = await fetch('http://localhost:5000/api/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPart)
    });

    if (response.ok) {
        getComponents();
        e.target.reset();
    }
});

// 7. Delete
async function deleteComponent(id) {
    if (confirm("Permanently remove this item?")) {
        await fetch(`http://localhost:5000/api/components/${id}`, { method: 'DELETE' });
        getComponents();
    }
}

getComponents();