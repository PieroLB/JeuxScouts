const {readFile} = require('fs');
const {promisify} = require('util');

module.exports = async () => {
    const readFilePromisified = promisify(readFile);
    // Récupération du fichier html
    const html = await readFilePromisified('../CLIENT/index.html', 'utf8');
    return html;
}