// @ts-nocheck
const {
    createConnection,
    ProposedFeatures, TextDocuments 
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

const server = {
    codeActionProvider: {
        provideCodeActions: function (document, range, context, token) {
            const diagnostic = context.diagnostics[0];
            if (diagnostic && diagnostic.code === "Source") {
                //const replacement = `tagAsSource(${diagnostic.src})`;
                return [{
                    title: "Tag as sensitive information",
                    command: "refactorML",
                    arguments: [document, diagnostic, "replacement"]
                }]
            }
            return []
        }
    }
};

connection.onInitialize((params) => {
    let capabilities = params.capabilities
    return {
        capabilities: {
            executeCommandProvider: {
                commands: [COMMANDS.runDynamicIFC, COMMANDS.runDynamicAC, COMMANDS.runMLModelRecommender]
            },
            codeActionProvider: "true",
        }
    }
});

connection.onExecuteCommand((params, cancelationToken) => {

    switch (params.command) {
        case COMMANDS.runDynamicIFC:
            {
                let diagnostics = [];
                try {
                    IFCMonitor.run(params.src);
                } catch (error) {
                    diagnostics.push(IFCMonitor.getDiagnostics(error));
                    connection.sendDiagnostics({
                        uri: params.docUri.external,
                        diagnostics: diagnostics
                    });
                }
                break;
            }
        case COMMANDS.runMLModelRecommender:
            {
                const calls = getFunctionCalls(params.src);
                getMLSuggestions(calls).then(result => {
                    connection.sendDiagnostics({
                        uri: params.docUri.external,
                        diagnostics: getMLDiagnostics(result)
                    });
                })
                break;
            }
    }
})

const sendDiagnostics = (uri) => {
    connection.sendDiagnostics({
        uri: uri,
        diagnostics: diagnostics
    });
}

connection.onCodeAction((params) => {
    return server.codeActionProvider.provideCodeActions(params.textDocument, params.range, params.context)
})

connection.listen();