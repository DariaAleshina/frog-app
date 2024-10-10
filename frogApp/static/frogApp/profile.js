import { LoadCards, DisplayCreateCardForm, CreateCard, AddSetToStudy, LoadSets } from "./common.js";

document.addEventListener('DOMContentLoaded', function() {


    const profile_user_id = parseInt(document.querySelector('#user_profile_id').textContent);
    const set_block = document.querySelector('#set_block');

    LoadSets(set_block, `profile_${profile_user_id}`);

});