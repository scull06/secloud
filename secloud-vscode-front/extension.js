const vscode = require('vscode');
const vulnModel = require("./mlModeBuilder");
// const {
//     IFCCodeActionProvider
// } = require("./actionProvider");


const {
    StatusBarAlignment
} = vscode;

function activate(context) {
    let ifcChecker = new IFCChecker(vscode.window);

    //Registering commands to run the different tools

    let ifcDisposable = vscode.commands.registerCommand('extension.executeIFC', function () {
        ifcChecker.runOnActiveEditor();
    });

    let mlDisposable = vscode.commands.registerCommand('extension.suggestSourcesAndSinks', function () {
        //TODO: run the machine learning for the code...
        console.log("Suggesting sources and sinks....");
        ifcChecker.updateVulDiagCollection();
    });


    context.subscriptions.push(ifcChecker);
    context.subscriptions.push(ifcDisposable);
    context.subscriptions.push(mlDisposable);

    console.log('Guardia IFC extension Active!');
}``

function deactivate() {

}

class IFCChecker {
    constructor(window) {
        this.flag = false;
        this.window = window;
        this.srcText = '';
        this.statusBarItem = this.window.createStatusBarItem(StatusBarAlignment.Left, 4);
        this.diagnostics = vscode.languages.createDiagnosticCollection("sources-sinks");
        this.ifcLeakingStatementDecorationType = vscode.window.createTextEditorDecorationType({
            borderWidth: '1px',
            borderStyle: 'solid',
            overviewRulerColor: 'yellow',
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            light: {
                borderColor: 'red'
            },
            dark: {
                borderColor: 'red'
            }
        });

        //Removing decorations
        this.changeDisposable = vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.document === vscode.window.activeTextEditor.document) {
                vscode.window.activeTextEditor.setDecorations(this.ifcLeakingStatementDecorationType, []);
                this.diagnostics.clear();
            }
        });
    }

    runOnActiveEditor() {
        if (vscode.window.activeTextEditor) {
            this.srcText = vscode.window.activeTextEditor.document.getText();
            this.runIFCMonitor(this.srcText);
        }
    }

    /**
     * Feeds the ML component with the source code and get back a model of sources and sinks with AST information
     */
    updateVulDiagCollection() {
        if (vscode.window.activeTextEditor) {
            this.srcText = vscode.window.activeTextEditor.document.getText();
            let diagnostics = vulnModel.getDiagnostics(this.srcText);
            this.diagnostics.set(vscode.window.activeTextEditor.document.uri, diagnostics.sinkDiagnostics);
            //registering the CodeActionProvider for refactoring
         //   vscode.languages.registerCodeActionsProvider("javascript", new IFCCodeActionProvider(diagnostics.sinkDiagnostics));
        }
    }

    /**
     * 
     * @param {*} src JavaScript code with annotations of sources and sinks 
     * e.g: 
     * tagAsSink(console.log);
     * ...
     * let passowrd = tagAsSource($('.password-field').get('value'));
     * 
     */
    runIFCMonitor(src) {
        /**
         * Setting up Guardia IFC.
         */
        const G = require('guardia-ifc/index');
        let slModels = require('guardia-ifc/models/sl-model');
        slModels.setup(G.extlib);

        let instCode = G.instrument(src);
        try {
            global.eval(instCode);
        } catch (error) {
            this.flag = true;
            this.handleResult(error)
        } finally {
            if (!this.flag)
                this.statusBarItem.text = "All OK!";
        }
    }

    handleResult(obj) {
        if (this.flag) {
            this.statusBarItem.text = `Illicit IFC at: ${obj.node.type}.`;
            const startPos = vscode.window.activeTextEditor.document.positionAt(obj.node.start);
            const endPos = vscode.window.activeTextEditor.document.positionAt(obj.node.end);
            const decoration = {
                range: vscode.window.activeTextEditor.document.validateRange(new vscode.Range(startPos, endPos)),
                hoverMessage: 'Information Flow Violation'
            };
            vscode.window.activeTextEditor.setDecorations(this.ifcLeakingStatementDecorationType, [decoration]);
        }
    }

    setItemStyle(color) {
        this.statusBarItem.color = color
    }

    dispose() {
        this.statusBarItem.dispose();
        this.changeDisposable.dispose();
    }
}

exports.activate = activate;
exports.deactivate = deactivate;