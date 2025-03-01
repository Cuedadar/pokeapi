//
// Place any custom JS here
//
async function searchPokemon(searchTerm) {
    try {
        let result = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
        if(!result.ok) {
            let err = new Error(result.statusText);
            err.code = result.status;
            throw err;
        }
        let data = await result.json();
        updateResults(data);
    } catch (error) {
        showError(error)
    }
}

function updateResults(data) {
    let mainElement = document.getElementById('main');

    //Handle multiple types
    let typeString = "";
    data.types.map(type => typeString += `${type.type.name} `);
    typeString = typeString.trim();

    //Handle appears in
    let appearsInString = "";
    data.game_indices.map(game => appearsInString += `<li>${game.version.name}</li>`);

    mainElement.innerHTML = `
        <div class="d-flex">
            <img src="${data.sprites.front_default}" alt="Pokemon Sprite">
            <div class="d-flex flex-column justify-content-center align-items-center">
                <h2 class="capitalized">${data.name}</h2>
                <p class="capitalized my-1">${typeString}</p>
            </div>
        </div>
        <div class="d-flex mt-2">
            <div class="col d-flex flex-column">
                <h2>Appears In</h2>
                <ul class="capitalized list-unstyled centered-text">${appearsInString}</ul>
            </div>
        </div>
        
    `;
}

function showError(error) {
    console.log(error);
    let mainElement = document.getElementById('main');

    if (error.code === 404) {
        mainElement.innerHTML = `
        <div class="col d-flex mx-auto">
            <h2 class="mx-0">Pokemon Not Found</h2>
        </div>
        
    `;
    } else {
        mainElement.innerHTML = `
        <div class="col d-flex mx-auto">
            <h2 class="mx-0">Server Error</h2>
        </div>
        
    `;
    }
}

// Handle search term on form submission (could theoretically use button click event
//  if search was not a form
const form = document.getElementById('searchForm');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    let formData = new FormData(form);
    searchPokemon(formData.get('searchTerm'));
});