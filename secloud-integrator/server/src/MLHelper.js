const {
    parse
} = require("acorn");

const {
    generate
} = require("escodegen");

const {
    traverse,
    VisitorOption
} = require("estraverse")

const fetch = require("node-fetch");


const getFunctionCalls = (src) => {
    const calls = [];

    const ast = parse(src, {
        locations: true,
        ranges: true
    })

    traverse(ast, {
        enter: function (node, parent) {
            if (node.type === 'CallExpression' && (node.callee.name === 'tagAsSink' || node.callee.name === 'tagAsSource')) {
                return VisitorOption.Skip;
            } else if (node.type === 'CallExpression') {
                calls.push({
                    textRaw: generate(node),
                    loc: node.loc,
                    range: node.range
                })
            }
        }
    });
    return calls;
}

/**
 * Annotate each call in the array with ("Source" | "" | "Sink") class
 **/
const getMLSuggestions = (calls) => {
    // @ts-ignore
    return fetch('http://localhost:5000/classify', {
            method: 'post',
            body: JSON.stringify(calls),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(res => res.json());
}

/**
 * Converts the result of the machine learning to vscode Diagnostics
 */
const getDiagnostics = (annotatedCalls) => {
    const filteredCalls = annotatedCalls.filter((call) => {
        return call["class:"] && call["class:"] !== "";
    });

    let result = filteredCalls.map(call => {

        return {
            range: {
                start: {
                    line: call.loc.start.line - 1,
                    character: call.loc.start.column
                },
                end: {
                    line: call.loc.end.line - 1,
                    character: call.loc.end.column
                }
            },
            severity: 2, //Error
            code: call['class:'],
            source: 'ML Recommender',
            message: "Wrap with source or sink code",
            tags: [{
                src: call.textRaw
            }]
        }
    });
    return result;
}

exports.getFunctionCalls = getFunctionCalls;
exports.getMLSuggestions = getMLSuggestions;
exports.getMLDiagnostics = getDiagnostics;


// const calls = (getFunctionCalls(`// @ts-nocheck
// //No sensitive data can flow to the console.
// tagAsSink(console.log);

// const input = () => {
//   return tagAsSource('My Password here');
// };

// console.log('Hello world!');

// let f = input();
// let b = Math.pow(f, 2);

// if (true) {
//   console.log(b); //must be prevented
// }`))

// getMLSuggestions(calls).then(x => {
//     console.log((getDiagnostics(x)))
// })



// let uri = URI.default.file("/Users/soft/repos/secloud/secloud-integrator/test.js")

// console.log(uri)