const csvToJson = require('csvtojson');
const file = './petesBands.csv';
const ObjectsToCsv = require('objects-to-csv');

const processCsv = async () => {
  const shows = await csvToJson({
    delimiter: ';',
    trim:true
  }).fromFile(file);
  
  shows.forEach((row) => {
    row.draw = null; //adding a draw field
    let drawResults = row.report.match(/(^|\s)([0-9]+)(?=$|\s)/);
    if (drawResults) {
      drawResults = drawResults[0];
    }

    let fullResults = row.report.match(/full/) || row.report.match(/packed/);
    if (fullResults) { // turn full or packed into 40 (max of the room) so we can do analytics later
      fullResults = 40;
    }
    const draw = drawResults || fullResults;
    
    let processedRow = row.report.replace(row.email, '');
    
    if (draw) { 
      row.draw = parseInt(draw);
      processedRow = processedRow.replace(/\d+/, ''); 
    }
    row.report = processedRow.trimLeft().trimRight();
  });
  
  (async() => {
    let csv = new ObjectsToCsv(shows);
    await csv.toDisk('./processed.csv');
   
  })();
};

processCsv();




