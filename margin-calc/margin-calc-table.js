
class marginCalcTable extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        // Create a shadow root
        this.attachShadow({mode: 'open'}); // sets and returns 'this.shadowRoot'

        const linkElem = document.createElement('link');
        linkElem.setAttribute('rel', 'stylesheet');
        linkElem.setAttribute('href', 'margin-calc.css');

        // Attach the created element to the shadow dom
        this.shadowRoot.append(linkElem);

    }

    create =  function(data){
        let ele = document.createElement("margin-calc-row", data)
        this.shadowRoot.append(ele)
    }
}

customElements.define('margin-calc-table', marginCalcTable);

