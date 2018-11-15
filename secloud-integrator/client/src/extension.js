const {
    workspace,
    commands,
    window
} = require('vscode');

const path = require('path');

const {
    LanguageClient,
    TransportKind,
    CancellationToken,
    ExecuteCommandRequest
} = require('vscode-languageclient');

let client;

const COMMANDS = {
    "MachineLearningSuggestions": "secloud.runMLModelRecommender",
    "IFCMonitor": "secloud.executeIFCMonitor"
}

function activate(context) {
    let serverModule = context.asAbsolutePath(
        path.join('server', 'src', 'server.js')
    )
    let debugOptions = {
        execArgv: ['--nolazy', '--inspect=6009']
    };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: {
            module: serverModule,
            transport: TransportKind.ipc
        },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions
        }
    };
    //Options to control de client module
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{
            scheme: 'file',
            language: 'javascript'
        }],
        // synchronize: {
        //     // Notify the server about file changes to '.clientrc files contained in the workspace
        //     //  fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
        // }
    };
    let client = new LanguageClient('SeCloud Security Server', 'Security Server module', serverOptions, clientOptions);
    //starts the client extension adn also the server
    //For calling the AC monitoring component
    let ml = commands.registerCommand(COMMANDS.MachineLearningSuggestions, () => {
        // @ts-ignore
        client.sendRequest(ExecuteCommandRequest.type, {
            command: "runMLModelRecommenderCommand",
            src: window.activeTextEditor.document.getText(),
            docUri: window.activeTextEditor.document.uri
        }, CancellationToken.None);
    });

    //For calling the IFC monitoring component
    let dynIFC = commands.registerCommand(COMMANDS.IFCMonitor, () => {
        // @ts-ignore
        client.sendRequest(ExecuteCommandRequest.type, {
            command: "dynamicIFCCommand",
            src: window.activeTextEditor.document.getText(),
            docUri: window.activeTextEditor.document.uri
        }, CancellationToken.None);
    });
    context.subscriptions.push(ml);
    context.subscriptions.push(dynIFC);
    context.subscriptions.push(client.start());
}

function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

exports.activate = activate;
exports.deactivate = deactivate;