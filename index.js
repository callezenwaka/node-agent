const fs = require("fs");

const input_path = "/mnt/c/Users/<>/event_table.csv";
const output_path = "/mnt/c/Users/<>/event_table_output";

fs.readFile(input_path, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  
  var input_extension = input_path.split('.').pop();
  var output_extension = input_extension === 'csv'? 'json' : 'csv';

  if(output_extension === 'csv') {
    var output = JSON.parse(JSONToCSV(data, ['event_id', 'request_id', 'provider', 'event', 'created_at']));
  } else {
    var output = JSON.stringify(CSVToJSON(data));
  }

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