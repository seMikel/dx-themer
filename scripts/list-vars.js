const {
    readVars
} = require('../utils/themer');
const {
    execute,
    buildPath,
} = require('../utils/process');
const fs = require('fs');

function list({version, file}) {
    console.log(`Version: ${version}`);
    console.log(`Output: ${file || 'console'}`);
    let writeStream = null;
    
    execute('node node_modules/devextreme-cli export-theme-vars', ['--output-file=vars.scss', `--version=${version}`], () => readVars('vars.scss', {
        open: () => {
            writeStream = file ? fs.createWriteStream(buildPath(file)) : writeStream;
        },
        read: (scssVar) => {
            if (writeStream) {
                writeStream.write(`${scssVar.name}\n`);
            } else {
                console.log(scssVar.name);
            }
        },
        close: () => {
            if (writeStream) {
                writeStream.close();
            }
        }
    }, true));
}

module.exports = list;