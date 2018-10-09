// @ts-nocheck
const {
    createConnection,
    ProposedFeatures,
} = require('vscode-languageserver');

const COMMANDS = {
    "runDynamicAC": "dynamicAccessControlCommand",
    "runDynamicIFC": "dynamicIFCCommand",
    "runAIVModelRecommender": "runAIVModelRecommenderCommand",
    "runStaticAC": "staticAccessControlCommand",
}

const IFCMonitor = require('./ifc-monitor');

let connection = createConnection(ProposedFeatures.all);

connection.onInitialize((params) => {
    let capabilities = params.capabilities
    return {
        capabilities: {
            executeCommandProvider: {
                commands: [COMMANDS.runDynamicIFC, COMMANDS.runDynamicAC]
            },
        }
    }
});

connection.onExecuteCommand((params, cancelationToken) => {
    let diagnostics = [];
    switch (params.command) {
        case COMMANDS.runDynamicIFC:
            {
                console.log('Executing the dynamic component');
                try {
                    IFCMonitor.run(params.src);
                } catch (error) {
                    diagnostics.push(IFCMonitor.getDiagnostics(error));
                }
                break;
            }
        case COMMANDS.runDynamicAC:
            {
                //call to the static Guardia
                break;
            }
    }
    connection.sendDiagnostics({
        uri: params.docUri.path,
        diagnostics: diagnostics
    });
})
connection.listen()