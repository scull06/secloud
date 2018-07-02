const vscode = require('vscode');


const {
    StatusBarAlignment
} = vscode;

function activate(context) {
    let ifcChecker = new IFCChecker(vscode.window);
    let disposable = vscode.commands.registerCommand('extension.executeIFC', function () {
        ifcChecker.runOnActiveEditor();
    });
    context.subscriptions.push(ifcChecker);
    context.subscriptions.push(disposable);
    console.log('Guardia IFC extension Active!');
}

function deactivate() {

}

class IFCChecker {
    constructor(window) {
        let flag = false;
        this.window = window;
        this.statusBarItem = this.window.createStatusBarItem(StatusBarAlignment.Left, 4);
        this.srcText = '';

        this.ifcLeakingStatementDecorationType = vscode.window.createTextEditorDecorationType({
            borderWidth: '1px',
            borderStyle: 'solid',
            overviewRulerColor: 'yellow',
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            light: {
                // this color will be used in light color themes
                borderColor: 'red'
            },
            dark: {
                // this color will be used in dark color themes
                borderColor: 'red'
            }
        });

        //Removing decorations
      this.changeDisposable =  vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.document === vscode.window.activeTextEditor.document) {
                vscode.window.activeTextEditor.setDecorations(this.ifcLeakingStatementDecorationType, []);
            }
        });
    }

    runOnActiveEditor() {
        //this.statusBarItem.show()
        if (vscode.window.activeTextEditor) {
            this.srcText = vscode.window.activeTextEditor.document.getText();
            this.runIFCMonitor(this.srcText);
        }
    }

    runIFCMonitor(src) {
        const G = require('guardia-ifc/nomodels');
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