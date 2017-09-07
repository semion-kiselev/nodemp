import appConfig from './config/app.json';
import {User, Product} from './models';

console.log(appConfig.name);

new User();
new Product();
