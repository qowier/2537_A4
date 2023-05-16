const PAGE_SIZE = 12;
let currentPage = 1;
let pokemons = []

const updatePaginationDiv = (currentPage, numPages) => {
  $('#pagination').empty();

  let startPage, endPage;
  if (numPages <= 5) {
    startPage = 1;
    endPage = numPages;
  } else {
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= numPages) {
      startPage = numPages - 4;
      endPage = numPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    let buttonClass = i === currentPage ? 'btn-primary active' : 'btn-secondary';
    $('#pagination').append(`
      <button class="btn page ml-1 numberedButtons ${buttonClass}" value="${i}">${i}</button>
    `);
  }

  // Add previous button
  if (currentPage > 1) {
    $('#pagination').prepend(`
      <button class="btn btn-primary page ml-1 numberedButtons" value="${currentPage - 1}">&lt; Previous</button>
    `);
  }

  // Add next button
  if (currentPage < numPages) {
    $('#pagination').append(`
      <button class="btn btn-primary page ml-1 numberedButtons" value="${currentPage + 1}">Next &gt;</button>
    `);
  }

  // Hide previous button if on the first page
  if (currentPage === 1) {
    $('#pagination button:contains("Previous")').hide();
  }

  // Hide next button if on the last page
  if (currentPage === numPages) {
    $('#pagination button:contains("Next")').hide();
  }
};

const fetchPokemonTypes = async () => {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/type');
    const types = response.data.results;

    $('#pokeTypesFilter').empty();
    const checkboxes = types.map((type) => {
      return `
        <div class="form-check form-check-inline">
          <input class="form-check-input pokeTypeCheckbox" type="checkbox" value="${type.name}" id="${type.name}">
          <label class="form-check-label" for="${type.name}">
            ${type.name}
          </label>
        </div>
      `;
    });
    $('#pokeTypesFilter').html(checkboxes.join(''));
  } catch (error) {
    console.error('Error fetching Pokémon types:', error);
  }
};

const paginate = async (currentPage, PAGE_SIZE, pokemons) => {
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const endIdx = currentPage * PAGE_SIZE;
  const selectedPokemons = pokemons.slice(startIdx, endIdx);

  $('#pokeCards').empty();
  selectedPokemons.forEach(async (pokemon) => {
    const res = await axios.get(pokemon.url);
    $('#pokeCards').append(`
      <div class="pokeCard card" pokeName=${res.data.name}>
        <h3>${res.data.name.toUpperCase()}</h3> 
        <img src="${res.data.sprites.front_default}" alt="${res.data.name}"/>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokeModal">
          More
        </button>
      </div>  
    `);
  });

  const totalPokemons = pokemons.length;
  const showingPokemons = selectedPokemons.length;
  $('#pokemonCount').text(`Showing ${showingPokemons} of ${totalPokemons} pokemons`);
};


const setup = async () => {
  // test out poke api using axios here


  $('#pokeCards').empty()
  let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
  pokemons = response.data.results;

  await fetchPokemonTypes();
  pokemons.sort((a, b) => a.id - b.id);
  paginate(currentPage, PAGE_SIZE, pokemons)
  const numPages = Math.ceil(pokemons.length / PAGE_SIZE)
  updatePaginationDiv(currentPage, numPages)



  // pop up modal when clicking on a pokemon card
  // add event listener to each pokemon card
  $('body').on('click', '.pokeCard', async function (e) {
    const pokemonName = $(this).attr('pokeName')
    // console.log("pokemonName: ", pokemonName);
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    // console.log("res.data: ", res.data);
    const types = res.data.types.map((type) => type.type.name)
    // console.log("types: ", types);
    $('.modal-body').html(`
        <div style="width:200px">
        <img src="${res.data.sprites.other['official-artwork'].front_default}" alt="${res.data.name}"/>
        <div>
        <h3>Abilities</h3>
        <ul>
        ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
        </ul>
        </div>

        <div>
        <h3>Stats</h3>
        <ul>
        ${res.data.stats.map((stat) => `<li>${stat.stat.name}: ${stat.base_stat}</li>`).join('')}
        </ul>

        </div>

        </div>
          <h3>Types</h3>
          <ul>
          ${types.map((type) => `<li>${type}</li>`).join('')}
          </ul>
      
        `)
    $('.modal-title').html(`
        <h2>${res.data.name.toUpperCase()}</h2>
        <h5>${res.data.id}</h5>
        `)
  })

  // add event listener to pagination buttons
  $('body').on('click', ".numberedButtons", async function (e) {
    currentPage = Number(e.target.value)
    paginate(currentPage, PAGE_SIZE, pokemons)

    //update pagination buttons
    updatePaginationDiv(currentPage, numPages)
  })

}


$(document).ready(setup)