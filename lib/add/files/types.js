import { append, appendToFile, findPath } from "../../helper/helper";
import * as changeCase from 'change-case';
import {lowerCaseFirst} from 'lower-case-first';
const Handlebars = require('handlebars')
import ora from 'ora';

import formatFile from "../format";
import { upperCaseFirst } from "upper-case-first";

const types = `
/***
 * created {{name}} REDUX TYPES at {{date}}
 */

export const {{name}} = '{{name}}'; 
export const {{name}}_SUCCESS = '{{name}}_SUCCESS';
export const {{name}}_FAILED = '{{name}}_FAILED';
`

export default async function addTypes(n){
    const name = changeCase.capitalCase(n);
    const spin = ora()
    spin.start(`generating new Redux Types ${name}.types`);
    const template = Handlebars.compile(types);

    const res = await findPath('App/redux/types');
    const typesIndexPath = `${res.path}/index.js`
	if (res.status) {
        await append(`${res.path}/${name.toLowerCase()}.types.js`, template({ name: name.toUpperCase(), date: new Date() }));
        await appendToFile(
            typesIndexPath,
            [ ';' ],
            `export { ${name.toUpperCase()}, ${name.toUpperCase()}_SUCCESS, ${name.toUpperCase()}_FAILED } from './${name}.types'`
        )
        spin.succeed(`created App/redux/types/${name}.types`)
        spin.succeed(`exported ${name} from App/redux/types/${name}.types`)
        spin.info(`you can import exported cases from 'redux-types' e.g import { ${name.toUpperCase()} } from 'redux-types' from any reducer|action|saga files`)
    }
    formatFile(typesIndexPath)
    formatFile(`${res.path}/${name}.types.js`)
}