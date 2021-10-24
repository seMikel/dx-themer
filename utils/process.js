const {
    exec
} = require("child_process");
const path = require('path');

const execute = (command, args, cb) => {
    if (!command) {
        return;
    }
    if (!args) {
        args = [];
    }
    if (!cb) {
        cb = () => {};
    }
    exec(`${command} ${args.join(' ')}`, (error, output) => {
        if (error) {
            throw new Error(error.message)
        }
        cb(output);
    });
}

const buildPath = (pathArg) => {
    return path.isAbsolute(pathArg) ? pathArg : path.join(process.cwd(), pathArg);
}

module.exports = {
    execute,
    buildPath,
};