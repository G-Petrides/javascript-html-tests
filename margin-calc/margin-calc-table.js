
let marginTest = { ebay:false, amazon:false }

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

    create =  function(items){
        let ele = document.createElement("margin-calc-title-row")
        this.shadowRoot.append(ele)
        if(items) {
            for (let item of items) {
                let ele = document.createElement('margin-calc-row')
                ele.id = item.SKU
                this.shadowRoot.append(ele)
                ele.update(item)
            }
        }
    }
}

customElements.define('margin-calc-table', marginCalcTable);

const titleData = [
    {title:""},
    {title:""},
    {title:"SKU"},
    {title:"Purchase Price"},
    {title:"Profit LY"},
    {title:"Stock Value", id:"stock-val-total"},
    {title:"Packaging"},
    {title:"Pack Cost"},
    {title:"Postage"},
    {title:"Mod"},
    {title:"Cost"},
    {title:"Ebay Price", id:"ebay-price"},
    {title:"Ebay Price Test", id:"ebay-price-test"},
    {title:"Ebay Margin", id:"ebay-margin"},
    {title:"Amz Price", id:"amz-price"},
    {title:"Amazon Price Test", id:"amazon-price-test"},
    {title:"Amz Margin", id:"amz-margin"},
    {title:"Amz Prime"},
    {title:"Prime Margin"},
    {title:"QS Price"},
    {title:"QS Margin", id:"qs-margin"},
    {title:"Shop Price"},
    {title:"Shop Margin", id:"shop-margin"},
    {title:"Notes"},
]

class marginCalcTitleRow extends HTMLElement {

    connectedCallback() {
        for(let data of titleData){
            if(data.id === "ebay-price-test"){
                if(!marginTest.ebay) continue
            }
            if(data.id === "amazon-price-test"){
                if(!marginTest.amazon) continue
            }
            let div = document.createElement('margin-calc-cell')
            div.innerText = data.title
            if (data.id) div.id = data.id
            this.appendChild(div)
        }
    }
}

customElements.define('margin-calc-title-row', marginCalcTitleRow);

class marginCalcRow extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();

        this.rowItem = {};
    }

    update = function(item){
        this.rowItem = item
        updateRow(this, this.rowItem)
    }

    connectedCallback() {
        this.addEventListener("focusout",function(e){
            console.log(this.id)
            console.log(this.rowItem)
            console.log(e)
            console.log(e.target)
        })
    }
}

customElements.define('margin-calc-row', marginCalcRow);

class marginCalcCell extends HTMLElement {
    constructor() {
        // Always call super first in constructor
        super();
        // Create a shadow root
    }
}

customElements.define('margin-calc-cell', marginCalcCell);

function updateRow(row, item){

    row.innerHTML = ""

    //Linnworks submit div, button and onclick function
    let linnButtonCell = document.createElement('margin-calc-cell');
    let linnSubmitButton = document.createElement('button');
    linnSubmitButton.class = "tickBtn"
    linnSubmitButton.innerText = "✓"
    linnSubmitButton.onclick = () => {
        //submitLinnData(data)
    };
    linnButtonCell.appendChild(linnSubmitButton)
    row.appendChild(linnButtonCell)

    //Hide item checkbox div, input and onchange function
    let hideCell = document.createElement('margin-calc-cell');
    let hideCheckbox = document.createElement('input');
    hideCheckbox.dataset.key = "HIDE"
    hideCheckbox.type = "checkbox"
    hideCheckbox.checked = item.HIDE
    hideCheckbox.onchange = () => {
        item.HIDE = hideCheckbox.checked;
        /*dbSave(item).then(() => {
            if (item.HIDE && hide) row.parentNode.removeChild(row)
        });*/
    }
    hideCell.appendChild(hideCheckbox)
    row.appendChild(hideCell)

    //SKU div
    let skuCell = document.createElement('margin-calc-cell');
    skuCell.innerText = `${item.SKU}`
    row.appendChild(skuCell)

    // Purchase price div, input and onblur function
    let purchasePriceCell = document.createElement('margin-calc-cell');
    let purchasePriceInput = document.createElement('input');
    purchasePriceInput.dataset.key = "PURCHASEPRICE";
    purchasePriceInput.type = "number";
    purchasePriceInput.step = "0.01";
    purchasePriceInput.value = item.PURCHASEPRICE ? item.PURCHASEPRICE.toFixed(2) : 0
    purchasePriceInput.onblur = () => {
        item.PURCHASEPRICE = parseFloat(purchasePriceInput.value)
        //itemUpdate(item.SKU, 'PURCHASEPRICE', item.PURCHASEPRICE)
    }
    purchasePriceCell.appendChild(purchasePriceInput);
    row.appendChild(purchasePriceCell);

    //Profit last year div
    let profitLastYearCell = document.createElement('margin-calc-cell');
    profitLastYearCell.innerText = item.MD.TOTALPROFITLY ? `£${item.MD.TOTALPROFITLY.toFixed(2)}`: `£${(0).toFixed(2)}`;
    row.appendChild(profitLastYearCell);

    //Stock value div
    let stockValueCell = document.createElement('margin-calc-cell');
    stockValueCell.innerText = `${item.STOCKVAL && item.IDBFILTER !== "bait" ? '£'+item.STOCKVAL.toFixed(2) : ''}`;
    row.appendChild(stockValueCell);

    //Packaging div
    let packagingCell = document.createElement('margin-calc-cell');
    //packagingCell.innerText = `${packOpts(item, 'Name')}`;
    row.appendChild(packagingCell);

    //Packaging Cost div
    let packagingPriceCell = document.createElement('margin-calc-cell');
    //packagingPriceCell.innerText = packOpts(item, 'Price') ? `£${packOpts(item, 'Price').toFixed(2)}` : `£${(0).toFixed(2)}`;
    row.appendChild(packagingPriceCell);

    //Postage type div, select and onchange function
    let postTypeCell = document.createElement('margin-calc-cell');
    let postSelect = document.createElement('select')
    postSelect.dataset.key = "POSTID";
    postSelect.onchange = () => {
        //postUpdate(item.SKU)
    };
    postTypeCell.appendChild(postSelect);
    //postOptions(postSelect , item.SKU , item.POSTID);
    row.appendChild(postTypeCell);

    //Postage modifier div, select and onchange function
    let postModCell = document.createElement('margin-calc-cell');
    let postModSelect = document.createElement('select')
    postModSelect.dataset.key = "POSTMOD";
    postModSelect.className = "postSelect";
    postModSelect.onchange = () => {
        //postUpdate(item.SKU)
    };
    postModCell.appendChild(postModSelect);
    //postOffsetOptions(pModSelect, item.POSTMODID)
    row.appendChild(postModCell);


    //UK Postage cost div
    let postageCost = document.createElement('margin-calc-cell');
    postageCost.innerText = item.MD.POSTALPRICEUK ? `£${item.MD.POSTALPRICEUK.toFixed(2)}` : `£${(0).toFixed(2)}`
    row.appendChild(postageCost);

    //Ebay price div, input and onblur function
    let ebayPriceCell = document.createElement('margin-calc-cell')
    ebayPriceCell.appendChild( createPriceInput("EBAYPRICEINCVAT", item) );
    row.appendChild(ebayPriceCell);

    //Ebay test margin divs
    /* x - (x-(x / 1.20)) - (x*channel fee per) = (PP + Postage + Pack + channel flat fee) + ((PP/ 100) * test margin)
    *  ebay magic number 0.724333
    */

    /*
    let ebayTestWrap = document.createElement('margin-calc-cell')
    ebayTestWrap.className = marginTest.ebay ? "double-row-wrapper": "double-row-wrapper hidden"
    let ePriceCell = document.createElement('div')
    ePriceCell.className = "double-row-cell"

    let eMarginCell = document.createElement('margin-calc-cell')
    eMarginCell.className = "double-row-cell"

    if(marginTestValue.ebay > 0 && item.PURCHASEPRICE && item.MD){
        let ebayFlat = item.PURCHASEPRICE + item.MD.POSTALPRICEUK + item.MD.PACKAGING + parseFloat(fees["FLAT"].EBAY) + parseFloat(fees["SUBSCRIPTION"].EBAY)
        let targetMargin = ((item.PURCHASEPRICE/ 100) * marginTestValue.ebay)
        let adjustedPrice = (ebayFlat + targetMargin) / 0.724333
        ePriceCell.innerText = `£${adjustedPrice.toFixed(2)}`
        eMarginCell.innerText = `£${targetMargin.toFixed(2)} | ${marginTestValue.ebay}%`
    }

    eTestWrap.appendChild(ePriceCell)
    eTestWrap.appendChild(eMarginCell)
    row.appendChild(eTestWrap);
    */

    let ebayToolTipData = createToolTipData(true, item.EBAYPRICEINCVAT, item, item.MD.EBAYUKSALESVAT, item.MD.EBAYFEES, item.MD.EBAYUKPAVC)
    row.appendChild(createMarginLabel("EBAYUKPAVC",item,item.EBAYPRICEINCVAT,ebayToolTipData));

    //Amazon price div, input and onblur function
    let amazonPriceCell = document.createElement('margin-calc-cell');
    amazonPriceCell.appendChild( createPriceInput("AMZPRICEINCVAT", item) );
    row.appendChild(amazonPriceCell);

    //Amazon test margin divs
    /* x - (x-(x / 1.20)) - (x*channel fee per) = (PP + Postage + Pack + channel flat fee) + ((PP/ 100) * test margin)
    *  ebay magic number 0.724333
    *  amazon 0.678333
    */

    /*
    let amzTestWrap = document.createElement('margin-calc-cell')
    amzTestWrap.className = marginTest.amz ? "double-row-wrapper": "double-row-wrapper hidden"
    let amzPriceCell = document.createElement('div')
    amzPriceCell.className = "double-row-cell"

    let amzMarginCell = document.createElement('margin-calc-cell')
    amzMarginCell.className = "double-row-cell"

    if(marginTestValue.amz > 0 && item.PURCHASEPRICE && item.MD){
        let ebayFlat = item.PURCHASEPRICE + item.MD.POSTALPRICEUK + item.MD.PACKAGING + parseFloat(fees["FLAT"]["AMAZ"]) + parseFloat(fees["SUBSCRIPTION"]["AMAZ"])
        let targetMargin = ((item.PURCHASEPRICE/ 100) * marginTestValue.amz)
        let adjustedPrice = (ebayFlat + targetMargin) / 0.67833
        amzPriceCell.innerText = `£${adjustedPrice.toFixed(2)}`
        amzMarginCell.innerText = `£${targetMargin.toFixed(2)} | ${marginTestValue.amz}%`
    }

    amzTestWrap.appendChild(amzPriceCell)
    amzTestWrap.appendChild(amzMarginCell)
    row.appendChild(amzTestWrap);
    */

    let amazonToolTipData = createToolTipData(true, item.AMZPRICEINCVAT, item, item.MD.AMAZSALESVAT, item.MD.AMAZONFEES, item.MD.AMAZPAVC)
    row.appendChild(createMarginLabel("AMAZPAVC",item,item.AMZPRICEINCVAT,amazonToolTipData));

    //Prime button div, image and onclick function
    let primeCell = document.createElement('margin-calc-cell');
    let primeImage = document.createElement('img')
    primeImage.src = item.AMZPRIME ? "/src/img/prime-logo.svg" : "";
    primeCell.appendChild(primeImage);
    primeCell.onclick = () => {
        item.AMZPRIME = !item.AMZPRIME
        primeImage.src = item.AMZPRIME ? "/src/img/prime-logo.svg" : "";
        //itemUpdate(item.SKU, `AMZPRIME`, item.AMZPRIME)
    };
    row.appendChild(primeCell);

    row.appendChild(createMarginLabel("PRIMEPAVC",item));

    //Quay sports online price div, input and onblur function
    let qsPriceCell = document.createElement('margin-calc-cell');
    qsPriceCell.appendChild( createPriceInput("QSPRICEINCVAT", item) );
    row.appendChild(qsPriceCell);

    let qsToolTipData = item.QSPRICEINCVAT >= 25
        ? createToolTipData(true, item.QSPRICEINCVAT, item, item.MD.QSUKSALESVAT, item.MD.QSFEES, item.MD.QSPAVC)
        : createToolTipData(false, item.QSPRICEINCVAT, item, item.MD.QSUKSALESVAT, item.MD.QSFEES, item.MD.QSPAVC)
    row.appendChild(createMarginLabel("QSPAVC",item,item.QSPRICEINCVAT,qsToolTipData));

    //Shop price div, input and onblur function
    let shopPriceCell = document.createElement('margin-calc-cell');
    shopPriceCell.appendChild( createPriceInput("SHOPPRICEINCVAT", item) );
    row.appendChild(shopPriceCell);

    let shopToolTipData = createToolTipData(false, item.SHOPPRICEINCVAT, item, item.MD.SHOPUKSALESVAT, item.MD.SHOPFEES, item.MD.SHOPPAVC)
    row.appendChild(createMarginLabel("SHOPPAVC",item,item.SHOPPRICEINCVAT,shopToolTipData));

    //Note div, input and onblur function
    let marginNoteCell = document.createElement('margin-calc-cell');
    let marginNoteInput = document.createElement('input');
    marginNoteInput.id = `${item.SKU}-MARGINNOTE-input`;
    marginNoteInput.type = "text";
    marginNoteInput.className = "note-input";
    marginNoteInput.value = item.MARGINNOTE ? item.MARGINNOTE : ""
    marginNoteInput.onblur = () => {
        item.MARGINNOTE = marginNoteInput.value
        //itemUpdate(item.SKU, 'MARGINNOTE', item.MARGINNOTE)
    };
    marginNoteCell.appendChild(marginNoteInput);
    row.appendChild(marginNoteCell);

}

function createPriceInput(key, item){
    //Ebay price div, input and onblur function
    let price = document.createElement('input');
    price.dataset.key = key;
    price.type = "number";
    price.step = "0.01";
    price.value = item[key] ? item[key] : "0"
    price.onblur = () => {
        item[key] = parseFloat(price.value)
        //itemUpdate(item.SKU, 'EBAYPRICEINCVAT', item.EBAYPRICEINCVAT)
    };
    //cc(ebayPrice, item.CP.EBAY, item.EBAYPRICEINCVAT, item.MCOVERRIDES ? item.MCOVERRIDES.EBAY : false)
    return price
}

function createMarginLabel(key, item, channelPrice, toolTipData){
    let marginCell = document.createElement('margin-calc-cell');
    if(item.MD[key] !== undefined) {
        let percentage = item.PURCHASEPRICE !== 0 ? (100 / item.PURCHASEPRICE) * item.MD[key] : 0;

        item.MD[key] > 0 ?
            marginCell.style.color = "green" :
            item.MD[key] < 0 ?
                marginCell.style.color ='red' :
                marginCell.style.color ='lightgray'

        marginCell.innerText = `£${item.MD[key] ? item.MD[key].toFixed(2) : (0).toFixed(2)} | ${percentage.toFixed(0)}%`;
        if (channelPrice && toolTipData) {
            if (channelPrice > 0) {
                marginCell.onmouseover = () => {
                    tooltip(marginCell, toolTipData)
                }
                marginCell.onmouseleave = () => {
                    tooltip('close')
                }
            }
        }
    }
    return marginCell
}

function tooltip(cell, data) {
    let tooltip = document.getElementById('tooltip')
    if (data && data.length > 0) {
        tooltip.style.display = 'block'
        tooltip.style.left = `${cell.offsetLeft - document.getElementById('main').scrollLeft + 5}px`;
        tooltip.style.top = `${cell.offsetTop - document.getElementById('main').scrollTop + 22}px`;
        if (Array.isArray(data)) {
            let html = ''
            for (let v of data) html += '<div>' + v + '</div>'
            tooltip.innerHTML = html
        } else {
            tooltip.innerHTML = data;
        }
    }
    if (cell === 'close') {
        tooltip.style.display = 'none'
    }
}

function createToolTipData(incShip, price, data, vat, fees, profit){
    return incShip
        ? [
            "Selling Price: £"+price,
            "------- minus -------",
            "Purchase Price: £"+data.PURCHASEPRICE.toFixed(2),
            "Postage: £" + data.MD.POSTALPRICEUK.toFixed(2),
            "Packaging: £" + data.MD.PACKAGING.toFixed(2),
            "VAT: £" + (vat ? vat.toFixed(2) : 0),
            "Channel Fees: £" + (fees ? fees.toFixed(2) : 0),
            "------- equals -------",
            "Profit: £" + profit.toFixed(2),
        ]
        : [
            "Selling Price: £"+price,
            "------- minus -------",
            "Purchase Price: £"+data.PURCHASEPRICE.toFixed(2),
            "VAT: £" + (vat ? vat.toFixed(2) : 0),
            "Channel Fees: £" + (fees ? fees.toFixed(2) : 0),
            "------- equals -------",
            "Profit: £" + profit.toFixed(2),
        ]
}