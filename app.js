const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const imessage = require('osa-imessage');

const url = `https://www.beeradvocate.com/lists/top/`;
const apiUrl = ``;
const beers = { table: [] };

/*
  Returns today's date in the format "MM-DD".
*/
function getTodaysDate() {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  if (dd < 10) {
      dd = '0' + dd
  } 
  if (mm < 10) {
      mm = '0' + mm
  }
  return today = mm + '-' + dd;
}

/*
  Writes output to JSON.
*/
function writeOutput(beers) {
  const json = JSON.stringify(beers, null, 4);
  const today = getTodaysDate();
  const outputFile = `output/beers_${today}.json`;
  fs.writeFile(outputFile, json, 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
  });
}

/*
  Extracts ABV from HTML element.
*/
function extractABV(str) {
    let numStyles = (str.split('/ ').length);
    let abv = str.split('/ ')[numStyles-1];
    return abv
}

/*
  Prints name of brewery with most occurances in top 250.
*/
function getMostFrequentBrewery(beers) {

  console.log("MOST POPULAR BREWERY\n---------------");

  const beerList = beers['table'];
  if(beerList.length == 0)
      return null;

  var modeMap = {};
  var maxEl = beerList[0].brewery, maxCount = 1;
  for(var i = 0; i < beerList.length; i++)
  {
      var el = beerList[i].brewery;
      if(modeMap[el] == null)
          modeMap[el] = 1;
      else
          modeMap[el]++;  
      if(modeMap[el] > maxCount)
      {
          maxEl = el;
          maxCount = modeMap[el];
      }
  }
  console.log("The most popular brewery right now is " + maxEl + " with " + maxCount + " appearances on BeerAdvocate's top 250 list.");
  console.log('');

  return maxEl;
}

/*
  Prints name of style with most occurances in top 250.
*/
function getMostFrequentStyle(beers) {

  console.log("MOST POPULAR STYLE\n---------------");

  const beerList = beers['table'];
  if(beerList.length == 0)
      return null;

  var modeMap = {};
  var maxEl = beerList[0].style, maxCount = 1;
  for(var i = 0; i < beerList.length; i++)
  {
      var el = beerList[i].style;
      if(modeMap[el] == null)
          modeMap[el] = 1;
      else
          modeMap[el]++;  
      if(modeMap[el] > maxCount)
      {
          maxEl = el;
          maxCount = modeMap[el];
      }
  }
  console.log("The most popular style right now is " + maxEl + " with " + maxCount + " appearances on BeerAdvocate's top 250 list.");
  console.log('');

  return maxEl;
}

/*
  Prints names of the ten highest-ranked beers.
*/
function getTopTenBeers(beers) {
  
  console.log("TOP TEN BEERS\n---------------")

  const beerList = beers['table'];
  for (let i = 0; i < 10; i++) {
    console.log(beerList[i].name);
  }

  console.log('');
}

/*
  Prints names of the breweries of the ten highest-ranked beers.
*/
function getTopTenBreweries(beers) {
  
  console.log("TOP TEN BREWERIES\n---------------");

  const beerList = beers['table'];
  for (let i = 0; i < 10; i++) {
    console.log(beerList[i].brewery);
  }

  console.log('');
}

/*
  Prints names of the ten beers with the highest ABV.
*/
function getTopTenHighestABV(beers) {
  // To do
}

/*
  Main request function.
*/
function getBeers(url) {
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      let $ = cheerio.load(html);
      $('#extendedInfo').each(function() {
        let thisBeer = $(this);
        let name = thisBeer.prev().text();
        let brewery = thisBeer.children().eq(0).text();
        let style = thisBeer.children().eq(2).text();
        let abv = extractABV(thisBeer.text());
        let rating = thisBeer.parent().next().text();
        let reviews = thisBeer.parent().next().next().text();
        beers.table.push({
          name: name,
          style: style,
          abv: abv,
          brewery: brewery,
          rating: rating,
          reviews: reviews
        });
        writeOutput(beers);
      });

      console.log('');

      getTopTenBeers(beers);
      getTopTenBreweries(beers);
      getMostFrequentBrewery(beers);
      getMostFrequentStyle(beers);

    }
  });
}

imessage.handleForName('Evan Winter').then(handle => {
    imessage.send(handle, 'Hello')
});

getBeers(url);