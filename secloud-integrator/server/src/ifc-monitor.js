const G = require('guardia-ifc/index');
let slModels = require('guardia-ifc/models/sl-model');
slModels.setup(G.extlib);

exports.run = (code) => {
    global.eval(G.instrument(code));
}  

exports.getDiagnostics = (error) => {
    let node = error.node; //start ... end
    //{SEE: 'Diagnostic' in https://github.com/Microsoft/language-server-protocol/blob/master/versions/protocol-2-x.md }
    return {
        range: {
            start: {
                line: node.loc.start.line - 1,
                character: node.loc.start.column
            },
            end: {
                line: node.loc.end.line - 1,
                character: node.loc.end.column
            }
        },
        severity: 1, //Error
        //code: "Something",
        source: 'IFC Monitor',
        message: "Information Flow Violation"
    }
}