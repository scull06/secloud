const acorn = require('acorn');
const walk = require('acorn/dist/walk');
const vscode = require("vscode");


const getDiagnostics = (src) => {

    let ast = getAST(src);

    //Call ML component whith the following payload {code: src , ast: src_ast }
    //See ESTREE project for JavaScript AST format
    //fetch( serverURl ,...).then(callback) //callback will process the vulnerability model
    //The vulnerability model should include AST information enhanced with sources and sinks.

    let vulnerableNodes = getVulnerabilities({
        src: src,
        ast: ast
    });

    return {
        sinkDiagnostics: vulnerableNodes['sinkNodes'].map(sink => sinkDiagnostic(sink)),
        sourcesDiagnostics: [] //TODO: fill this.
    }

}

const sinkDiagnostic = (node) => {
    let start = new vscode.Position(node.loc.start.line - 1, node.loc.start.column);
    let end = new vscode.Position(node.loc.start.line - 1, node.loc.end.column);
    let range = new vscode.Range(start, end);
    return new vscode.Diagnostic(range, " This call is considered a sink of sensitive information!", vscode.DiagnosticSeverity.Error);
}



const getVulnerabilities = (payload) => {
    let sinkNodes = []
    walk.simple(payload.ast, {
        CallExpression(node) {
            if (IsSink(node)) {
                sinkNodes.push(node);
            }
        }
    });
    return {
        sinkNodes: sinkNodes,
        sourceNodes: [ /** TBD */ ]
    };
}

//TODO: TEMP!
const IsSink = (node) => {
    if (node.callee.type === 'MemberExpression' && node.callee.object.name === 'console' && node.callee.property.name === 'log') {
        return true;
    }
    return false;
}



const getAST = (src) => {
    return acorn.parse(src, {
        locations: true,

    })
}


console.log(JSON.stringify(getVulnerabilities({
    ast: getAST("console.log(123)")
}), null, 4))
//console.log(JSON.stringify(getAST("console.log(123)"), null, 2))

exports.getDiagnostics = getDiagnostics;