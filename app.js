window.onload = () => {
    let endpoint = 'https://pokeapi.co/api/v2/pokemon/'
    fetchPokemons();

    document.getElementById('nexto').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('pokemons').innerHTML = '';
        fetchPokemons();
    })    

    function fetchPokemons() {
        fetch(endpoint)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                endpoint = data.next;
                data.results.forEach(function(pokemon) {
                            let monster = `
                                <div class="p-4">
                                    <div class="card" style="width: 18rem;">
                                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.url.split('/')[6]}.png" class="card-img-top">
                                        <div class="card-body">
                                            <h5 class="card-title">${pokemon.name}</h5>
                                            <a href="#" id="${pokemon.name}-${pokemon.url.split('/')[6]}" class="btn btn-info">I wanna know more of this pokemon!</a>
                                        </div>
                                    </div>
                                </div>`
                            document.querySelector('#pokemons').insertAdjacentHTML('beforeend', monster);
                            document.querySelector(`#${pokemon.name}-${pokemon.url.split('/')[6]}`).addEventListener('click', (e) => {
                                e.preventDefault();
                                $('#diModal').modal('show');
                                document.querySelector('#pokemonName').innerHTML = pokemon.name;
                                document.querySelector('#pokeName').innerHTML = "Name: " + pokemon.name;
                                fetch(pokemon.url)
                                .then(function(response){
                                    return response.json();
                                })
                                .then(function(pokemonsito){
                                    document.querySelector('#abilities').innerHTML = getAbilities(pokemonsito)
                                    document.querySelector('#pokeTypes').innerHTML = getPokeTypes(pokemonsito)
                                    document.querySelector('#firstFiveMoves').innerHTML = getPokeMoves(pokemonsito)  
                                })
                                document.querySelector('#intomodal').addEventListener('click', (e) => {
                                    e.preventDefault();
                                    $('#triModal').modal('show');
                                    fetch(pokemon.url)
                                    .then(function(response){
                                        return response.json();
                                    })
                                    .then(async function(pokemonsito){
                                        document.querySelector('#damagerelation1').innerHTML = await getDoubleDamageRelations(pokemonsito); 
                                        document.querySelector('#damagerelation2').innerHTML = await makeDoubleDamageRelations(pokemonsito);
                                        document.querySelector('#damagerelation3').innerHTML = await getHalfDamageRelations(pokemonsito);
                                        document.querySelector('#damagerelation4').innerHTML = await makeHalfDamageRelations(pokemonsito);
                                    })
                                });
                                document.querySelector('#tomodal').addEventListener('click', (e) => {
                                    e.preventDefault();
                                    $('#cuaModal').modal('show');
                                    fetch(pokemon.url)
                                    .then(function(response){
                                        return response.json();
                                    })
                                    .then(async function(pokemonsito){
                                        document.querySelector('#pokemonabi').innerHTML = await getPokeAbi(pokemonsito);
                                    })
                                });
                            })
                        })
                })
    }

    function getAbilities(pokemon) {
        let abi = 'Abilities : '
        pokemon.abilities.forEach(function(ability){
            abi += ` ${ability.ability.name}`
        })
        return abi;
    }

    function getPokeTypes(pokemon) {
        let types = 'Types : '
        pokemon.types.forEach(function(type){
            types += ` ${type.type.name}`
        })
        return types;
    }

    function getPokeMoves(pokemon) {
        let move = 'Moves : '
        pokemon.moves.forEach(function(movesito, index){
            if (index < 5) {
                move += ` ${movesito.move.name}`
            }
        })
        return move;
    }

    async function getDoubleDamageRelations(pokemon) {
        let doubledamage = 'Get double damage : '
        await Promise.all(pokemon.types.map(function(type){
            return fetch(type.type.url) 
                .then(function(response){
                    return response.json();
                })
                .then(function (data) {
                    data.damage_relations.double_damage_from.forEach(function(data){
                        doubledamage += ` ${data.name}`
                    })
                })
        }))
        return doubledamage;
    }

    async function makeDoubleDamageRelations(pokemon) {
        let doubledamage = 'Make double damage : '
        await Promise.all(pokemon.types.map(function(type){
            return fetch(type.type.url) 
                .then(function(response){
                    return response.json();
                })
                .then(function (data) {
                    data.damage_relations.double_damage_to.forEach(function(data){
                        doubledamage += ` ${data.name}`
                    })
                })
        }))
        return doubledamage;
    }

    async function getHalfDamageRelations(pokemon) {
        let halfdamage = 'Get half damage : '
        await Promise.all(pokemon.types.map(function(type){
            return fetch(type.type.url) 
                .then(function(response){
                    return response.json();
                })
                .then(function (data) {
                    data.damage_relations.half_damage_to.forEach(function(data){
                        halfdamage += ` ${data.name}`
                    })
                })
        }))
        return halfdamage;
    }

    async function makeHalfDamageRelations(pokemon) {
        let halfdamage = 'Make half damage : '
        await Promise.all(pokemon.types.map(function(type){
            return fetch(type.type.url) 
                .then(function(response){
                    return response.json();
                })
                .then(function (data) {
                    data.damage_relations.half_damage_to.forEach(function(data){
                        halfdamage += ` ${data.name}`
                    })
                })
        }))
        return halfdamage;
    }

    async function getPokeAbi(pokemon) {
        let abi = 'All pokemons with this ability : '
        await Promise.all(pokemon.abilities.map(function(ability){
            return fetch(ability.ability.url) 
                .then(function(response){
                    return response.json();
                })
                .then(function (data) {
                    data.pokemon.forEach(function(data){
                        abi += ` ${data.pokemon.name} / `
                        console.log(abi);
                    })
                })
        }))
        return abi;
    }
}
