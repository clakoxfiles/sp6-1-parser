// formatting meta title function
function formatPageTitle(query) {
    let pageTitleRaw = query
    if (typeof pageTitleRaw === 'string') {
        pageTitleRaw = pageTitleRaw.split('—')  
        return pageTitleRaw[0].trim() 
    } else {
        pageTitleRaw = pageTitleRaw.textContent.split('—')
        return pageTitleRaw[0].trim()
    }
}

// opengraph meta function (formatPageTitle in arguments with openGraphTitle query inside arguments of it)
function formatOpenGraphTags(formatPageTitle) {
    const title = document.querySelector('meta[property="og:title"]').getAttribute('property').replaceAll('og:', '')
    const image = document.querySelector('meta[property="og:image"]').getAttribute('property').replaceAll('og:', '')
    const type = document.querySelector('meta[property="og:type"]').getAttribute('property').replaceAll('og:', '')

    const imageContent = document.querySelector('meta[property="og:image"]').getAttribute('content')
    const typeContent = document.querySelector('meta[property="og:type"]').getAttribute('content')

    return {
        [title]: formatPageTitle,
        [image]: imageContent,
        [type]: typeContent,
    }
}

// product images array function
function getImagesArray() {
    const imagesContainer = document.querySelectorAll('.product nav button img')
    const array = []
    imagesContainer.forEach(el => {
        const preview = el.getAttribute('src')
        const full = el.getAttribute('data-src')
        const alt = el.getAttribute('alt')

        array.push( {preview, full, alt} )
    })

    return array
}


// product tags function. (green - category, blue - label, red - discount.)
function getTags() {
    const category = document.querySelector('.tags .green').textContent.split(', ')
    const label = document.querySelector('.tags .blue').textContent.split(', ')
    const discount = document.querySelector('.tags .red').textContent.split(', ')

    return {
        category,
        label,
        discount,
    }
}

// product discount percent
function getDiscountPercent(price1, price2) {
    const discount = price2 - price1
    const percent = (discount / price2) * 100

    return `${percent.toFixed(2)}%`
}

// product currency
function getCurrency(symbolsArr) {
    if (symbolsArr[0] === '₽') {
        return 'RUB'
    }  else if (symbolsArr[0] === '$') {
        return 'USD'
    }  else if (symbolsArr[0] === '€') {
        return 'EUR'
    }  else {
        'Неизвестная валюта.'
    }
}

// formatting product properties
function formatProperties() {
    const list = document.querySelectorAll('.properties li')
    const properties = {}

    list.forEach(el => {
        const key = el.firstElementChild.textContent
        const value = el.lastElementChild.textContent

        properties[key] = value
    })
    
    return properties
}

// formatting product description
function formatDescription() {
    const descriptionContainer = document.querySelector('.description')

    if (descriptionContainer.firstElementChild.hasAttribute('class')) {
        descriptionContainer.firstElementChild.removeAttribute('class')
    }

    return `${descriptionContainer.innerHTML.trim()}`
}

// meta function
function parseMeta(formatPageTitle, formatOpenGraphTags) {
    const description = document.querySelector('meta[name="description"]').getAttribute('content')
    const keywords = document.querySelector('meta[name="keywords"]').getAttribute('content').split(',')
    const language = document.querySelector('html').getAttribute('lang')
    
    return {
        title: formatPageTitle,
        description: description,
        keywords: keywords,
        language: language,
        opengraph: formatOpenGraphTags,
    }
}

// product function
function parseProduct(getImagesArray, getTags, formatProperties, formatDescription) {
    const productId = document.querySelector('.product').getAttribute('data-id')
    const isLiked = document.querySelector('.like')
    const name = document.querySelector('h1').textContent
    const prices = document.querySelector('.price').textContent.replaceAll(' ', '').replaceAll('₽', '').replaceAll('$', '').replaceAll('€', '').trim().split('\n')
    const currency = document.querySelector('.price').textContent.replaceAll(' ', '').trim().split('')

    return {
        id: productId,
        images: getImagesArray,
        isLiked: isLiked.classList.contains('active'),
        name,
        tags: getTags,
        price: +prices[0],
        oldPrice: +prices[1],
        discount: +prices[1] - +prices[0],
        discountPercent: getDiscountPercent(prices[0], prices[1]),
        currency: getCurrency(currency),
        properties: formatProperties,
        description: formatDescription,
    }
}

// suggested products function
function parseSuggested() {
    const items = document.querySelectorAll('.suggested .items article')
    const formattedItemsArray = []

    items.forEach(el => {
        const image = el.querySelector('img').getAttribute('src')
        const name = el.querySelector('h3').textContent
        const description = el.querySelector('p').textContent
        const price = el.querySelector('b').textContent.replaceAll('₽', '').replaceAll('$', '').replaceAll('€', '')
        
        const priceSymbolsArray = el.querySelector('b').textContent.split('')
        const currency = getCurrency(priceSymbolsArray)

        formattedItemsArray.push( {image, name, description, price, currency} )
    })

    return formattedItemsArray
}

// reviews function
function parseReviews() {

}

// arguments
const pageTitle = document.querySelector('title')
const openGraphTitle = document.querySelector('meta[property="og:title"]').getAttribute('content')

// main function
function parsePage() {
    return {
        meta: parseMeta(formatPageTitle(pageTitle), formatOpenGraphTags(formatPageTitle(openGraphTitle))),
        product: parseProduct(getImagesArray(), getTags(), formatProperties(), formatDescription()),
        suggested: parseSuggested(),
        reviews: parseReviews(),
    };
}

window.parsePage = parsePage;