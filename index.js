const fs = require("fs");
// https://www.geeksforgeeks.org/how-to-convert-csv-to-json-file-and-vice-versa-in-javascript/
// https://iqcode.com/code/javascript/javascript-get-json-keys
// const readline = require("readline");
// const fs = require('fs')

// let data = "How to write a file in Javascript."
// fs.writeFile('output.txt', data, (err) => {
//  if (err) throw err;
// });

const input_path = "/mnt/c/Users/<>/event_table.csv";
const output_path = "/mnt/c/Users/<>/event_table_output";
// const input_path = "/mnt/c/Users/<>/event_table_input.json";

fs.readFile(input_path, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log(typeof data);
  var input_extension = input_path.split('.').pop();
  var output_extension = input_extension === 'csv'? 'json' : 'csv';
  if(output_extension === 'csv') {
    console.log(data[0]);
    // var keys = Object.keys(JSON.parse(data[0]));
    // console.log('keys: ', keys);
    var output = JSON.parse(JSONToCSV(data, ['event_id', 'request_id', 'provider', 'event', 'created_at']));
  } else {
    console.log('json');
    var output = JSON.stringify(CSVToJSON(data));
    // const data = JSON.stringify(user);
  }
  console.log(output);
  fs.writeFile(`${output_path}.${output_extension}`, output, (err) => {
    if (err) throw err;
   });
});

const JSONToCSV = (objArray, keys) => [
  keys.join(','), ...objArray.map(
    row => keys.map(k => row[k] || '')
      .join(','))].join('\n');

const CSVToJSON = csv => {
  const lines = csv.split('\n');
  const keys = lines[0].split(',');
  return lines.slice(1).map(line => {
    return line.split(',').reduce((acc, cur, i) => {
      const toAdd = {};
      toAdd[keys[i]] = cur;
      return { ...acc, ...toAdd };
    }, {});
  });
};