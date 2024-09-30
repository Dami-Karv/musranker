// Determine the search type based on the page
const searchType = document.title.includes('Artists') ? 'artist' : 'album';

// Search function
async function search(query) {
    try {
        console.log(`Searching for ${searchType}s with query: ${query}`);
        const response = await fetch(`/search?q=${encodeURIComponent(query)}&type=${searchType}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Search results:', data);
        return data[`${searchType}s`].items;
    } catch (error) {
        console.error(`Error searching for ${searchType}s:`, error);
        throw error;
    }
}

// Display search results
function displayResults(items) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    
    if (items.length === 0) {
        resultsContainer.innerHTML = `<p>No ${searchType}s found.</p>`;
        return;
    }
    
    items.forEach(item => {
        const card = createItemCard(item);
        resultsContainer.appendChild(card);
    });
}

// Create item card
function createItemCard(item) {
    const card = document.createElement('div');
    card.classList.add('item-card');
    card.draggable = true;
    card.dataset.id = item.id; // Store the item's unique ID
    
    const img = document.createElement('img');
    img.src = item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/100';
    img.alt = item.name;
    
    const name = document.createElement('div');
    name.classList.add('name');
    name.textContent = item.name;
    
    card.appendChild(img);
    card.appendChild(name);
    
    card.addEventListener('dragstart', dragStart);
    
    return card;
}

// Handle search
async function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        try {
            const items = await search(query);
            displayResults(items);
        } catch (error) {
            console.error('Error handling search:', error);
            document.getElementById('results').innerHTML = `<p>An error occurred while searching. Please try again later.</p>`;
        }
    }
}

// Drag and drop functionality
function dragStart(e) {
    const showNames = document.getElementById('show-names').checked;
    const card = e.target.closest('.item-card');
    if (card) {
        e.dataTransfer.setData('text/plain', card.dataset.id);
        e.dataTransfer.setData('application/json', JSON.stringify({
            id: card.dataset.id,
            html: card.outerHTML,
            showNames: showNames
        }));
    }
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    const dropzone = e.target.closest('.tier-content, .temp-space') || e.target;
    
    if (dropzone.classList.contains('tier-content') || dropzone.classList.contains('temp-space')) {
        // Check if the item already exists in the tier list or temporary space
        const existingCard = document.querySelector(`.tier-list-container .item-card[data-id="${data.id}"], #temp-space .item-card[data-id="${data.id}"]`);
        
        if (!existingCard) {
            const newCard = createElementFromHTML(data.html);
            newCard.style.width = '100px';
            newCard.style.height = '100px';
            const img = newCard.querySelector('img');
            if (img) {
                img.style.width = '100%';
                img.style.height = '100%';
            }
            newCard.querySelector('.name').style.display = data.showNames ? 'block' : 'none';
            dropzone.appendChild(newCard);
            newCard.addEventListener('dragstart', dragStart);
        }
        // If the card already exists, we simply do nothing (silently discard the drop)
    }
}

function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

// Toggle name display
function toggleNames() {
    const showNames = document.getElementById('show-names').checked;
    document.querySelectorAll('.item-card .name').forEach(name => {
        name.style.display = showNames ? 'block' : 'none';
    });
}

function saveTierListAsPNG() {
    const tierList = document.querySelector('.tier-list-container');
    
    // Temporarily show all names
    const showNames = document.getElementById('show-names').checked;
    document.querySelectorAll('.item-card .name').forEach(name => {
        name.style.display = 'block';
    });
    
    html2canvas(tierList, {
        allowTaint: true,
        useCORS: true,
        scale: 2 // Increase resolution
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'tier-list.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Restore original name display setting
        if (!showNames) {
            document.querySelectorAll('.item-card .name').forEach(name => {
                name.style.display = 'none';
            });
        }
    });
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const tempSpace = document.getElementById('temp-space');
    const tierList = document.getElementById('tier-list');
    const showNamesCheckbox = document.getElementById('show-names');
    const savePNGButton = document.getElementById('save-png');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    tempSpace.addEventListener('dragover', dragOver);
    tempSpace.addEventListener('drop', drop);
    
    tierList.querySelectorAll('.tier-content').forEach(tier => {
        tier.addEventListener('dragover', dragOver);
        tier.addEventListener('drop', drop);
    });
    
    showNamesCheckbox.addEventListener('change', toggleNames);
    savePNGButton.addEventListener('click', saveTierListAsPNG);
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});