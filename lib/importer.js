import {readdir, readFile, stat} from 'mz/fs';
import {readdirSync, readFileSync, statSync} from 'fs';
import nodePath from 'path';
import convertCsvToJson from '../utils/convertCsvToJson';

class Importer {
    constructor(dirWatcher) {
        dirWatcher.on(dirWatcher.CHANGED, this.importData.bind(this));
    }

    async importData(path) {
        try {
            const files = await readdir(path);
            const csvFiles = await this.getCSVFiles(path, files);
            const promiseAllAr = csvFiles.map(csvFile => readFile(nodePath.resolve(path, csvFile), 'utf-8'));
            const csvResults = await Promise.all(promiseAllAr);

            return csvResults.map(result => convertCsvToJson(result));
        } catch(err) {
            throw err;
        }
    }

    importDataSync(path) {
        try {
            const files = readdirSync(path);
            const csvFiles = this.getCSVFilesSync(path, files);

            return csvFiles
                .map(csvFile => readFileSync(nodePath.resolve(path, csvFile), 'utf-8'))
                .map(result => convertCsvToJson(result));
        } catch(err) {
            throw err;
        }
    }

    async getCSVFiles(path, files) {
        const csvFiles = [];

        for (let fileName of files) {
            const filePath = nodePath.resolve(path, fileName);
            const fileStat = await stat(filePath);

            if (fileStat.isFile() && nodePath.extname(filePath) === '.csv') {
                csvFiles.push(fileName);
            }
        }

        return csvFiles;
    }

    getCSVFilesSync(path, files) {
        const csvFiles = [];

        for (let fileName of files) {
            const filePath = nodePath.resolve(path, fileName);
            const fileStat = statSync(filePath);

            if (fileStat.isFile() && nodePath.extname(filePath) === '.csv') {
                csvFiles.push(fileName);
            }
        }

        return csvFiles;
    }
}

export default Importer;
