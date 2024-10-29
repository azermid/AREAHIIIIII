// utils.js
async function camelCaseToSnakeCase(obj) {
    const newObj = {};
    for (const key in obj) {
        const newKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        newObj[newKey] = obj[key];
    }
    return newObj;
}

module.exports = camelCaseToSnakeCase;
