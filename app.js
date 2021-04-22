'use strict'

// Creating Global varibales
// global variable for clicks or results
const results = document.getElementById('clicks');
// global varibale for all images for the list of images
const allImages = document.getElementById('images'); 
// global variable for the image that will render on the left 
const leftImage = document.getElementById('leftItemImg');
// global variable for the p tag that will render with image associated with
const leftImageP = document.getElementById('leftItemP');
// global variable for the image that will render in the center
const centerImage = document.getElementById('centerItemImg');
// global varaible for the p tag that will render with image associated with
const centerImageP = document.getElementById('centerItemP');
// global variable for the image that will render on the right side 
const rightImage = document.getElementById('rightItemImg');
//  global varaible for the p tag that will render with image associated with
const rightImageP = document.getElementById('rightItemP'); 
// This variable will track the total amount of clicks the user will do based in the function on line 56

let totalClicks = 0;
// items will start off null then will be given a valuee
let leftItem = null;
let centerItem = null; 
let rightItem = null; 
// the constructor function is made for the object
const ItemPics = function(name, imagePath) {
    // the object will have a name, an image, will track clicks, as well as total clicks 
    this.name = name; 
    this.imagePath = imagePath; 
    this.clicks = 0; 
    this.timesShown = 0; 
    // the object will be pushed into an array
    ItemPics.allImages.push(this);
}
// an array for the objects
ItemPics.allImages = []; 
// a function is created to generate pictures that will not repeat consequetively 

function itemPicker(){
    // an comparing is created to store the items that have been shown already 
    const pickedArray = []; 
    // when pushed into the array the value will start with null until it is pushed again 
    pickedArray.push(leftItem);
    pickedArray.push(centerItem);
    pickedArray.push(rightItem);
    console.log(pickedArray);
    // a while loop for the left item is created to gnerate a new item
    while(pickedArray.includes(leftItem)){
        let leftIndex = Math.floor(Math.random() * ItemPics.allImages.length);
        leftItem = ItemPics.allImages[leftIndex]
    }
    // the new item that was generated will then be pushed into this array so that now the array has more values than just null
    pickedArray.push(leftItem); 
    console.log(pickedArray);
    //another while loopp is created for generating the center image
    while(pickedArray.includes(centerItem)){
        let centerIndex = Math.floor(Math.random() * ItemPics.allImages.length);
        centerItem = ItemPics.allImages[centerIndex];
    }
    // center item is generated and pushed into the array 
    pickedArray.push(centerItem); 
    while(pickedArray.includes(rightItem)){
        let rightIndex = Math.floor(Math.random() * ItemPics.allImages.length);
        rightItem = ItemPics.allImages[rightIndex];
    }
}

// create function to store items into the local storage
function storeItems() {
    // storage accepts string value, and therefore the 'ItemPics.allImages' or items will be turned into a string 
    let turnIntoString = JSON.stringify(ItemPics.allImages);
    // placing the object in string form or the value into the 'itemsInStorage' key 
    localStorage.setItem('itemsInStorage', turnIntoString);
}
// function to retrieve the items that are from local storage
function retrieveItems(){
    let turnIntoString = localStorage.getItem('itemsInStorage');
    if(turnIntoString !== null){
        let turnIntoParse = JSON.parse(turnIntoString);
        for(let i = 0; i < turnIntoParse.length; i++){
        let myItem = new ItemPics(turnIntoParse[i].name, turnIntoParse[i].imagePath);
        myItem.clicks = turnIntoParse[i].clicks;
        myItem.timesShown = turnIntoParse[i].timesShown;  
        }
        console.log(ItemPics.allImages);
    }else{
    createItem(); 
    }
}

// a function is created to render the items with the images associated with them 
function renderItems(){ 
    // the images are rendered 
    leftImage.src = leftItem.imagePath;
    centerImage.src = centerItem.imagePath;
    rightImage.src = rightItem.imagePath; 
    // the text content or the headers are rendered associated with each item 
    leftImageP.textContent = leftItem.name;
    centerImageP.textContent = centerItem.name;
    rightImageP.textContent = rightItem.name; 
}

// a function is created to handle the click events that the user will perform
function handleTheClick(event){
    const itemClicked = event.target;
    const id = itemClicked.id;
    // as long as the clicks are under 20, the if statement will run to increment the clicks, track the total clicks, and to add to to times shown for the images
    if(totalClicks < 25){
        if(id === 'leftItemImg' || id === 'rightItemImg' || id === 'centerItemImg'){
            // if the left image is clicked 
            if(id === 'leftItemImg'){
            leftItem.clicks++;
            totalClicks++;
            leftItem.timesShown++;
            centerItem.timesShown++;
            rightItem.timesShown++; 
            itemPicker();
            renderItems(); 
            // storeItems();
           // if the center image is clicked
            }else if(id === 'centerItemImg'){
            centerItem.clicks++;
            totalClicks++;
            leftItem.timesShown++;
            centerItem.timesShown++;
            rightItem.timesShown++; 
            itemPicker();
            renderItems(); 
            // storeItems();
            // if the right image is clicked
            }else{
            rightItem.clicks++; 
            totalClicks++;
            leftItem.timesShown++;
            centerItem.timesShown++;
            rightItem.timesShown++; 
            itemPicker();
            renderItems(); 
            }
        }
    }
    // if the clicks reach to 20 clicks, the event listener will turn off making the user unable to click more
    // and the votes will display, as well as an alert message alerting the user that they cannot click anymore
    if(totalClicks === 25){
        allImages.removeEventListener('click', handleTheClick);
        alert('you have reached the maximum votes!'); 
        votesDisplayed(); 
        renderChart();
        renderChartShown();
        storeItems(); 
    }
}

// a function is created to display the images that have been clicked on within a list format
function votesDisplayed() {
    results.innerHTML = ' ';
    let h2Element = document.createElement('h2');
    h2Element.textContent = 'VOTES!';
    results.appendChild(h2Element);
    for(let i = 0; i< ItemPics.allImages.length; i++){
        const liElement = document.createElement('li');
        let items = ItemPics.allImages[i];
        liElement.textContent = `${items.name}: ${items.clicks}`;
        results.appendChild(liElement);
    }
}

// this function is created to render the shown images data
function renderChartShown(){
    let labelDataShown  = [];
    for(let itemShown of ItemPics.allImages){
        labelDataShown.push(itemShown.name);
    } 
    let voteDataShown = []; 
    for(let itemShownForUser of ItemPics.allImages){
        voteDataShown.push(itemShownForUser.timesShown)
    }
    var ctx = document.getElementById('chartShown').getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labelDataShown,
        datasets: [{
            label: '# of displays per item',
            data: voteDataShown,
            backgroundColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}

// function to render the chart with the data votes
function renderChart(){
    let labelData = [];
    for(let item of ItemPics.allImages){ 
        labelData.push(item.name);
    }
    let voteData = [];
    for(let item of ItemPics.allImages){
        voteData.push(item.clicks);
    }
    var ctx = document.getElementById('chart').getContext('2d');
    var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labelData,
        datasets: [{
            label: '# of Votes',
            data: voteData,
            backgroundColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],

            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
}

// this function is created so that we can call it for the retrieve items function
function createItem(){
// These are the objects or items that will be used within the code
new ItemPics('Bag', '/img/products/bag.jpeg');
new ItemPics('Banana', '/img/products/banana.jpeg');
new ItemPics('Toilet Paper Stand', '/img/products/bathroom.jpeg');
new ItemPics('Toeless Boots', '/img/products/boots.jpeg');
new ItemPics('Breakfast', '/img/products/breakfast.jpeg');
new ItemPics('Meat Bubble Gum', '/img/products/bubblegum.jpeg');
new ItemPics('Chair', '/img/products/chair.jpeg');
new ItemPics('Cthulhu', '/img/products/cthulhu.jpeg');
new ItemPics('Rubber Ducky', '/img/products/dog-duck.jpeg');
new ItemPics('Dragon', '/img/products/dragon.jpeg');
new ItemPics('Pen', '/img/products/pen.jpeg');
new ItemPics('Pet Sweeper', '/img/products/pet-sweep.jpeg');
new ItemPics('Scissors', '/img/products/scissors.jpeg');
new ItemPics('Shark', '/img/products/shark.jpeg');
new ItemPics('Personal Sweeper', '/img/products/sweep.png');
new ItemPics('TaunTaun', '/img/products/tauntaun.jpeg');
new ItemPics('Unicorn Meat', '/img/products/unicorn.jpeg');
new ItemPics('USB', '/img/products/usb.gif');
new ItemPics('Water Can', '/img/products/water-can.jpeg');
new ItemPics('Wine Glass', '/img/products/wine-glass.jpeg');
} 
// event listener will listen for clicks, and then handle the clicks seen on the function on line 62
allImages.addEventListener('click', handleTheClick);
// the item picker function and render item function is called
retrieveItems(); 
itemPicker(); 
renderItems();
renderChart();
renderChartShown();