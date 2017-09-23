export default function(csvString) {
    const json = [];
    const csvArray = csvString.split("\n");
    const csvColumns = csvArray.shift().replace(/'/g, '"').split(',');

    csvArray.forEach((csvRowString) => {
        const csvRow = csvRowString.split(",");
        const jsonRow = {};

        for ( let colNum = 0; colNum < csvRow.length; colNum++) {
            jsonRow[csvColumns[colNum]] = csvRow[colNum].replace(/^['"]|['"]$/g, "");
        }

        json.push(jsonRow);
    });

    return JSON.stringify(json);
};
