import { loadPosts, FollowFunction, Edit } from "./common.js";

document.addEventListener('DOMContentLoaded', function() {
    const follow_button = document.querySelector('#follow_button');
    const follow_form = document.querySelector('#follow_form');

    if (follow_form) {
        follow_form.addEventListener('submit', (event) => {
            FollowFunction(event).then(() => {
                if (follow_button.innerHTML === 'Follow') {
                    follow_button.innerHTML = 'Unfollow';
                } else {
                    follow_button.innerHTML = 'Follow';
                };
            });
        });
    };

    //edit buttion if clicked if any
    // let edit_links = document.querySelectorAll('.edit_link');
    // if (edit_links) {
    //     edit_links.forEach(edit_link => {
    //         edit_link.addEventListener('click', Edit);
    //     });
    // };

    const filter_url = document.querySelector('#filter_url').textContent;
    console.log(`Filter is: ${filter_url}`);

    let page = 1;
    loadPosts(filter_url, page);

});