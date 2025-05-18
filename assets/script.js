let game;

let count = 0; // count number of matches each game
let randomizedArr;
let curCategory;
let curCategoryCount;
let draggedItemId;
let draggedItemParent;
let autoplay = true;
let loop = true;

const headerEl = document.querySelector('header');
const categoryWrapperEl = document.querySelector('.categories');
const categoryEl = document.querySelectorAll('.category');
const gameContainerWrapperEl = document.querySelector('.gameContainer');
const gameBoardContainerWrapperEl = document.querySelector('.gameBoardContainer');
const popupWrapperEl = document.getElementById('popup');
const messageEl = document.getElementById('message');
const categoryItemsWrapperEl = document.querySelector('.categoryItems');
const categoryItemEl = document.querySelectorAll('.categoryItem');
let categoryItemImageEl;
const matchingItemsWrapperEl = document.querySelector('.matchingItems');
const matchingItemEl = document.querySelectorAll('.matchingItem');
const audioEl = document.getElementById('myAudio');
const checkboxEl = document.getElementById('checkbox');
const resetBtn = document.querySelector('.resetBtn');

resetBtn.addEventListener('click', (e) => {
    resetBoard(false);
});

checkboxEl.checked = true;
checkboxEl.addEventListener('click', (e) => {
    if (checkboxEl.checked) {
        autoplay = true;
        loop = true;
    } else {
        autoplay = false;
        loop = false;
    }
    audioEl.autoplay = autoplay;
    audioEl.loop = loop;
});

class Categories {
    static categoriesLookup = {
        '0': {category: 'NUMBERS', count: 9},
        '1': {category: 'ALPHABETS', count: 26},
        '2': {category: 'FRUITS', count: 9},
        '3': {category: 'SHAPES', count: 9},
        '4': {category: 'ANIMALS', count: 9},
        '5': {category: 'VEHICLES', count: 9},
        '6': {category: 'BABY SHARK', count: 9},
        '7': {category: 'PINKFONG WONDERSTAR', count: 9},
        '8': {category: 'ELMO & FRIENDS', count: 9},
        '9': {category: 'BLUEY', count: 37},
        '10': {category: 'POKÉMON', count: 1010},
        '11': {category: 'PAW PATROL', count: 11}
    }
    constructor(domElements, domWrapperEl, count) {
        this.domElements = domElements;
        this.domWrapperEl = domWrapperEl;
        this.domWrapperEl.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() === 'button') {
                e.target.parentNode.querySelectorAll('button').forEach(e => e.style.pointerEvents = 'auto');
                e.target.style.pointerEvents = 'none';

                resetBoard(true);

                curCategory = e.target.innerText.toLowerCase();
                curCategoryCount = e.target.getAttribute('data-count');
                this.category = curCategory;
                this.count = curCategoryCount;

                myAudio.volume = '0.2';
                myAudio.src = `assets/sounds/${this.category}.mp3`;

                categoryEl.forEach(e => e.classList.remove('focusCategory'));
                e.target.classList.toggle('focusCategory');

                initializeOptions(categoryItemEl, this.category, this.count);
                initializeOptions(matchingItemEl, this.category, this.count);
            }
        });
        this.render();
    }
    reset() {
        categoryEl.forEach(e => e.classList.remove('focusCategory'));
    }
    render() {
        let rgb;
        rgb = getRandomRgb();
        headerEl.style.textShadow = '0.5vmin 0.5vmin 0.5vmin ' + rgb;
        categoryWrapperEl.style.borderColor = rgb;
        this.domElements.forEach((element, index) => {
            element.innerText = Categories.categoriesLookup[index].category;
            element.setAttribute('data-count', Categories.categoriesLookup[index].count);
        });
    }
}

class Options {
    constructor(domElements, category, count) {
        this.domElements = domElements;
        this.category = category;
        this.count = count;
        this.render();
    }
    randomize(array) {
        let currentIndex = array.length
        let randomIndex;
        while (currentIndex !== 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
        
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        return array;
    }
    initialize() {
        const category = null;
        randomizedArrHolder = null;
        this.domElements.forEach((e) => {
            e.innerHTML = '';
            myAudio.innerHTML = 'Your browser does not support the audio element.';
            e.style.pointerEvents = 'auto';
            e.removeEventListener('drop', handleDrop);
            e.removeEventListener('dragover', handleDragOver);
            e.removeEventListener('dragenter', handleDragEnter);
            e.removeEventListener('dragleave', handleDragLeave);
            e.removeEventListener('dragstart', handleDragStart);
            e.removeEventListener('dragend', handleDragEnd);
            e.removeEventListener('mousedown', handleMouseDown);
            e.removeAttribute('data-id');
        });
    }
    render() {
        let randomizedArr;
        let array;
        const category = this.category;

        const n = this.count;
        if (n !== undefined) {
            if(this.domElements[0].classList.contains('categoryItem')) {
                array = Array.from({length: n}, (_, i) => i + 1);
                randomizedArr = this.randomize(array);
                randomizedArrHolder = randomizedArr;
            }
            if (this.domElements[0].classList.contains('matchingItem')) {
                randomizedArrHolder = this.randomize(randomizedArrHolder.slice(0, 9));
            }
        }

        matchingItemEl.forEach((e) => {
            e.addEventListener('drop', handleDrop);
            e.addEventListener('dragover', handleDragOver);
            e.addEventListener('dragenter', handleDragEnter);
            e.addEventListener('dragleave', handleDragLeave);
        });


        this.domElements.forEach((element, index) => {
            if (category !== undefined && count !== undefined) {
                fillImages(element, category, randomizedArrHolder[index]);
            } 
        });
    }
}

class MatchingGame {
    constructor(categoryItemsWrapperEl, matchingItemsWrapperEl) {
        this.categoryItemsWrapperEl = categoryItemsWrapperEl;
        this.matchingItemsWrapperEl = matchingItemsWrapperEl;
        this.categoryItemValue = null;
        this.matchingItemValue = null;
    }
    reset() {
        const categoryItemsArray = [...this.categoryItemsWrapperEl.children];
        categoryItemsArray.forEach(e => e.style.display = 'inline-block');
        const matchingItemsArray = [...this.matchingItemsWrapperEl.children];
        matchingItemsArray.forEach(e => e.classList.remove('focusMatchesCorrect', 'focusMatches'));
    }
}

function getRandomRgb(opacity = 1) {
    const num = Math.round(0xffffff * Math.random());
    const r = num >> 16;
    const g = num >> 8 & 255;
    const b = num & 255;
    return 'rgb(' + r + ', ' + g + ', ' + b + ', ' + opacity + ')';
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    this.classList.add('focusMatches');
}

function handleDragLeave(e) {
    this.classList.remove('focusMatches');
}
  
function handleDragStart(e) {
    draggedItemParent = document.getElementById(e.target.id).parentElement;
    this.style.opacity = '0.4';
    // e.dataTransfer.setData('text', e.target.id);
    draggedItemId = e.target.id;
}

function handleDragEnd(e) {
    this.style.opacity = '1';
    this.style.transition = '1s';
}
  
function handleDrop(e) {
    e.preventDefault();
    // const data = e.dataTransfer.getData('text');
    const data = draggedItemId;
    let id = data.replace(/\D/g, '');

    if (e.target.getAttribute('data-id') === id) {
        e.target.appendChild(document.getElementById(data));
        e.target.classList.add('focusMatchesCorrect');
        let correct = new Audio('assets/sounds/correct.mp3');
        correct.volume = 0.2;
        correct.play();
        draggedItemParent.style.display = 'none';
        this.style.pointerEvents = 'none';
        for (const child of this.children) {
            child.style.pointerEvents = 'none';
        }
        count++;
    } else {
        let oof = new Audio('assets/sounds/oof.mp3');
        oof.volume = 0.2;
        oof.play();
        e.target.classList.add('focusMatchesWrong');
        setTimeout(() => { 
            e.target.classList.remove('focusMatches');
            e.target.classList.remove('focusMatchesWrong');
        }, 1000);
    }

    if (count === 1) {
        resetBtn.innerText = 'Reset';
    }

    if (count === 9) {
        const winningMessage = ["YOU WIN!!", "YAY!!", "WOOHOO!", "YOU DID IT!", "GOOD JOB!"];
        const random = Math.floor(Math.random() * winningMessage.length);
        messageEl.innerHTML = `<span id="winningMessage">${winningMessage[random]}</span>`;
        popupWrapperEl.style.display = 'block';
        setTimeout(() => {
            popupWrapperEl.style.display = 'none';
        }, 1500);

        let clapping = new Audio('assets/sounds/clapping.mp3');
        clapping.volume = 0.2;
        clapping.play();
    }
}

function handleMouseDown(e) {
    window.getSelection().removeAllRanges();
}

initializeGame();

function initializeGame() {
    gameContainerWrapperEl.style.visibility = 'hidden';
    const categories = new Categories(categoryEl, categoryWrapperEl);
    game = new MatchingGame(categoryItemsWrapperEl, matchingItemsWrapperEl);
}

function resetCategories(buttons, domWrapperEl) {
    new Categories(buttons, domWrapperEl).reset();
}

function initializeOptions(buttons, category, count) {
    const options = new Options(buttons, category, count);
    if (category !== null && count !== null) {
        options;
        categoryItemImageEl = document.querySelectorAll('.categoryItemImage');
        categoryItemImageEl.forEach((e) => {
            e.addEventListener('dragstart', handleDragStart);
            e.addEventListener('dragend', handleDragEnd);
            e.addEventListener('mousedown', handleMouseDown);
        });
    } else {
        options.initialize();
    }
}

function fillImages(element, category, randomizedArrIndex) {
    if (category === 'pokémon') {
        randomizedArrIndex = randomizedArrIndex.toString().padStart(3, '0');
        if (element.classList.contains('categoryItem')) {
            element.innerHTML = `<img class="categoryItemImage" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full//${randomizedArrIndex}.png" draggable="true" id="${category}${randomizedArrIndex}" data-id="${randomizedArrIndex}">`;
            
        } else {
            element.style.pointerEvents = 'auto';
            element.innerHTML = `<div draggable="false" style="background-image: url('https://assets.pokemon.com/assets/cms2/img/pokedex/full/${randomizedArrIndex}.png'); background-size:contain; opacity:0.2; height:100%; pointer-events:none; position:relative;"></div>`;
        }
    } else {
        if (element.classList.contains('categoryItem')) {
            element.innerHTML = `<img class="categoryItemImage" src="assets/images/${category}/${randomizedArrIndex}.png" draggable="true" id="${category}${randomizedArrIndex}" data-id="${randomizedArrIndex}">`;
            
        } else {
            element.style.pointerEvents = 'auto';
            element.innerHTML = `<div draggable="false" style="background-image: url('assets/images/${category}/${randomizedArrIndex}.png'); background-size:contain; opacity:0.2; height:100%; pointer-events:none; position:relative;"></div>`;
        }
    }
    element.setAttribute('data-id', randomizedArrIndex);
}

function resetBoard(introMessage) {
    gameContainerWrapperEl.style.visibility = 'visible';

    if(introMessage) {
        messageEl.innerHTML = '<span id="introMessage">Drag & Drop</span><br/><br/><img id="arrow" src="assets/images/arrow.png"">';
        popupWrapperEl.style.display = 'block';
        setTimeout(() => {
            popupWrapperEl.style.display = 'none';
        }, 1500);
    }

    resetBtn.innerText = 'Shuffle';

    count = 0;
    randomizedArrHolder = null;
    // resetCategories(categoryEl, categoryWrapperEl);
    initializeOptions(categoryItemEl, curCategory, curCategoryCount);
    initializeOptions(matchingItemEl, curCategory, curCategoryCount);
    game.reset();
}