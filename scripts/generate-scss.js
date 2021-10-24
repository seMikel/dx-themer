const {
    parseConfigPaths,
    readVars
} = require('../utils/themer');
const {
    execute,
} = require('../utils/process');
const fs = require('fs');

function generateScss(args) {
    const config = parseConfigPaths(args);

    if (!fs.existsSync(config.source)) {
        throw new Error(`No source file found at: ${config.source}`)
    }

    function writeToScss(vars) {
        if (fs.existsSync(config.vars)) {
            fs.unlinkSync(config.vars);
        }
        const writeStream = fs.createWriteStream(config.vars);
        vars.forEach(scssVar => writeStream.write(`$${scssVar.name}: ${scssVar.value};\n`));
        writeStream.close();
    }
    
    const scheme = JSON.parse(fs.readFileSync(config.source));
    let namingMap;
    if (fs.existsSync(config.naming)) {
        namingMap = JSON.parse(fs.readFileSync(config.naming));
    }
    
    const customVars = scheme.items.map((item) => {
        let name = item.key.substring(1);
        name = namingMap && namingMap[name] || name;
        return {
            name,
            value: item.value
        };
    });
    
    if (namingMap) {
        const defaultVars = Object.keys(namingMap).filter(name => !customVars.some(customVar => customVar.name === namingMap[name]));
        const extraVars = [];
        if (defaultVars.length) {
            execute('node node_modules/devextreme-cli export-theme-vars', [
                '--output-file=vars.scss',
                `--input-file=${config.source}`
            ], () => readVars('vars.scss', {
                read: (scssVar) => {
                    if (defaultVars.includes(scssVar.name)) {
                        extraVars.push({
                            ...scssVar,
                            name: namingMap[scssVar.name]
                        });
                        defaultVars.splice(defaultVars.indexOf(scssVar.name), 1);
                    }
                },
                close: () => writeToScss([...customVars, ...extraVars])
            }, true));
        } else {
            writeToScss(customVars);
        }
    } else {
        writeToScss(customVars);
    }
}

module.exports = generateScss;
