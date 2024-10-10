import { LoadSets } from "./common.js";

document.addEventListener('DOMContentLoaded', function() {
    const user_current = document.querySelector('#user_id_authenticated');
    const popularBlock = document.querySelector('#popular_block');
    const userBlock = document.querySelector('#user_block');

    if (user_current) {
        const user_current_id = document.querySelector('#user_id_authenticated').textContent;

        LoadSets(userBlock, 'user_own');
        LoadSets(popularBlock, 'user_popular');

    } else {
        LoadSets(popularBlock, 'all_popular');
    };

});