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
      month="${MONTHNAMES[md[0]]}" 
      day="${day}">${day}
    </div>`;
    outdiv += el;
  }

  outdiv += `</div></div>`;

  calendar.insertAdjacentHTML("beforeend", outdiv);
}

function getAllMonthsInYear(year) {
  calendar.insertAdjacentHTML("afterbegin", `<h1 class="year">${year}</h1>`);
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

const apikey = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday`;
const calendar = document.querySelector(".calendar");

getAllMonthsInYear(1854);
document.querySelectorAll(".day").forEach(el => {
  el.onclick = (e) =>{
    let el = e.target
    let day = el.getAttribute("day")
    let month = el.getAttribute("month")
    let year = el.getAttribute("year")
    console.log(day, month, year)
  }
})

getYearInfo(2001)
// let data = await thatDayinYear("6", "6", 1944);
// console.log(data)

