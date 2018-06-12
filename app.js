const apiKey = "9e6b0c26d65248b49077dffff13183fe";
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = "buzzfeed";

window.addEventListener('load', async e => {
    updateNews();
    await updateSources();
    sourceSelector.value = defaultSource;
    sourceSelector.addEventListener('change', e => {
      updateNews(e.target.value);
    });

    if('serviceWorker' in navigator) {
      try {
        navigator.serviceWorker.register('sw.js');
        console.log('Service Worker registered');
      } catch (error) {
        console.log("Service Worker registration failed");        
      }
    }
});

async function updateNews(source = defaultSource) {
    const res = await fetch(`https://newsapi.org/v2/top-headlines?sources=${source}&apiKey=${apiKey}`);
    const json = await res.json();

    main.innerHTML = json.articles.map(createArticle).join('\n');
}

async function updateSources() {
    const res = await fetch(`https://newsapi.org/v2/sources?apiKey=${apiKey}`)
    const json = await res.json();

    sourceSelector.innerHTML = json.sources
      .map(src => `<option value="${src.id}">${src.name}</option>`)
      .join('\n');
}

function createArticle(article) {
    return `
    <div class="article">
      <a href="${article.url}">
        <h2>${article.title}</h2>
        <img src="${article.urlToImage}" alt="${article.title}">
        <p>${article.description}</p>
      </a>
    </div>
  `;
}