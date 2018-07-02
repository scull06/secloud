const G = require('guardia-ifc/nomodels');

//var code = fs.readFileSync('./test/external/'+process.argv[2], "utf8");

try {
    eval(G.instrument(`
tagAsSink(console.log);
let f = tagAsSource(1);
let b = 2;

let c = b * f;
let x = 1;
if (c) {
  x = 2;
}
console.log(x);
    `))
} catch (error) {
    console.log(error);
}