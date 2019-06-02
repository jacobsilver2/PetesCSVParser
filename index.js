const csvToJson = require('csvtojson');
const iCal = './input/petesBands.csv';
const mediaRequestForm = './input/MediaRequestForm.csv';
const ObjectsToCsv = require('objects-to-csv');


const processCsv = async () => {
  const shows = await csvToJson({
    delimiter: ';',
    trim:true
  }).fromFile(iCal);

  const submissions = await csvToJson({
    trim:true
  }).fromFile(mediaRequestForm);
  
  shows.forEach((row) => {
    row.draw = null; //adding fields for draw, first name, last name, website and blurb
    row.name_first = '';
    row.name_last = '';
    row.website = '';
    row.blurb = '';
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

    submissions.forEach(submission => {
      if (row.email === submission.Email) {
        row.name_first = submission.name_first;
        row.name_last = submission.name_last;
        row.website = submission.Website;
        row.blurb = submission.ShortBlurbAboutYourAct450CharacterLimit;
      }
    })
  });
  
  (async() => {
    let csv = new ObjectsToCsv(shows);
    await csv.toDisk('./output/processed.csv');
  })();
};

processCsv();




