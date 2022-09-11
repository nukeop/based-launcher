// Adapted from https://github.com/Zettlr/Zettlr

const path = require("path");
const ver = require(path.join(__dirname, "../package.json")).version;
console.log(ver.indexOf("+") > -1 ? ver.split("+")[0] : ver);
