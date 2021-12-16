'use strict';
// Global variables: number of items to compare side by side, number of sets to compare, array to hold items.
const numberCompared = 3;
let rounds = 5;
let allProducts = [];
// Item constructor
function Product(name, extension='jpg') {
  this.name = name;
  this.path = `img/${name}.${extension}`;
  this.shown = 0;
  this.votes = 0;
  allProducts.push(this);
}
// Item instances
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

let cummVotes = Array(allProducts.length).fill(null);
let cummShown = Array(allProducts.length).fill(null);
// Function selects random items to display side by side, prevents duplicates by excluding selected, adds elemnt to display item, and tracks times item is shown.
let pvProd = [];
const section = document.getElementById('current-products');
function selectProducts() {
  let avProd = [...allProducts];
  if (pvProd.length) {
    avProd = avProd.filter(e => !(e.name==pvProd[0].name || e.name==pvProd[1].name || e.name==pvProd[2].name));
    pvProd = [];  
  }
  for (let i=0; i<numberCompared; i++) {
    let randomIndex = Math.floor(Math.random()*avProd.length);
    const currProduct = avProd.splice(randomIndex, 1)[0];
    pvProd.push(currProduct);
    let child = document.createElement('img');
    child.setAttribute('src', currProduct.path);
    child.setAttribute('alt', currProduct.name);
    section.appendChild(child);
    currProduct.shown++;
  }
}
// Call function to have items loaded when page loads
selectProducts();
// Add event listener to element containing items
section.addEventListener('click', handleImageClick);
// Function tracks item click (vote), renders new set of items unless
// comparison rounds past limit, in which case alerts user and displays reults butto
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
// Generates results list when button (view-results) clicked, then disables it to prevent duplicating results
function renderResults() {
  let v = localStorage.getItem('cummV');
  let s = localStorage.getItem('cummS');
  if (v) {
    cummVotes = JSON.parse(v);
    cummShown = JSON.parse(s);
  }

  for (let i=0; i<allProducts.length; i++) {
    cummVotes[i] += allProducts[i].votes;
    cummShown[i] += allProducts[i].shown;
  }
  console.log('v',cummVotes);
  console.log('s',cummShown);
  localStorage.setItem( 'cummV', JSON.stringify(cummVotes) );
  localStorage.setItem( 'cummS', JSON.stringify(cummShown) );

  const round = document.getElementById('chart-round').getContext('2d');
  let roundData = {
    type: 'bar',
    data: {
      labels: allProducts.map(x => x.name),
      datasets: [
        {label:'Votes', borderColor:'lightseagreen', backgroundColor:'lightseagreen', borderWidth:1, data: allProducts.map(x => x.votes)},
        {label:'Shown', borderColor:'aquamarine', backgroundColor:'aquamarine', borderWidth:1, data: allProducts.map(x => x.shown)}
      ]  
    },
    options: {plugins: {title: {display:true, text:'This Round Results', font:{size:20}, color:'grey' }}}
  };
  new Chart(round, roundData);

  const cumm = document.getElementById('chart-cumm').getContext('2d');
  let cummData = {
    type: 'bar',
    data: {
      labels: allProducts.map(x => x.name),
      datasets: [
        {label:'Votes', borderColor:'lightseagreen', backgroundColor:'lightseagreen', borderWidth:1, data: cummVotes},
        {label:'Shown', borderColor:'aquamarine', backgroundColor:'aquamarine', borderWidth:1, data: cummShown}
      ]  
    },
    options: {plugins: {title: {display:true, text:'Cummulative Results', font:{size:20}, color:'grey' }}}
  };
  new Chart(cumm, cummData);

  let ul = document.getElementById('display-results');
  allProducts.forEach(e => {
    let li = document.createElement('li');
    li.innerHTML = `${e.name} had ${e.votes} votes, and was seen ${e.shown} times`;
    ul.appendChild(li);
  // document.getElementById('view-results').removeAttribute('onclick');
  document.getElementById('view-results').style.visibility='hidden';
  });
}