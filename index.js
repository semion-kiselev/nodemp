import path from 'path';
import appConfig from './config/app.json';
import {User, Product} from './models';
import DirWatcher from './lib/dirwatcher';
import Importer from './lib/importer';

console.log(appConfig.name);

new User();
new Product();

const dirWatcher = new DirWatcher();
dirWatcher.watch(path.resolve(__dirname, 'data'), 1000);

const importer = new Importer(dirWatcher);
