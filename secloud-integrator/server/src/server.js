// @ts-nocheck
const {
    createConnection,
    ProposedFeatures,
} = require('vscode-languageserver');

const {
    getFunctionCalls,
    getMLSuggestions,
    getMLDiagnostics
} = require('./MLHelper');

const Uri = require("vscode-uri");

const COMMANDS = {
    "runDynamicAC": "dynamicAccessControlCommand",
    "runDynamicIFC": "dynamicIFCCommand",
    "runMLModelRecommender": "runMLModelRecommenderCommand",
    "runStaticAC": "staticAccessControlCommand",
}

const IFCMonitor = require('./ifc-monitor');

let connection = createConnection(ProposedFeatures.all);

connection.onInitialize((params) => {
    let capabilities = params.capabilities
    return {
        capabilities: {
            executeCommandProvider: {
                commands: [COMMANDS.runDynamicIFC, COMMANDS.runDynamicAC, COMMANDS.runMLModelRecommender]
            },
            //codeActionProvider: "true",
        }
    }
});

connection.onExecuteCommand((params, cancelationToken) => {
    let diagnostics = [];

    console.log(params.command);
    switch (params.command) {
        case COMMANDS.runDynamicIFC:
            {
                try {
                    IFCMonitor.run(params.src);
                } catch (error) {
                    diagnostics.push(IFCMonitor.getDiagnostics(error));
                }
                break;
            }
        case COMMANDS.runMLModelRecommender:
            {
                const calls = getFunctionCalls(params.src);

                getMLSuggestions(calls).then(result => {
                    debugger;
                    connection.sendDiagnostics({
                        uri: params.docUri,
                        diagnostics: getMLDiagnostics(result)
                    });

                })
                break;
            }
    }
    debugger
    const uri = Uri.default.file(params.docUri.path);

    connection.sendDiagnostics({
        uri: uri,
        diagnostics: diagnostics
    });
})

//connection.onCodeAction(() => {})
connection.listen()