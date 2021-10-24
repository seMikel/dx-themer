const fs = require('fs');
const readline = require('readline');
const { buildPath } = require('./process');

const readVars = (scssFile, {
        open,
        read,
        close
    },
    doDelete
) => {
    if (fs.existsSync(scssFile)) {
        openFile(scssFile);
    } else {
        fs.watchFile(scssFile, (file) => {
            if (file.size) {
                fs.unwatchFile(scssFile);
                openFile(scssFile);
            }
        });
    }

    function openFile() {
        if (open) {
            open();
        }

        const readStream = fs.createReadStream(scssFile);
        const rl = readline.createInterface({
            input: readStream,
            crlfDelay: Infinity
        });

        rl.on('line', (input) => {
            input = input.trim();
            if (input.length === 0 || input.startsWith('//')) {
                return;
            }
            const scssVar = {
                name: input.split(':')[0].substring(1),
                value: input.split(':')[1].substring(1),
            }
            read(scssVar);
        });

        rl.on('close', () => {
            if (doDelete) {
                fs.unlink(scssFile, () => {
                    close();
                });
            } else {
                close();
            }
        });
    }
};

const parseConfigPaths = ({source, naming, vars, theme}) => {
    const config = {source, naming, vars, theme};
    Object.keys(config).filter(key => !!config[key]).forEach(key => config[key] = buildPath(config[key]));
    return config;
}

module.exports = {
    readVars,
    parseConfigPaths
};