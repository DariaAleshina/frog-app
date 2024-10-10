import { DisplayCreateSetForm, CreateSet, DisplayCreateCardForm, CreateCard, LoadCards } from "./common.js";

document.addEventListener('DOMContentLoaded', function() {

    const user_current_id = document.querySelector('#user_id_authenticated').textContent;
    console.log("user_current_id: ", user_current_id);
    
    const newSetDiv = document.querySelector('#newSet');
    const newCardDiv = document.querySelector('#newCard');
    const cardsView = document.querySelector('#cardsView');

    // display NewSetForm
    DisplayCreateSetForm(newSetDiv);
    
    // when submit button is clicked 
    const newSetForm = document.querySelector('#new_set_form');
    const newSetFormInput = document.querySelector('#new_set_form_input');
    if (newSetForm) {
        newSetForm.addEventListener('submit', (event) => {
            CreateSet(event).then(() => {
                // hide the form
                const setTitle = newSetFormInput.value;
                newSetForm.style.display = "none";
                // dispay new title
                const setTitleHeading = document.createElement('h3');
                setTitleHeading.textContent = setTitle;
                newSetDiv.append(setTitleHeading);

                // dispay the new card form 
                DisplayCreateCardForm(newCardDiv, setTitle);

                // when submited - save the word
                const newCardForm = document.querySelector('#new_card_form');
                if (newCardForm) {
                    console.log('card form has been loaded');
                    newCardForm.addEventListener('submit', (event) => {
                        CreateCard(event, setTitle).then(() => {
                            // when submited - load the cards below
                            LoadCards(cardsView, setTitle, user_current_id);
                        });

                       

                    }); 
                };

            });
        });

    };

});