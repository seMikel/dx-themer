const {
    execute,
} = require('../utils/process');

function list({version, file, theme, name}) {
    console.log(`Version: ${version}`);
    console.log(`Output: ${file}`);
    console.log(`Base theme: ${theme}`);
    console.log(`Theme name: ${name}`);
    
    execute('node node_modules/devextreme-cli export-theme-meta', [`--output-file=${file}`, `--version=${version}`, `--base-theme=${theme}`, `--output-color-scheme=${name}`]);
}

module.exports = list;