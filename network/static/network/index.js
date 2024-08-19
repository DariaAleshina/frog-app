import { loadPosts, savePost } from "./common.js";

document.addEventListener('DOMContentLoaded', function() {
    

    const new_post_block = document.querySelector('#block_1_create');
    const new_post_form = document.querySelector('#new_post_form');

    //by default - load the NEW POST form (is user is authenticated)
    if (new_post_block) {

        document.querySelector('#form_post_text').value = '';
        console.log('the NEW_POST_FORM is loaded');
    
        //CREATE NEW POST when button of clicked
        new_post_form.addEventListener('submit', (event) => {
            savePost(event).then(() => {
                document.querySelector('#form_post_text').value = '';
                loadPosts('all');
            });
        });
    };

    // load all posts (as default)
    let page = 1;
    loadPosts('all', page);
});

