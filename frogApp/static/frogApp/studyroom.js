import { LoadSets } from "./common.js";

document.addEventListener('DOMContentLoaded', function() {

    const user_current_id = document.querySelector('#user_id_authenticated').textContent;
    const studyroomDiv = document.querySelector('#studyroom');

    const buttonFilterAll = document.querySelector('#buttonFilterAll');
    const buttonFilterOwn = document.querySelector('#buttonFilterOwn');
    const buttonFilterOther = document.querySelector('#buttonFilterOther');

    buttonFilterAll.addEventListener('click', (event) => {
        buttonFilterAll.className = 'button_filter_active';
        buttonFilterOwn.className = 'button_filter_inactive';
        buttonFilterOther.className = 'button_filter_inactive';
        
        studyroomDiv.innerHTML = '';
        LoadSets(studyroomDiv, 'user_all');
    });

    buttonFilterOwn.addEventListener('click', (event) => {
        buttonFilterAll.className = 'button_filter_inactive';
        buttonFilterOwn.className = 'button_filter_active';
        buttonFilterOther.className = 'button_filter_inactive';
        
        studyroomDiv.innerHTML = '';
        LoadSets(studyroomDiv, 'user_own');
    });

    buttonFilterOther.addEventListener('click', (event) => {
        buttonFilterAll.className = 'button_filter_inactive';
        buttonFilterOwn.className = 'button_filter_inactive';
        buttonFilterOther.className = 'button_filter_active';

        studyroomDiv.innerHTML = '';
        LoadSets(studyroomDiv, 'user_starred');
    });

    // by default 
    LoadSets(studyroomDiv, 'user_all');


});