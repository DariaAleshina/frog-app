import { LoadCards, DisplayCreateCardForm, CreateCard, AddSetToStudy } from "./common.js";
import { DispayCarousel } from "./flippingcards.js";


// star button imgs
const starSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg>';
const starFullSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>';

const cardsViewDiv = document.querySelector('#cardsView');
const carouselViewDiv = document.querySelector('#carouselView');
const userCreatedSetId = document.querySelector('#user_created_id').textContent;
const setTitle = document.querySelector('#set_name').textContent;
const buttonLearn = document.querySelector('#buttonLearn');
const buttonAddCards = document.querySelector('#buttonAddCards');
const starButton = document.querySelector('#starButton');

const authenticatedUser = document.querySelector('#user_id_authenticated');

document.addEventListener('DOMContentLoaded', function() {

    if (authenticatedUser) {
        
        // STAR BUTTON - display 
        if (starButton) {
            console.log("starredstatus: ", starButton.dataset.starredstatus);
            
            if (starButton.dataset.starredstatus == 'True') {
                starButton.innerHTML = starFullSVG;
            } else {
                starButton.innerHTML = starSVG;
            };
            
            starButton.addEventListener('click', (event) => 
                AddSetToStudy(event, starButton).then(() => {
                    if (starButton.dataset.starredstatus === 'True') {
                        starButton.innerHTML = starSVG;
                        starButton.dataset.starredstatus = 'False';
                    } else {
                        starButton.innerHTML = starFullSVG;
                        starButton.dataset.starredstatus = 'True';
                    };
                }));
        };


        // carousel div
        // to-do add default load of Carousel
        DispayCarousel(carouselViewDiv, setTitle, userCreatedSetId);

        // when button LEARN clicked
        if (buttonLearn) {
            buttonLearn.addEventListener('click', (event) => {
                event.preventDefault();
                
                if (buttonLearn.className == 'button_filter_active') {
                    buttonLearn.className = 'button_filter_inactive';
                    carouselViewDiv.innerHTML = '';
                    carouselViewDiv.className = '';
                } else {
                    buttonLearn.className = 'button_filter_active';
                    if (buttonAddCards) {
                        buttonAddCards.className = 'button_filter_inactive';
                    };
                    carouselViewDiv.innerHTML = '';
                    carouselViewDiv.className = '';
                    DispayCarousel(carouselViewDiv, setTitle, userCreatedSetId);
                };
            });
        };

        // ADD CARDS section
        if (buttonAddCards) {
            buttonAddCards.addEventListener('click', (event) => {
                event.preventDefault();

                if (buttonAddCards.className == 'button_filter_active') {
                    buttonAddCards.className = 'button_filter_inactive';
                    carouselViewDiv.innerHTML = '';
                    carouselViewDiv.className = '';
                } else {
                    buttonAddCards.className = 'button_filter_active';
                    buttonLearn.className = 'button_filter_inactive';
    
                    carouselViewDiv.innerHTML = '';
                    carouselViewDiv.className = 'newCard';
        
                    DisplayCreateCardForm(carouselViewDiv, setTitle);
                    // when submited - save the word
                    const newCardForm = document.querySelector('#new_card_form');
                    if (newCardForm) {
                        console.log('card form has been loaded');
                        newCardForm.addEventListener('submit', (event) => {
                            CreateCard(event, setTitle).then(() => {
                                // when submited - load the cards below
                                LoadCards(cardsViewDiv, setTitle, userCreatedSetId);
                            });
                        });
                    };
                }; 
            });
        };
    };

    // card div
    LoadCards(cardsViewDiv, setTitle, userCreatedSetId);

});
