class ModalMaps {
    constructor(config) {
        this.config = $.extend(true, {
            title: '[Sem título]',
            value: null
        }, config)

        this.adress = null,
        this.latitude = null,
        this.longitude = null,
        this.marker = null,
        this.listAdress = [],

        
        //Elementos HTML
        this.wrapper = new Div('wrapper')
        this.container = new Div('container')
        this.contentHeader = new Div('header-title')
        this.title = new H4('title')
        this.iconClose = new Icon('icon-close')
        this.content = new Div('content')
        this.areaClick = new Div('div-button')
        this.button = new Button('btn-ok')
        this.adress = new Div('content-adress')
        this.divModal = new Div('div-modal')
        this.buttonModal = new Button('btn-open-modal')

        this.iconClose.addClass('close')

        this.setPositionLatitude(-23.55052)
        this.setPositionLongitude(-46.633308)
        this.setAdress(this.getAddressLatitudeLongitude(this.getPositionLatitude(), this.getPositionLongitude()))

        this.wrapper.append(this.container)

        this.contentHeader.append(
            this.title, 
            this.iconClose
        )

        this.areaClick.append(this.button)
        this.button.text(this.getTextButton())
        this.title.text(this.getTitle())

        this.container.append(
            this.contentHeader, 
            this.content, 
            this.areaClick
        )
        
        setTimeout(() => {
            this.wrapper.css('display', 'none')
        });

        //Eventos
        this.button.on('click', () => {
            console.log('Latitude: ', this.getPositionLatitude());
            console.log('Longitude: ', this.getPositionLongitude())
            console.log('Endereco: ', this.getAdress())
            this.addAdress(this.getAdress())
        })

        this.buttonModal.on('click', () => {
            this.openModal()
        })

        this.iconClose.on('click', () => {
            this.wrapper.css('display', 'none')
            this.divModal.css('display', 'flex')
        })
    }

    openModal() {
        this.wrapper.css('display', 'block')
        this.divModal.css('display', 'none')
        this.getInitMap()
    }

    getInitMap() {
        this.getCreateMap().then((map) => {
            if(!map) {
                this.getErrorMensage()
            }
            window.getCreateMap = this.getCreateMap
            this.setAdress()
        })
    }

    async getCreateMap() {
        try {
            const { Map } = await google.maps.importLibrary("maps")
            const { AdvancedMarkerElement, PinElement  } = await google.maps.importLibrary("marker")

            const map = new google.maps.Map(this.content[0], {
                center: {
                    lat: this.getPositionLatitude(),
                    lng: this.getPositionLongitude()
                },
                zoom: 12,
                mapId: "MAP_MODAL_ID",
                disableDefaultUI: true,
                zoomControl: true
            });

            // this.createSearchBar(map)

            const divSe = new Div('dv-se')
            const inputSe = new Input('ipt-se')

            inputSe.attr('placehold', 'Pesquisar')

            divSe.append(inputSe)

            const autocomplete = new google.maps.places.Autocomplete(inputSe[0], {
                types: ['establishment'],
                componentRestrictions: {'country': ['AU']},
                fields: ['place_id', 'geometry', 'name']
            })

            if(autocomplete){
                console.log('sim')
            }else{
                console.log('nao')
            }

            map.controls[google.maps.ControlPosition.TOP_CENTER].push(divSe[0])

            //Button custom location map
            const customButton = this.createButtonLocationUser(map)
            map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(customButton[0])


            //cria o marcador ping no mapa e seta por pasdrão a localização
            this.marker = new google.maps.marker.AdvancedMarkerElement({
                position: {
                    lat: this.getPositionLatitude(),
                    lng: this.getPositionLongitude()
                },
                map: map
            })
            
            map.addListener('click', async (event) => {
                // coordenadas de latitude e longitude de evento clique
                const latitude = event.latLng.lat();
                const longitude = event.latLng.lng();

                // Atualiza as coordenadas nas propriedades da classe
                this.setPositionLatitude(latitude)
                this.setPositionLongitude(longitude)

                if(this.marker) {
                    this.marker.setMap(null)
                }

                this.marker = new google.maps.Marker({
                    position: {
                        lat: this.getPositionLatitude(),
                        lng: this.getPositionLongitude()
                    },
                    map: map
                })

                map.setCenter({lat: this.getPositionLatitude(), lng: this.getPositionLongitude()})
                this.getInfoWindows(this.marker)
                this.setAdress()
            });

            return map
        } catch (error) {
            console.error('Erro ao criar o mapa', error)
            return null
        }
    }

    createButtonLocationUser(map) {
        const controlDiv = new Div('dv-geo-user')
        const geoLocationButton = new Button('btn-geo-user')
        const iconLocation = new Icon('location')

        iconLocation.addClass('icon-btn-geo-user')

        geoLocationButton.append(iconLocation)
        controlDiv.append(geoLocationButton)

        geoLocationButton.on('click', () => this.getUserLocation(map))
        return controlDiv
    }

    createSearchBar(map) {
        const divSearch = new Div('dv-search')
        const inputSearch = new Input('seach')
        const options = {
            fields: ['formatted_address', 'geometry'],
            types: ['geocode'],
            componentRestrictions: {country: 'BR'}
        }

        inputSearch.attr('placeholder', 'Pesquisar endereco...')
        divSearch.append(inputSearch)

        const autocomplete = new google.maps.places.Autocomplete(inputSearch[0], options)

        autocomplete.addListener('place_changed', () => {
            console.log(autocomplete)
        })

        map.controls[google.maps.ControlPosition.TOP_CENTER].push(divSearch[0])
    }

    getUserLocation(map) {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }

                this.setPositionLatitude(userLocation.lat)
                this.setPositionLongitude(userLocation.lng)
                
                if(this.marker) {
                    this.marker.setMap(null)
                }
    
                this.marker = new google.maps.Marker({
                    position: userLocation,
                    map: map
                })
    
                map.setCenter(userLocation)
                this.setAdress()

            })
        }
    }


    /**
     * @param {number} latLng latitude
     * @description adiciona o ping onde o usuario clicar 
     */
    placeMarkerAndPanTo(latLng, map) {
        new google.maps.marker.AdvancedMarkerElement({
            position: latLng,
            map: map,
        });
        map.panTo(latLng);
    }

    getInfoWindows(marker) {
        const infowindow = new google.maps.InfoWindow()

        marker.addListener("click", async () => {
            const address = await this.getAddressLatitudeLongitude(marker.getPosition().lat(), marker.getPosition().lng());
            infowindow.setContent(address);
            infowindow.open(marker.map, marker);
            // this.setAdress()
            // console.log(adress)
        })
    }

    async getAddressLatitudeLongitude(latitude, longitude) {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDxMX7gWV7_iEffKz9TwPnKWGuVeNMyYJM`);
            const data = await response.json();
        
            if (data.results && data.results.length > 0) {
                return data.results[0].formatted_address;
            } else {
                return "Endereço não encontrado";
            }
        } catch (error) {
            console.error("Erro ao obter o endereço:", error);
            return "Erro ao obter o endereço";
        }
    }

    getViewButtonModal() {
        let text = new H2('txt-open-modal')
        
        text.text('Abrir modal')
        this.buttonModal.text('Open')

        this.divModal.append(
            this.buttonModal,
            text,
        )

        return this.divModal
    }

    addAdress(adress) {
        if(adress) this.listAdress.push(adress)
    }

    getCardAdress() {
        let wrapper = new Div('wrapper')
        let card = new Div('card')
        let icon = new Icon('card-icon')
        let adress = new Div('adress')

        card.append(
            icon,
            adress
        )

        for(let index in this.listAdress) {
            let paragraph = new Paragraph('adress-title')
            icon.addClass('location')
            paragraph.text(this.listAdress[index])
            adress.append(paragraph)
        }

        return card
    }

    getAdress() {
        return this.adress || "Endereço não encontrado"
    }

    async setAdress() {
        this.adress = await this.getAddressLatitudeLongitude(this.getPositionLatitude(), this.getPositionLongitude());
    }

    getErrorMensage() {
        const titleErro = new H1('erro-show-map')
        titleErro.text("Não foi possivel exibir o mapa")
        this.content.append(titleErro)
        this.areaClick.css('display', 'none')
    }

    getContent() {
        return this.content.children().length > 0
    }

    setPositionLatitude(latitude) {
        this.latitude = latitude
    }

    setPositionLongitude(longitude) {
        this.longitude = longitude
    }

    getPositionLatitude() {
        return this.latitude
    }

    getPositionLongitude() {
        return this.longitude
    }

    getTitle() {
        return this.config.title
    }

    getTextButton() {
        return "Confirmar"
    }

    getView() {
        return this.wrapper
    }
}