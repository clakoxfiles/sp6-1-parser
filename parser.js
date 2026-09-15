// formatting title function
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

// opengraph function (formatPageTitle in arguments with openGraphTitle query inside arguments of it)
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

// arguments
const pageTitle = document.querySelector('title')
const openGraphTitle = document.querySelector('meta[property="og:title"]').getAttribute('content')

// main function
function parsePage() {
    return {
        meta: parseMeta(formatPageTitle(pageTitle), formatOpenGraphTags(formatPageTitle(openGraphTitle))),
        product: {},
        suggested: [],
        reviews: []
    };
}

window.parsePage = parsePage;