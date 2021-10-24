#! /usr/bin/env node
const { program } = require('commander');
const listVars = require('./scripts/list-vars');
const generateScheme = require('./scripts/generate-scheme');
const generateScss = require('./scripts/generate-scss');
const updateTheme = require('./scripts/update-theme');

program
    .command('list-vars')
    .description('List all of the DevExtreme theme variables')
    .option('-v, --version <version>', 'Version of DevExtreme', 'latest')
    .option('-f, --file <path>', 'Path of the file to output the list instead of the console')
    .action(listVars);

program
    .command('generate-scheme')
    .description('Generate a base scheme to be used with other commands')
    .option('-v, --version <version>', 'Version of DevExtreme', 'latest')
    .option('-f, --file <path>', 'Name of the generated scheme file', 'scheme.json')
    .option('-t, --theme <path>', 'Name of the base theme to be used', 'generic.light')
    .requiredOption('-n, --name <path>', 'Name of the custom theme generated')
    .action(generateScheme);

program
    .command('generate-scss')
    .description('Generate initial scss variables based on the schema and naming map')
    .option('-s, --source <file>', 'The theme\'s schema file', 'scheme.json')
    .option('-n, --naming <file>', 'The json file with the variable naming map file', 'naming.json')
    .option('-v, --vars <file>', 'The output file with specified scss variables from the naming file', 'variables.scss')
    .action(generateScss);

program
    .command('update-theme')
    .description('Update the schema and generate new css file based on scss variables and naming map')
    .option('-s, --source <file>', 'The theme\'s schema file', 'scheme.json')
    .option('-n, --naming <file>', 'The json file with the variable naming map file', 'naming.json')
    .option('-v, --vars <file>', 'The file with the scss variables', 'variables.scss')
    .option('-t, --theme <file>', 'The output css file name', 'dx-theme.css')
    .action(updateTheme);

program.parse();