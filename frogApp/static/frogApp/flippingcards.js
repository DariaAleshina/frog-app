const userAuthenticated = document.querySelector('#user_id_authenticated');

export function DispayCarousel(div, setTitle, userId) {
    console.log('DispayCarousel function is called');

    // clean the div
    div.innerHTML = '';
    div.className = 'wordcards_block';

    // Get Cards data from DB
    fetch(`/load_cards?setTitle=${setTitle}&userId=${userId}`)
    .then(response => {
        return response.json();
    })
    .then(data => {
        // display cards
        console.log("cards for Carousel loaded from back end:", data);
        if (data.cards_count > 0) {
            // display cards
            DisplayFlippingCards(div, data.cards);
            const flipCards = document.querySelectorAll('.flip-card');

            // add the flipping animation on click
            flipCards.forEach(flipCard => {
                flipCard.addEventListener('click', () => {
                    const innerCard = flipCard.querySelector('.flip-card-inner');
                    innerCard.style.transform = innerCard.style.transform === 'rotateY(180deg)' ? 'rotateY(0deg)' : 'rotateY(180deg)';
                });
            });
        };   
    })
    .catch(error => {
        console.error('Error uploading cards:', error);

    });

};

function DisplayFlippingCards(div, cards) {
    console.log('DisplayFlippingCards function is called');

    // left-arrow
    const arrowLeft = document.createElement('button');
    arrowLeft.className = 'prev-card-btn';
    arrowLeft.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#8ED9C1" class="bi bi-arrow-left-circle" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/></svg>';
    div.append(arrowLeft);

    // flipping cards
    const cardListDiv = document.createElement('div');
    cardListDiv.className = 'card-list';
    div.append(cardListDiv);

    // draw a card for each word
    cards.forEach(card => {

        const flipCardDiv = document.createElement('div');
        flipCardDiv.className = 'flip-card';
        cardListDiv.append(flipCardDiv);

        const flipCardInnerDiv = document.createElement('div');
        flipCardInnerDiv.className = 'flip-card-inner';
        flipCardDiv.append(flipCardInnerDiv);

        // side 1
        const side1 = document.createElement('div');
        side1.className = 'flashcard-side1';
        flipCardInnerDiv.append(side1);

        // side 1 - word
        const word = document.createElement('p');
        word.className = 'card-word';
        word.textContent = card.word;
        side1.append(word);

        // side 2
        const side2 = document.createElement('div');
        side2.className = 'flashcard-side2';
        flipCardInnerDiv.append(side2);

        // side 2 - translation
        const translationDiv = document.createElement('div');
        translationDiv.className = 'flashcard-side2-translation';
        side2.append(translationDiv);

        const translation = document.createElement('p');
        translation.className = 'card-translation';
        translation.textContent = card.translation;
        translationDiv.append(translation);

        // side 2 - example
        const exampleDiv = document.createElement('div');
        exampleDiv.className = 'flashcard-side2-infoblock';
        side2.append(exampleDiv);

        const example = document.createElement('p');
        example.className = 'card-example';
        example.textContent = card.example;
        exampleDiv.append(example);

        // side 2 - add info
        const addInfoDiv = document.createElement('div');
        addInfoDiv.className = 'flashcard-side2-infoblock';
        side2.append(addInfoDiv);

        const addInfo = document.createElement('p');
        addInfo.className = 'card-addinfo';
        addInfo.textContent = card.addInfo;
        addInfoDiv.append(addInfo);

    });

    // right-arrow
    const arrowRight = document.createElement('button');
    arrowRight.className = 'next-card-btn';
    arrowRight.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#8ED9C1" class="bi bi-arrow-right-circle" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/></svg>';
    div.append(arrowRight);

    // scroll animation
    const card_itemWidth = 600;
    const card_padding = 0;

    arrowLeft.addEventListener('click',()=>{
        cardListDiv.scrollLeft -= (card_itemWidth + card_padding)
    });
    
    arrowRight.addEventListener('click',()=>{
        cardListDiv.scrollLeft += (card_itemWidth + card_padding)
    });

};