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
                                    .then(function(pokemonsito){
                                        document.querySelector('#damagerelation').innerHTML = getDoubleDamageRelations(pokemonsito); 
                                        console.log(getDoubleDamageRelations(pokemonsito))
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

        function getDoubleDamageRelations(pokemon) {
        let doubledamage = 'Double damage : '
        pokemon.types.map(function(type){
            fetch(type.type.url) 
                .then(function(response){
                    return response.json();
                })
                .then(function (data) {
                    data.damage_relations.double_damage_from.forEach(function(data){
                        doubledamage += ` ${data.name}`
                    }) 
                })
        })
        return doubledamage;
    }
}
