'use strict';

const numberOfComparedProducts = 3;
let rounds = 25;
let allProducts = [];

function Product(name, extension='jpg') {
  this.name = name;
  this.path = `img/${name}.${extension}`;
  this.shown = 0;
  this.votes = 0;
  allProducts.push(this);
}

new Product('bag');
new Product('banana');
new Product('bathroom');
new Product('boots');
new Product('breakfast');
new Product('bubblegum');
new Product('chair');
new Product('cthulhu');
new Product('dog-duck');
new Product('dragon');
new Product('pen');
new Product('pet-sweep');
new Product('scissors');
new Product('shark');
new Product('sweep','png');
new Product('tauntaun');
new Product('unicorn');
new Product('water-can');
new Product('wine-glass');

const section = document.getElementById('current-products');

function selectProducts() {
  let availableProducts = [...allProducts];
  for (let i=0; i<numberOfComparedProducts; i++) {
    let randomIndex = Math.floor(Math.random()*availableProducts.length);
    const currProduct = availableProducts.splice(randomIndex, 1)[0];
    let child = document.createElement('img');
    child.setAttribute('src', currProduct.path);
    child.setAttribute('alt', currProduct.name);
    section.appendChild(child);
    currProduct.shown++;
  }
}

selectProducts();

section.addEventListener('click', handleImageClick);

function handleImageClick(e) {
  let currImage = e.target.alt;
  allProducts.forEach(element => {
    if (element.name === currImage) {
      element.votes++;
    };
  });
  rounds--;
  if (rounds > 0) {
    section.innerHTML = '';
    selectProducts();
  } else {
    section.removeEventListener('click', handleImageClick);
    alert('Voting completed; click button to display results');
    document.getElementById('view-results').style.visibility='visible';
  }
}

function renderResults() {
  let ul = document.getElementById('display-results');
  allProducts.forEach(e => {
    let li = document.createElement('li');
    li.innerHTML = `${e.name} had ${e.votes} votes, and was seen ${e.shown} times`;
    ul.appendChild(li);
  });
}