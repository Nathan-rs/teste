/**
 * Classe nova para fieldsets com mais configurações
 * @author Fernando Petri
 * @requires Prototypes
 */
class FieldGroup {
   constructor(config) {

      //Configuração
      this.config = $.extend(true, {

         title: '[Sem título]',
         description: "",
         name: null,
         icon: null,
         collapse: true,
         open: true,
         content: null,
         style: 'default',
         css: {
            fieldset: {},
            header: {},
            info: {},
            title: {},
            description: {},
            icon: {},
            options: {},
            content: {}
         },
         onClose: () => {},
         onOpen: () => {}

      }, config)

      //Elementos
      this.wrapper = new Section('fg')
      this.header = new Header('fg-hd')
      this.info = new Div('fg-hd-if')
      this.title = new H4('fg-hd-if-tt')
      this.description = new Paragraph('fg-hd-if-dsc')
      this.icon = new Icon('fg-hd-if-ic')
      this.options = new Div('fg-hd-opt')
      this.content = new Div('fg-ct')
      this.arrow = new Icon('fg-hd-opt-arr')

      //Configurando
      this.arrow.addClass('down')
      this.title.text(this.getTitle())
      this.description.text(this.getDescription())
      this.icon.addClass(this.getIcon())
      this.wrapper.addClass(this.config.style)

      //Eventos
      this.content.on('transitionend', () => {
         if (this.isClosed()) return

         this.content.css('overflow', 'visible')
         this.content.css('height', '')
      })

      this.content.on('transitionstart', () => {
         if (this.isOpen()) return

         this.content.css('overflow', 'hidden')
      })

      //CSS adicional
      setTimeout(() => {
         this.wrapper.css(this.config.css.fieldset)
         this.header.css(this.config.css.header)
         this.info.css(this.config.css.info)
         this.title.css(this.config.css.title)
         this.description.css(this.config.css.description)
         this.icon.css(this.config.css.icon)
         this.options.css(this.config.css.options)
         this.content.css(this.config.css.content)
      })

      //Montando
      this.wrapper.append(
         this.header,
         this.content
      )

      //Header
      this.header.append(
         this.info,
         this.options
      )

      //Info
      this.info.append(
         this.title
      )

      //Caso hovuer um icone
      if (this.hasIcon()) {
         this.info.prepend(this.icon)
      }

      //Caso houver descrição
      if (this.hasDescription()) {
         this.title.append(this.description)
      }

      //Caso o collapse estiver aberto
      if (this.isCollapseEnabled()) {
         this.header.click(() => this.toggleContent())
         this.header.addClass('isToggle')
         this.options.append(this.arrow)
      }

      // Adicionando content caso passado por parametro
      if (this.config.content) {
         this.appendToContent(this.config.content)
      }

      //Caso estiver fechado inicialmente
      if (this.isClosed()) {
         this.close()
         this.content.css('overflow', 'hidden')
      }
   }

   /**
    * Retorna o título a ser usado
    * @returns {string} O título
    */
   getTitle() {
      return this.config.title
   }

   /**
    * Retorna a descrição
    * @returns {string} A descrição
    */
   getDescription() {
      return this.config.description
   }

   /**
    * Retorna o nome do icone a ser usado
    * @returns {string} O icon
    */
   getIcon() {
      return this.config.icon
   }

   /**
    * Retorna o o nome do fieldset
    * @returns {string} O nome do fieldset
    */
   getName() {
      return this.config.name
   }

   /**
    * Retorna se há um icone na configuração
    * @returns {boolean} Se irá usar um icone
    */
   hasIcon() {
      return !!this.getIcon()
   }

   /**
    * Retorna se há uma descrição
    * @returns {boolean} Se será mostrado uma descrição
    */
   hasDescription() {
      return !!this.getDescription()
   }

   /**
    * Retorna se está aberto o conteúdo do fieldgroup
    * @returns {boolean} Se está aberto
    */
   isOpen() {
      return !!this.config.open
   }

   /**
    * Retorna se está fechado o conteúdo do fieldgroup
    * @returns {boolean} Se está fechado
    */
   isClosed() {
      return !this.config.open
   }

   /**
    * Retorna se a funcionalidade de fehcar e abrir o conteúdo está habiltiado
    * @returns {boolean} Se está habilitado para abrir e fechar o menu
    */
   isCollapseEnabled() {
      return !!this.config.collapse
   }

   /**
    * Adiciona elementos do conteúdo do fieldgroup
    * @param  {...JQuery} items Elementos a serem adicionados no content
    */
   appendToContent(...items) {
      this.content.append(...items)
   }

   /**
    * Altera entre o estado do conteúdo aberto/fechado
    */
   toggleContent() {
      this.isOpen()
         ? this.close()
         : this.open()
   }

   /**
    * Abre o menu
    */
   open() {
      this.config.open = true

      this.wrapper.removeClass('isClosed')
      this.content.css('height', this.getContentChildrenHeight() + 'px')
      this.config.onOpen(this)
   }

   /**
    * Fecha o conteúdo
    */
   close() {
      this.config.open = false

      this.wrapper.addClass('isClosed')
      this.content.css('height', this.getContentHeight() + 'px')

      this.forceElementReflow(this.content)

      this.content.css('height', 0)
      this.config.onClose(this)
   }

   /**
    * Adiciona o estado de erro do field group.
    */
   setError() {
      this.wrapper.addClass('hasError')
   }

   /**
    * Remove o estado de erro do fieldgroup
    */
   removeError() {
      this.wrapper.removeClass('hasError')
   }

   /**
    * Força o `reflow` de um elemento no DOM
    * @param {JQuery} element O elemento 
    */
   forceElementReflow(element) {
      void (element[0].offsetHeight)
   }

   /**
    * Retorna o tamanho do conteúdo
    * @returns {number} O tamanho do conteúdo
    */
   getContentHeight() {
      return this.content.outerHeight()
   }

   /**
    * Retorna a altura de todos os filhos do content somados
    * @returns {number} O tamanho em pixels de altura
    */
   getContentChildrenHeight() {
      return this.getContentChildren().reduce((total, child) => {

         return total + $(child).outerHeight()

      }, 0)
   }

   /**
    * Retorna a lista de crianças do grupo de campos
    * @returns {JQuery[]} A lista de crianças do grupo
    */
   getContentChildren() {
      return Array.from(this.content.children())
   }

   /**
    * Retorna a visualização do grupo de campos
    * @returns {JQuery} O elemento
    */
   getView() {
      return this.wrapper
   }
}