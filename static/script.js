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
    
    const img = document.createElement('img');
    img.src = item.images.length > 0 ? item.images[0].url : 'https://via.placeholder.com/150';
    img.alt = item.name;
    
    const name = document.createElement('div');
    name.classList.add('name');
    name.textContent = item.name;
    
    card.appendChild(img);
    card.appendChild(name);
    
    // Add drag event listeners
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
    e.dataTransfer.setData('text/plain', e.target.outerHTML);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const dropzone = e.target.closest('.tier, .temp-space') || e.target;
    if (dropzone.classList.contains('tier') || dropzone.classList.contains('temp-space')) {
        dropzone.innerHTML += data;
    }
}

// Toggle name display
function toggleNames() {
    const showNames = document.getElementById('show-names').checked;
    document.querySelectorAll('.item-card .name').forEach(name => {
        name.style.display = showNames ? 'block' : 'none';
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const tempSpace = document.getElementById('temp-space');
    const tierList = document.getElementById('tier-list');
    const showNamesCheckbox = document.getElementById('show-names');
    
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    tempSpace.addEventListener('dragover', dragOver);
    tempSpace.addEventListener('drop', drop);
    
    tierList.addEventListener('dragover', dragOver);
    tierList.addEventListener('drop', drop);
    
    showNamesCheckbox.addEventListener('change', toggleNames);
});