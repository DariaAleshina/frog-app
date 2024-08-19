import { loadPosts } from "./common.js";

document.addEventListener('DOMContentLoaded', function() {
    const filter_url = document.querySelector('#filter_url').textContent;
    console.log(`Filter is: ${filter_url}`)
    
    let page = 1;
    loadPosts(filter_url, page);
});

