import products from '../products.js'
import stockPrice from '../stock-price.js'

// Get product details
const getProductBySKU = (code) => {
    const product = products.find(product => product.skus.some((sku) => sku.code == code))

    if (product) {
        const sku = product.skus.find((sku) => sku.code == code);     
        return {
            id: product.id,
            brand: product.brand,
            sku: {
                code: sku.code,
                name: sku.name,
            },
            price: (stockPrice[code].price/ 100).toFixed(2),
            stock: stockPrice[code].stock
        };
    }  
    return product;
};

const handleGetRequest = (url) => {
    const skuCode = url.split('/').pop();
    const productInfo = getProductBySKU(skuCode);

    if (productInfo) {
        return {
            status: 200,
            body: productInfo,
        };
    }

    return {
        status: 404,
        body: 'Product not found',
    };
};

const handleRequest = (method, url) => {
    if (method === 'GET' && url.startsWith('/api/stockprice/')) {
        return handleGetRequest(url);
    }
    
    return {
        status: 404,
        body: 'Endpoint no encontrado',
    };
};

//Manage URL
function renderProducts(itemIndex){
    if(window.location.hash !== ""){

        var container = document.getElementById("main-page");
        container.classList.add("d-none");
        
        var container = document.getElementById("footer-page");
        container.classList.add("d-none");
        
        var container = document.getElementById("header-page");
        container.classList.add("d-none");
        
        var container = document.getElementById("header-product");
        container.classList.remove("d-none");
        
        var container = document.getElementById("main-product");
        container.classList.remove("d-none");

        const url = window.location.hash.slice(1);
        const separatorIndex = url.search(/\D/);
        
        const productId =  url.slice(0, separatorIndex);
        const brand = url.slice(separatorIndex);
        
        const product = products.find((producto) => producto.id == productId && producto.brand.replace(' ','').toLowerCase() == brand.toLowerCase());
        
        var container = document.getElementById('header-product')
        container.innerHTML = `
            <img src='../assets/icon-back.svg' id='back-icon'/>
            <h3>Details</h3>
            <img src='../assets/icon-dots.svg'/>`

        var back = document.getElementById("back-icon");
        back.addEventListener('click', () => {
            redirectToProduct(location.origin )
        })
        
        const productInfo = handleRequest('GET',`/api/stockprice/${product.skus[itemIndex].code}`)
        var container = document.getElementById('main-product')
        container.innerHTML = `
            <img src='${product.image}'/>
            <div>
                <div class='product-top'>
                    <div>
                        <h2>${product.brand}</h2>
                        <span>Origin: ${product.origin} | Stock: ${productInfo.body.stock}</span>
                    </div>
                    <span>$${productInfo.body.price}</span>
                </div>
                <div class='product-description'>
                    <h4>Description</h4>
                    <p>${product.information}</p>
                </div>
                <div class='product-size'>
                    <h4>Size</h4>
                    <div id='product-items'></div>
                </div>
                <div class='product-buttons'>
                    <img src='../assets/add-to-bag.svg'/>
                    <div>
                        <span>Add to cart</span>
                    </div>
                </div>
            </div>`;

            const timeoutId = setTimeout(() => {renderProducts(itemIndex)}, 5000);

            var container = document.getElementById("product-items");
            (product.skus).forEach((element,index) => {
                var card = document.createElement("div");
                card.classList.add("item-card");
                card.addEventListener('click', () => {
                    clearTimeout(timeoutId);
                    changeItem(index)
                })

                if(itemIndex === index) card.classList.add("item-selected");

                if(element.name.includes("oz") ){
                    var containerHTML = `<span>${element.name.slice(0, element.name.lastIndexOf("oz") + 2)}</span>`;
                } else {
                    var containerHTML = `<span>${element.name}</span>`;
                }
                card.innerHTML = containerHTML;
                container.appendChild(card);
            }); 
    } else {

        var container = document.getElementById("main-page");
        container.classList.remove("d-none");
        
        var container = document.getElementById("footer-page");
        container.classList.remove("d-none");
        
        var container = document.getElementById("header-page");
        container.classList.remove("d-none");
        
        var container = document.getElementById("header-product");
        container.classList.add("d-none");

        var container = document.getElementById("main-product");
        container.classList.add("d-none");

        var container = document.getElementById("populer-drinks");
    
        for (var i = 0; i < products.length; i++) {
    
            var card = document.createElement("div");
            const product = handleRequest('GET',`/api/stockprice/${products[i].skus[0].code}`)
    
            card.classList.add("card");
            card.addEventListener('click', () => {
                redirectToProduct(location.origin + '/#' + product.body.id + product.body.brand.replace(' ','').toLowerCase())
            })
    
            var containerHTML = `
                <h3>${products[i].brand}</h3>
                <img src='${products[i].image}'/>
                <h3>$${product.body.price}</h3>
                <span>+</span>`;
            
            card.innerHTML = containerHTML;
            container.appendChild(card);
        }
    }
}

function redirectToProduct(url){
    location = url
    renderProducts(0)
}

function changeItem(index){
    renderProducts(index);
}

renderProducts(0);