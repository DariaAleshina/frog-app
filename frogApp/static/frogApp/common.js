const editSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/></svg>';
const deleteSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/></svg>';

const starSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/></svg>';
const starFullSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>';

const userAuthenticated = document.querySelector('#user_id_authenticated');

// card view - how many posts to load at a time for scroll
const quantity = 9;

// display Create Set Form (in a given DIV)
export function DisplayCreateSetForm(newSetDiv) {

    console.log("function DisplayCreateSetForm is called");

    // dispay NEW SET form
    const newSetForm = document.createElement('form');
    newSetForm.id = 'new_set_form';
    newSetForm.className = 'add_set_form';
    newSetForm.method='POST';
    newSetForm.action='/create_new_set';

    const newSetBlock = document.createElement('div');
    newSetBlock.className = 'form_block';

    const newSetFormLabel = document.createElement('label');
    newSetFormLabel.className = '';
    newSetFormLabel.textContent = 'Create new Set Title:';
    newSetFormLabel.for = 'newSetFormInput';

    const newSetFormInput = document.createElement('input');
    newSetFormInput.id = 'new_set_form_input';
    newSetFormInput.type = 'text';
    newSetFormInput.setAttribute('maxlength', '50');

    newSetBlock.append(newSetFormLabel, newSetFormInput);

    const newSetFormButton = document.createElement('button');
    newSetFormButton.className = 'button_add';
    newSetFormButton.textContent = 'Create';

    newSetForm.append(newSetBlock, newSetFormButton);
    newSetDiv.append(newSetForm);

}

export async function CreateSet(event) {
    event.preventDefault();

    // prepare CSRF tocken & user input
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const user_input = document.querySelector('#new_set_form_input').value;

    // prepare data for API

    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    };
    const body = JSON.stringify({
        set_name: user_input,
    });

    let response;

    try {
        response = await fetch('/create_new_set', {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`error! status: ${response.status}, message: ${errorData.error}`);
        }

        console.log(`Body: ${body}`);
        console.log("Response", await response.json());

        return response;
    } catch (error) {
        console.log("Body", body);
        console.log("Response", response);
        console.log('Error:', error);
    }
};


export function DisplayCreateCardForm(newCardDiv, setTitle) {

    console.log("function DisplayCreateCardForm is called");

    // creare form
    const newCardForm = document.createElement('form');
    newCardForm.id = 'new_card_form';
    newCardForm.className = 'add_words_form';
    newCardForm.method='POST';
    newCardForm.action='/create_new_card';

    newCardDiv.append(newCardForm);

    // creare WORD block
    const wordBlock = document.createElement('div');
    wordBlock.className = 'form_block';

    const wordLabel = document.createElement('label');
    wordLabel.className = '';
    wordLabel.textContent = 'Word or Phrase: ';
    wordLabel.for = 'wordInput';

    const wordInput = document.createElement('textarea');
    wordInput.id = 'new_card_word_input';
    wordInput.rows = 1;
    wordInput.setAttribute('maxlength', '150');
    wordInput.required = true;
    wordInput.autofocus = true;

    wordBlock.append(wordLabel, wordInput); 
    newCardForm.append(wordBlock);

    // creare TRANSLATION block
    const translationBlock = document.createElement('div');
    translationBlock.className = 'form_block';

    const translationLabel = document.createElement('label');
    translationLabel.className = '';
    translationLabel.textContent = 'Translation: ';
    translationLabel.for = 'translationInput';

    const translationInput = document.createElement('textarea');
    translationInput.id = 'new_card_translation_input';
    translationInput.rows = 1;
    translationInput.setAttribute('maxlength', '150');
    translationInput.required = true;

    translationBlock.append(translationLabel, translationInput);
    newCardForm.append(translationBlock);

    // creare EXAMPLE block (non oblogatory)
    const exampleBlock = document.createElement('div');
    exampleBlock.className = 'form_block';

    const exampleLabel = document.createElement('label');
    exampleLabel.className = '';
    exampleLabel.for = 'exampleInput';
    exampleLabel.textContent = 'Example: ';

    const exampleInput = document.createElement('textarea');
    exampleInput.id = 'new_card_example_input';
    exampleInput.rows = 1;
    exampleInput.setAttribute('maxlength', '250');

    exampleBlock.append(exampleLabel, exampleInput);
    newCardForm.append(exampleBlock);

    // creare ADD INFO block (non oblogatory)
    const addInfoBlock = document.createElement('div');
    addInfoBlock.className = 'form_block';

    const addInfoLabel = document.createElement('label');
    addInfoLabel.textContent = 'Additional Information: ';
    addInfoLabel.for = 'addInfoInput';

    const addInfoInput = document.createElement('textarea');
    addInfoInput.id = 'new_card_add_info_input';
    addInfoInput.rows = 1;
    addInfoInput.setAttribute('maxlength', '250');

    addInfoBlock.append(addInfoLabel, addInfoInput);
    newCardForm.append(addInfoBlock);

    // hidden input with SET TITLE
    const setTitleInput = document.createElement('input');
    setTitleInput.value = setTitle;
    setTitleInput.hidden = true;

    // creare SUBMIT BUTTON block
    const buttonBlock = document.createElement('div');
    buttonBlock.className = 'form_block';

    const button = document.createElement('button');
    button.textContent = 'Add';
    button.className = 'button_add';
    button.id = 'new_card_button';

    buttonBlock.append(button);
    newCardForm.append(buttonBlock);
};

export async function CreateCard(event, setTitle) {
    event.preventDefault();

    // debugging line
    console.log("Create Card function is called!!!");

    // prepare CSRF tocken & user input
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    console.log("csrftoken: ", csrftoken);

    const word = document.querySelector('#new_card_word_input').value;
    const translation = document.querySelector('#new_card_translation_input').value;
    const example = document.querySelector('#new_card_example_input').value;
    const addInfo = document.querySelector('#new_card_add_info_input').value;

    // prepare data for API
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
    };
    const body = JSON.stringify({
        word: word,
        translation: translation,
        example: example,
        addInfo: addInfo,
        setTitle: setTitle,
    });

    let response;

    try {
        response = await fetch('/create_new_card', {
            method: 'POST',
            headers: headers,
            body: body,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`error! status: ${response.status}, message: ${errorData.error}`);
        }

        response.json().then(data => {
            console.log("Response", data);
            // clear the input fields
            document.querySelector('#new_card_word_input').value = '';
            document.querySelector('#new_card_translation_input').value = '';
            document.querySelector('#new_card_example_input').value = '';
            document.querySelector('#new_card_add_info_input').value = '';
        });

        console.log(`Body: ${body}`);
        console.log("Response", await response.json());

        return response;

    } catch (error) {
        console.log("Body", body);
        console.log("Response", response);
        console.log('Error:', error);
    };

};

export function LoadCards(div, setTitle, userId) {

    // clean the div
    div.innerHTML = '';

    // create header for the block
    const header = document.createElement('div');
    header.id = 'headerCardsView';
    div.append(header);

    const cardCountDiv = document.createElement('h5');
    cardCountDiv.id = 'cardCount';

    const headerText = document.createElement('h5');
    headerText.textContent = 'terms in this FroSet';
    headerText.id = 'headerTextCardsView'
    header.append(cardCountDiv, headerText);


    // Get Cards data from DB
    fetch(`/load_cards?setTitle=${setTitle}&userId=${userId}`)
    .then(response => {
        return response.json();
    })
    .then(data => {
        // display cards
        console.log("All cards loaded from back end:", data);
        cardCountDiv.textContent = `${data.cards_count}`;
        if (data.cards_count > 0) {
            data.cards.forEach(card => loadFullCardInfo(div, card));

            // when delete card button clicked
            let cardDeleteLinks = document.querySelectorAll('.cardDeleteLink');
            cardDeleteLinks.forEach(cardDeleteLink => {
                cardDeleteLink.addEventListener('click', deleteCard);
                });

            // when edit card button clicked
            let cardEditLinks = document.querySelectorAll('.cardEditLink');
            cardEditLinks.forEach(cardEditLink => {
                cardEditLink.addEventListener('click', editCard)
            });

        } else {
            header.textContent = 'no cards added yet';
        };   
    })
    .catch(error => {
        console.error('Error uploading cards:', error);
    });
};

function loadFullCardInfo(div, card) {

    // create div for the card
    const cardDiv = document.createElement('div');
    cardDiv.className = 'cardDiv';
    cardDiv.id = `cardDiv_${card.id}`;
    div.append(cardDiv);

    // create div for word
    const wordDiv = document.createElement('div');
    wordDiv.className = 'cardDivElement1';
    wordDiv.id = `wordDiv_${card.id}`;
    wordDiv.textContent = card.word;
    cardDiv.append(wordDiv);

    // create div for translation
    const translationDiv = document.createElement('div');
    translationDiv.className = 'cardDivElement1';
    translationDiv.id = `translationDiv_${card.id}`;
    translationDiv.textContent = card.translation;
    cardDiv.append(translationDiv);

    // create div for example
    const exampleDiv = document.createElement('div');
    exampleDiv.className = 'cardDivElement1 greytext';
    exampleDiv.id = `exampleDiv_${card.id}`;
    exampleDiv.textContent = card.example;
    cardDiv.append(exampleDiv);

    // create div for add info
    const addInfoDiv = document.createElement('div');
    addInfoDiv.className = 'cardDivElement1 greytext';
    addInfoDiv.id = `addInfoDiv_${card.id}`;
    addInfoDiv.textContent = card.addInfo;
    cardDiv.append(addInfoDiv);

    if (userAuthenticated) {
        if (parseInt(userAuthenticated.innerHTML) === card.userCreatedId) {
            
            // create div for edit/delete buttons
            const editDiv = document.createElement('div');
            editDiv.className = 'cardDivElement2';
            editDiv.id = `editDiv_${card.id}`;
            cardDiv.append(editDiv);
            
            // create edit link
            const editLink = document.createElement('a');
            editLink.className = 'cardEditLink';
            editLink.href = "";
            editLink.dataset.cardId = card.id;
            editLink.innerHTML = editSVG;
            editDiv.append(editLink);
            
            // create delete link
            const deleteLink = document.createElement('a');
            deleteLink.href = "";
            deleteLink.className = 'cardDeleteLink';
            deleteLink.dataset.cardId = card.id;
            deleteLink.innerHTML = deleteSVG;
            editDiv.append(deleteLink);
        };
    };

};

export function LoadSets(div, filter) {
    console.log(`LoadSets-by-filter function is called, filter = ${filter}`);

    // Get Cards data from DB
    fetch(`/load_sets?filter=${filter}`)
    .then(response => {
        return response.json();
    })
    .then(data => {
        // display sets
        console.log("Sets info loaded from back end:", data);
        if (data.sets_count > 0) {
            data.sets.forEach(set => loadFullSetInfo(div, set));
            
            let stars = document.querySelectorAll('.setViewStar');
            if (stars) {
                stars.forEach(star => {
                    star.addEventListener('click', (event) => {
                        AddSetToStudy(event, star).then(() => {
                            if (star.dataset.starredstatus === 'true') {
                                star.dataset.starredstatus = 'false';
                                star.innerHTML = starSVG;
                            } else {
                                star.dataset.starredstatus = 'true';
                                star.innerHTML = starFullSVG;
                            };
                        });
                    });
                });
            };

        } else {
            const message = document.createElement('p');
            if (filter === 'user_own') {
                message.innerHTML = "Create your first FroSet <a href='/create'>here</a>";
            } else {
                message.innerHTML = "no FroSets available";
            };
            div.append(message);
        };   
    })
    .catch(error => {
        console.error('Error uploading Sets:', error);
    });

};

function loadFullSetInfo(div, set) {

    // create div for the set view
    const setView = document.createElement('a');
    setView.className = 'setViewDiv';
    setView.href = `/set/${set.id}`;
    div.append(setView);

    // create div for set title & star

    const setViewHeader = document.createElement('div');
    setViewHeader.className = 'setViewHeader';
    setView.append(setViewHeader);

    // create div for the set name
    const setViewName = document.createElement('div');
    setViewName.className = 'setViewName';
    setViewName.textContent = `${set.setName}`;
    setViewHeader.append(setViewName);

    // create div for star (if not user's set)
    if (userAuthenticated) {
        if (parseInt(userAuthenticated.innerHTML) != set.setCreatorId) {
            const setViewStar = document.createElement('div');
            setViewStar.className = 'setViewStar'; 
            setViewStar.dataset.setid = set.id;
            setViewStar.dataset.starredstatus = set.is_starred;
            if (set.is_starred === true) {
                setViewStar.innerHTML = starFullSVG;
            } else {
                setViewStar.innerHTML = starSVG;
            };
            setViewHeader.append(setViewStar);
        };  
    };

    // create div for the count of cards in the set
    const setViewCardCount = document.createElement('div');
    setViewCardCount.className = 'setViewCardCount';
    setViewCardCount.textContent = `${set.card_count} cards`;
    setView.append(setViewCardCount);

    // create div for the set creator (username)
    const setViewCreator = document.createElement('a');
    setViewCreator.href = `/user/${set.setCreatorId}`;
    setViewCreator.className = 'setViewCreator';
    setViewCreator.textContent = `${set.setCreator}`;
    setView.append(setViewCreator);

};

export function AddSetToStudy(event, starButton) {
    event.preventDefault();
    const set_id = starButton.dataset.setid;
    console.log(`AddSetToStudy function is called  for set ${set_id}`);

    //get tocken value
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    //prepare for fetching
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
    };
    const body = JSON.stringify({
        id: set_id
    });

    // try fetshing
    return fetch('/star_set', {
        method: 'POST',
        headers: headers,
        body: body,
    }) 
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
    })
    .catch(error => {
        console.log('Error:', error);
    });
};

function deleteCard(event) {
    event.preventDefault();
    console.log(`DELETE button is called for card ${this.dataset.cardId}`);
    
    const cardId = this.dataset.cardId;
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    //prepare for fetching
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
    };
    const body = JSON.stringify({
        id: cardId
    });

    // try fetshing
    return fetch('/delete_card', {
        method: 'POST',
        headers: headers,
        body: body,
    }) 
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        this.parentElement.parentElement.style.animationPlayState = 'running';
        this.parentElement.parentElement.addEventListener('animationend', () => {
            this.parentElement.parentElement.remove();
        });
        let new_card_count = parseInt(document.querySelector('#cardCount').textContent);
        new_card_count --;
        document.querySelector('#cardCount').textContent = `${new_card_count}`;
    })
    .catch(error => {
        console.log('Error:', error);
    });
};  


function editCard(event) {
    event.preventDefault();
    console.log(`EDIT button is called for card ${this.dataset.cardId}`);

    const cardDiv = document.querySelector(`#cardDiv_${this.dataset.cardId}`);

    // get card info data
    let word = document.querySelector(`#wordDiv_${this.dataset.cardId}`).textContent;
    let translation = document.querySelector(`#translationDiv_${this.dataset.cardId}`).textContent;
    let example = document.querySelector(`#exampleDiv_${this.dataset.cardId}`).textContent;
    let addInfo = document.querySelector(`#addInfoDiv_${this.dataset.cardId}`).textContent;
    console.log(word, translation, example, addInfo);

    // hide the card contect fields & edit & delete buttons
    document.querySelector(`#wordDiv_${this.dataset.cardId}`).style.display = 'none';
    document.querySelector(`#translationDiv_${this.dataset.cardId}`).style.display = 'none';
    document.querySelector(`#exampleDiv_${this.dataset.cardId}`).style.display = 'none';
    document.querySelector(`#addInfoDiv_${this.dataset.cardId}`).style.display = 'none';
    document.querySelector(`#editDiv_${this.dataset.cardId}`).style.display = 'none';

    //  display a form a form
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/edit_card';
    form.id = `form_${this.dataset.cardId}`;
    cardDiv.append(form);

    const new_word_input = document.createElement('textarea');
    new_word_input.className = 'cardDivElement1';
    new_word_input.setAttribute('rows', '1');
    new_word_input.placeholder = 'word or phrase';
    new_word_input.textContent = word;
    form.append(new_word_input);

    const new_translation_input = document.createElement('textarea');
    new_translation_input.className = 'cardDivElement1';
    new_translation_input.setAttribute('rows', '1');
    new_translation_input.placeholder = 'translation';
    new_translation_input.textContent = translation;
    form.append(new_translation_input);

    const new_example_input = document.createElement('textarea');
    new_example_input.className = 'cardDivElement1';
    new_example_input.setAttribute('rows', '1');
    new_example_input.placeholder = 'example';
    new_example_input.textContent = example;
    form.append(new_example_input);

    const new_add_info_input = document.createElement('textarea');
    new_add_info_input.className = 'cardDivElement1';
    new_add_info_input.setAttribute('rows', '1');
    new_add_info_input.placeholder = 'additional info';
    new_add_info_input.textContent = addInfo;
    form.append(new_add_info_input);

    const save_button = document.createElement('button');
    save_button.className = 'cardDivElement2';
    save_button.dataset.cardId = this.dataset.cardId;
    save_button.textContent = 'save';
    form.append(save_button);

    // when form is submitted

    save_button.addEventListener('click', function(event) {
        event.preventDefault();
        console.log(`SaveEditButton for post ${this.dataset.cardId} is clicked`);
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        // get new input data
        word = new_word_input.value;
        translation = new_translation_input.value;
        example = new_example_input.value;
        addInfo = new_add_info_input.value;

        const headers = {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        };
        const body = JSON.stringify({
            id: this.dataset.cardId,
            word: word,
            translation: translation,
            example: example,
            addInfo: addInfo
        });

        console.log("body:", body);

        // try fetshing
        fetch('/edit_card', {
            method: 'POST',
            headers: headers,
            body: body,
        }) 
        .then(response => response.json())
        .then(result => {
            console.log(result);
            // remove form
            form.remove();

            // set new values for card texts & unhide
            document.querySelector(`#wordDiv_${this.dataset.cardId}`).textContent = word;
            document.querySelector(`#translationDiv_${this.dataset.cardId}`).textContent = translation;
            document.querySelector(`#exampleDiv_${this.dataset.cardId}`).textContent = example;
            document.querySelector(`#addInfoDiv_${this.dataset.cardId}`).textContent= addInfo;

            document.querySelector(`#wordDiv_${this.dataset.cardId}`).style.display = 'flex';
            document.querySelector(`#translationDiv_${this.dataset.cardId}`).style.display = 'flex';
            document.querySelector(`#exampleDiv_${this.dataset.cardId}`).style.display = 'flex';
            document.querySelector(`#addInfoDiv_${this.dataset.cardId}`).style.display = 'flex';
            document.querySelector(`#editDiv_${this.dataset.cardId}`).style.display = 'flex';
        })
        .catch(error => {
            console.log('Error:', error);
        });

    });

};