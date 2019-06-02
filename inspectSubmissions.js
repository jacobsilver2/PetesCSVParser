const csvToJson = require('csvtojson');
const mediaRequestForm = './input/MediaRequestForm.csv';
const iCal = './input/petesBands.csv';


const processCsv = async () => {

  const shows = await csvToJson({
    delimiter: ';',
    trim:true
  }).fromFile(iCal);

  const submissions = await csvToJson({
    trim:true
  }).fromFile(mediaRequestForm);

  shows.forEach((row) => {
    submissions.forEach((submission) => {
      if (row.email === submission.Email) {
        console.log(`Found a match: ${submission.Email}`)
      }
    })
  })
}

processCsv();