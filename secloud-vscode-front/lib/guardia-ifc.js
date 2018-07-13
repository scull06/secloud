const G = require('guardia-ifc/index');

let slModels = require('guardia-ifc/models/sl-model');

slModels.setup(G.extlib);
//var code = fs.readFileSync('./test/external/'+process.argv[2], "utf8");

try {
    eval(G.instrument(`
console.log
let f = 12;
let b = Math.pow(f,2);
console.log('b');
    `))
} catch (error) {
    console.log(error);
}