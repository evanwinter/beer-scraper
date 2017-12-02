const cheerio = require('cheerio');
const request = require('request');
const jsonfile = require('jsonfile');
var fs = require('fs');

const url = `https://www.beeradvocate.com/lists/top/`;
const beers = {
  table: []
};
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
if(dd<10) {
    dd = '0'+dd
} 
if(mm<10) {
    mm = '0'+mm
}
today = mm+'-'+dd;

request(url, function (error, response, html) {
  if (!error && response.statusCode == 200) {
    let $ = cheerio.load(html);
    $('#extendedInfo').each(function() {
      let thisBeer = $(this);
      let name = thisBeer.prev().text();
      let brewery = thisBeer.children().eq(0).text();
      let style = thisBeer.children().eq(2).text();
      let abv = getSecondPart(thisBeer.text());

      // console.log("Name: " + name);
      // console.log("Style: " + style);
      // console.log("ABV: " + abv);
      // console.log("Brewed by: " + brewery);
      // console.log('');

      beers.table.push({
        name: name,
        style: style,
        abv: abv,
        brewery: brewery
      });

      writeOutput(beers);

    });
  }

  // getTopTenBeers(beers);
  // getTopTenBreweries(beers);

  getMostFrequentBrewery(beers);
  getMostFrequentStyle(beers);

});

// function analyzeBeers(beers) {
//   const beerList = beers['table'];
//   for (let i = 0; i < beerList.length; i++) {
//     console.log(beerList[i]);
//   }
// }

function getMostFrequentBrewery(beers) {
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
  return maxEl;
}

function getMostFrequentStyle(beers) {
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
  return maxEl;
}

function getSecondPart(str) {
    let numStyles = (str.split('/ ').length);
    let abv = str.split('/ ')[numStyles-1];
    return abv
}

function getTopTenBeers(beers) {
  const beerList = beers['table'];
  for (let i = 0; i < 10; i++) {
    console.log(beerList[i].name);
  }
}

function getTopTenBreweries(beers) {
  const beerList = beers['table'];
  for (let i = 0; i < 10; i++) {
    console.log(beerList[i].brewery);
  }
}

function getHighestABV(beers) {
  // To do
}

function writeOutput(beers) {
  const json = JSON.stringify(beers, null, 4);
  fs.writeFile(`output/beers_${today}.json`, json, 'utf8', function(err) {
    if (err) {
      console.log(err);
    }
  });
}