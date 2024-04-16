# Instalações necessárias

1. Node JS
2. Live Sass Compiler
3. Grunt CLI


[] - Salva latitude e longitude em um campo
[] - passar as config para o componente
[] - campo de pesquisa na modal
createSearchBar(map) {
    const divSearch = new Div('dv-search');
    const inputSearch = new Input('search');
    const options = {
        fields: ['formatted_address', 'geometry'],
        types: ['geocode'],
        componentRestrictions: { country: 'BR' }
    };

    inputSearch.attr('placeholder', 'Pesquisar endereço...');
    divSearch.append(inputSearch);

    // Importando a biblioteca Places
    google.maps.importLibrary("places").then(() => {
        const autocomplete = new google.maps.places.Autocomplete(inputSearch[0], options);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) {
                console.error("Nenhum detalhe disponível para o lugar: ", place);
                return;
            }
            // Atualize as coordenadas e o endereço, mova o marcador, etc.
        });
    });

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(divSearch[0]);
}
