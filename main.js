const MONTHS = [
  [1, 31],
  [2, 28],
  [3, 31],
  [4, 30],
  [5, 31],
  [6, 30],
  [7, 31],
  [8, 31],
  [9, 30],
  [10, 31],
  [11, 30],
  [12, 31],
];

const MONTHNAMES = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function title(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDate(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0)).toDateString();
}

function getMonth(year, month) {
  let md = MONTHS[month];
  let offset = new Date(getDate(year, md[0], 1)).getDay();

  let outdiv = `
	<div class="month">
		  <h1>${title(MONTHNAMES[month])}</h1>
		  <div class="weekdays">
			<div>Sun</div>
			<div>Mon</div>
			<div>Tue</div>
			<div>Wed</div>
			<div>Thu</div>
			<div>Fri</div>
			<div>Sat</div>
		  </div>
		  <hr>
	<div class="days">`;

  for (let i = 0; i < offset; i++) {
    outdiv += "<div class='emptycell'></div>";
  }

  for (let i = 1; i <= md[1]; i++) {
    let day = new Date(getDate(year, md[0], i)).getDate();
    let el = `
    <div 
      class="day" 
      year="${year}" 
      month="${MONTHNAMES[md[0]-1]}" 
      day="${day}">${day}
    </div>`;
    outdiv += el;
  }

  outdiv += `</div></div>`;

  calendar.insertAdjacentHTML("beforeend", outdiv);
}

function getAllMonthsInYear(year) {
  for (let i = 0; i < 12; i++) {
    getMonth(year, i);
  }
}

async function getwikidata(type, month, day) {
  // types: births, deaths, events, holidays
  var response = await fetch(apikey + `/${type}/${month}/${day}`);
  var data = response.json();
  return data;
}

async function thatDayinYear(day, month, year) {
  let out = {"births": [], "deaths": [], "events": [], "holidays": []}
  for (let t in out) {
    let data = await getwikidata(t, month, day);
    for (const i in data[t]) {
      let info = data[t][i];
      if (info["year"] === year) {
        out[t].push(info)
      }
    }
  }
  return out;
}

async function createCard(day, month, year){
  if(document.querySelector(".card")){
    destroycard()
  }
  
  let cardel = `
  <div class="card fadein">
    <div class="cardnav">
      <button class="exit">X</button>
      <h1>${title(month)} ${day} ${year}</h1>
    </div>
    <div id="data"><h1>Loading information...</h1></div>
  </div>`
  calendar.insertAdjacentHTML("beforeend", cardel);
  let card = document.querySelectorAll(".card")

  for(let i = 0; i < card.length; i++){
      card[i].querySelector(".exit").onclick = () => {destroycard()}
  }

  let data = await thatDayinYear(Number(day), Number(MONTHNAMES.indexOf(month)+1) , Number(year))
  writeToCard(data)
}

function writeToCard(data){
  let types = ["births", "deaths", "events", "holidays"]
  let el = `<table>`
  let totalEmpty = 0;
  for(let i = 0; i < types.length; i++){
    if(data[types[i]].length > 0){
      el += `<tr><th>${title(types[i])}</th><tr>`
      for(let j = 0; j < data[types[i]].length; j++){
        el += `<tr><td>${data[types[i]][j]["text"]}</td><tr>`
      }
    } else {
      totalEmpty += 1;
    }
  }
  el += `</table>`
  if(totalEmpty == types.length){
    el = `<h1>No information for this day</h1>`
  }

  document.querySelector("#data").innerHTML = el
}

function destroycard(){
  let card = document.querySelector(".card")
  card.classList.remove("fadein")
  card.classList.add("fadeout")
  card.classList.add("unclickable")
 
  setTimeout(() => {
    card.remove()
  }, 500);
  
}

function setupYear(year){
  getAllMonthsInYear(year);
  document.querySelectorAll(".day").forEach(el => {
    el.onclick = (e) =>{
      let el = e.target
      let day = el.getAttribute("day")
      let month = el.getAttribute("month")
      let year = el.getAttribute("year")
      createCard(day, month, year)
    }
  })
  
}

const apikey = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday`;
const calendar = document.querySelector(".calendar");
const year = document.querySelector("#year")


setupYear(2023)

year.onchange = () => {
  calendar.innerHTML = null;
  setupYear(year.value)
}


