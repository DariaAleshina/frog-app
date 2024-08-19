import { loadPosts, loadFullPostInfo, savePost } from "./common.js";

document.addEventListener('DOMContentLoaded', function() {
    
    //by default - load the NEW POST form (is user is authenticated)
    const new_post_block = document.querySelector('#block_1_create');
    const new_post_form = document.querySelector('#new_post_form');

    if (new_post_block) {

        document.querySelector('#form_post_text').value = '';
        console.log(`the NEW_POST_FORM is loaded: ${new_post_form}`);
    
        //CREATE NEW POST when button of clicked
        new_post_form.addEventListener('submit', (event) => {
            savePost(event).then(() => {
                loadPosts('all');
            });
        });
    };

    
    // Use buttons to toggle between Index, All posts and Following views
    const all = document.querySelector('#all-posts-nav-link');
    const following = document.querySelector('#following-nav-link');
    const main_page = document.querySelector('#mail-page-nav-link');

    all.addEventListener('click', () => {
        if (new_post_block) {
            new_post_block.style.display = 'none';
        }
        loadPosts('all');
    });

    following.addEventListener('click', () => {
        if (new_post_block) {
            new_post_block.style.display = 'none';
        }
        loadPosts('following');
    });

    main_page.addEventListener('click', () => {
        if (new_post_block) {
            new_post_block.style.display = 'block';
        }
        loadPosts('all');
    });


    //by default - load the ALL POSTS 
    loadPosts('all');
});

