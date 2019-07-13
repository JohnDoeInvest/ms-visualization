const fs = require('fs');
const path = require('path');
const BASE_ASSET_URL = 'src/assets/d3/';
const DESTINATION_URL = 'src/lib/d3/types/icon.types.js';

const ICONS = [
    { variableName: 'DB_SHARED_ICON', path: 'icn-db-shared.svg' },
    { variableName: 'DB_ICON', path: 'icn-db.svg' },
    { variableName: 'DELETE_API_ICON', path: 'icn-delete.svg' },
    { variableName: 'GET_API_ICON', path: 'icn-get.svg' },
    { variableName: 'GET_ID_API_ICON', path: 'icn-getID.svg' },
    { variableName: 'POST_API_ICON', path: 'icn-post.svg' },
    { variableName: 'PUT_API_ICON', path: 'icn-put.svg' },
    { variableName: 'KAFKA_ICON', path: 'icn-kafka.svg' },
    { variableName: 'SERVICE_ICON', path: 'icn-service.svg' },
    { variableName: 'GLOBAL_ICON', path: 'icn-global.svg' },
];

let content = ''

console.log('Start creating icons');

for (const icon of ICONS) {
    const data = fs.readFileSync(BASE_ASSET_URL + icon.path);
    const iconContent = createContent(icon.variableName, data);
    content = content + '\n\n' + iconContent; 
}

if (content) {
    content = `/* eslint-disable */ \n\n` + content;
    writeIconsDataToFile(content);
    console.log('Created icons successfully!');
}

function writeIconsDataToFile(str) {
    const writeStream = fs.createWriteStream(DESTINATION_URL);
    writeStream.write(str);
    writeStream.end();
}

function createContent(variableName, content) {
    return `export const ${variableName} = \`
        ${content}
    \``;
}


