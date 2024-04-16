const body = $('body');

const fieldGroup = new FieldGroup({
   icon: 'menu',
   title: "Allinsys Test Boilerplatez",
   description: "Descrição passada pelo desenvolvedor",
})

const fildModalMaps = new FieldGroup({
   icon: "location",
   title: "Modal Google Maps",
   description: "Modal para obter latitude e longitude",
   open: true,
   collapse: false
})

// const listCardLocation = new FieldGroup({
//    title: "Localizações selecionadas",
//    description: "Endereco latitude e longitude",
//    open: true,
//    collapse: false
// })

const modalMaps = new ModalMaps({
   title: "Modal de pesquisa",
   value: "latitude&longitude"
})

// listCardLocation.appendToContent(modalMaps.getCardAdress())
fildModalMaps.appendToContent([modalMaps.getViewButtonModal(), modalMaps.getView()])
// const contentList = [otherFieldGroup.getView(), fildModalMaps.getView()]
const contentList = [fildModalMaps.getView()]


fieldGroup.appendToContent(...contentList)
body.append(fieldGroup.getView()) 