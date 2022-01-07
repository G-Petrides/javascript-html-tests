const puppeteer = require('puppeteer');
const https = require('https');

let merge = []
let urls = []

const run = (queue) => {
    let length = queue.length
    return new Promise(function(resolve) {
        function runQueue() {
                if(queue[0]) {
                    queue[0]().then(() => {
                        queue.shift();
                        if (queue.length > 0) {
                            console.log(`${queue.length}/${length}`)
                            setTimeout(()=>{
                                runQueue(queue.length);
                            },500/*(Math.random() * 5000) + 3000*/)
                        } else {
                            resolve(true);
                        }
                    });
                } else {
                    resolve(true);
                }
        }
        runQueue();
    })
}

function getLocations(data){
    return new Promise(resolve => {
        let arr = data.replaceAll("<loc>", "|").replaceAll("</loc>", "|").split("|")
        let results = []
        for( let val of arr){
            if(val.startsWith("https://www.anglingdirect.co.uk")){
                results.push(val)
            }
        }
        resolve(results);
    })
}

function getSubSitemap(url){
    console.log(`getting urls for ${url}`)
    return new Promise(resolve => {
        https.get(url, function (res) {
            let data
            if (res.statusCode >= 200 && res.statusCode < 400) {
                res.on('data', function (data_) {
                    data += data_.toString();
                });
                res.on('end', function () {
                    getLocations(data).then((results) => {
                        urls = urls.concat(results)
                        resolve()
                    })
                })
            }
        }).on('error', function (e) {
            console.log("Got error: " + e.message);
            resolve()
        })
    })
}

/*
https.get("https://www.anglingdirect.co.uk/sitemap/sitemap.xml", function(res) {
    let data
    if (res.statusCode >= 200 && res.statusCode < 400) {
        res.on('data', function (data_) {
            data += data_.toString();
        });
        res.on('end', function () {
            getLocations(data).then(results => {
                let promises = []
                for (let url of results) {
                    promises.push(async ()=>{
                        await getSubSitemap(url)
                    })
                }
                run(promises).then(()=>{
                    let filter = urls.filter(url => url.split("/").length <= 4);
                    console.log(filter)
                })
            })
        })
    }
}).on('error', function(e) {
    console.log("Got error: " + e.message);
})
*/
/*
https.get("https://www.anglingdirect.co.uk/sitemap/sitemap-5-4.xml", function(res) {
    let data
    if (res.statusCode >= 200 && res.statusCode < 400) {
        res.on('data', function(data_) { data += data_.toString(); });
        res.on('end', function() {


            (async () => {
                const browser = await puppeteer.launch();
                const page = await browser.newPage();

                let queue = []
                for(let url of results){
                    queue.push(async ()=>{await getUrl(page, url)})
                }
                run(queue).then(()=>{
                    browser.close();
                })
            })()

        });
    }
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});
*/

async function testGet(results){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let queue = []
    for(let url of results){
        queue.push(async ()=>{await getUrl(page, url)})
    }
    run(queue).then(()=>{
        browser.close();
        console.log(merge)
    })
}

const testUrls = [
        'https://www.anglingdirect.co.uk/coarse-match-fishing-tackle',
        'https://www.anglingdirect.co.uk/sea-fishing-tackle',
        'https://www.anglingdirect.co.uk/fly-fishing-tackle',
        'https://www.anglingdirect.co.uk/pike-fishing-tackle',
        'https://www.anglingdirect.co.uk/specialist-fishing-tackle',
        'https://www.anglingdirect.co.uk/big-game',
        'https://www.anglingdirect.co.uk/fishing-tackle-brands',
        'https://www.anglingdirect.co.uk/fishing-tackle',
        'https://www.anglingdirect.co.uk/daiwa-wilderness-blob-selection',
        'https://www.anglingdirect.co.uk/daiwa-wilderness-booby-selection',
        'https://www.anglingdirect.co.uk/daiwa-carp-keepnet-with-bag',
        'https://www.anglingdirect.co.uk/daiwa-chartreuse-supertinsel',
        'https://www.anglingdirect.co.uk/daiwa-long-top-two-cupping-kit',
        'https://www.anglingdirect.co.uk/daiwa-d2500-spinning-reel'
    ]

testGet(testUrls)

const getUrl = async (page, url) => {
    try {
        await page.goto(url);
        let models = await page.$$eval('.product-item-model', models => models.map(models => models.textContent));
        if (models.length === 0) models = await page.$$eval('div.product.attribute.man_code > div', models => models.map(models => models.innerHTML));
        let title = await page.$eval('div.page-title-wrapper.product > h1 > span', prices => prices.textContent);
        let prices = await page.$$eval('.price', prices => prices.map(prices => prices.textContent));
        let qty = await page.$$eval('td.col.qty.align-center', prices => prices.map(prices => prices.innerHTML));

        if (qty.length === 0) {
            qty = await page.evaluate(() => {
                let ele = document.querySelector('div.product.alert.stock')
                return ele ? ["Out of stock"] : ["In stock"];
            });
        } else {
            for (let i in qty) {
                if (qty[i].indexOf("Out of stock") !== -1) {
                    qty[i] = "Out of stock"
                } else {
                    qty[i] = "In stock"
                }
            }
        }

        for (let i in models) {
            merge.push({sku: models[i], title: title, price: prices[i], stock: qty[i], address: url, product:true})
        }
    } catch(e){
        merge.push({address: url, product:false})
    }
};