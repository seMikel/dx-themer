const {
    parseConfigPaths,
    readVars
} = require('../utils/themer');
const {
    execute
} = require('../utils/process');
const fs = require('fs');

function updateTheme(args) {
    const config = parseConfigPaths(args);

    if (!fs.existsSync(config.source)) {
        throw new Error(`No source file found at: ${config.source}`)
    }
    if (!fs.existsSync(config.vars)) {
        throw new Error(`No scss file found at: ${config.vars}`)
    }

    let namingMap;
    if (fs.existsSync(config.naming)) {
        namingMap = JSON.parse(fs.readFileSync(config.naming));
    }

    let validVarNames = [];
    let dxVars = [];
    console.log('Fetching devExtreme variables');
    execute('node node_modules/devextreme-cli export-theme-vars', [
        '--output-file=vars.scss',
        `--input-file=${config.source}`
    ], () => readVars('vars.scss', {
        read: (scssVar) => validVarNames.push(scssVar.name),
        close: () => {
            console.log('Parsing SCSS variables');
            readVars(config.vars, {
                read: (scssVar) => {
                    dxVars.push({
                        key: `${scssVar.name}`,
                        value: `${scssVar.value.slice(0, -1)}`
                    });
                },
                close: () => {
                    console.log('Updating scheme');
                    dxVars.forEach(dxVar => {
                        if (dxVar.value[0] === '$') {
                            const sourceVar = dxVars.find(sVar => `$${sVar.key}` === dxVar.value);
                            dxVar.value = sourceVar && sourceVar.value || dxVar.value;
                        }
                    });
                    dxVars.forEach(dxVar => {
                        if (namingMap) {
                            dxVar.key = Object.keys(namingMap).find(key => namingMap[key] === dxVar.key) || dxVar.key;
                        }
                    });
                    dxVars = dxVars.filter(dxVar => validVarNames.includes(dxVar.key)).map(dxVar => ({
                        ...dxVar,
                        key: `$${dxVar.key}`
                    }));

                    const scheme = JSON.parse(fs.readFileSync(config.source));
                    scheme.items = dxVars;
                    fs.unlinkSync(config.source);
                    fs.writeFileSync(config.source, JSON.stringify(scheme));
                    console.log('Generating theme');
                    execute('node node_modules/devextreme-cli build-theme', [`--input-file=${config.source}`, `--output-file=${config.theme}`], () => process.exit(0));
                }
            });
        }
    }, true));
}

module.exports = updateTheme;
