const vscode = require('vscode');

exports.IFCCodeActionProvider = class IFCCodeActionProvider {

    constructor(dgtcs) {
        this.diagnostics = dgtcs;

    }

    provideCodeActions(document, range, context, token) {
        // for (let diagnostic of this.diagnostics) {
        // }
        return [createCodeAction("IFC sinks refactoring:", vscode.CodeActionKind.RefactorRewrite)];
    }
}

const createCodeAction = (title, kind, diagnostics, range) => {
    let codeAction = new vscode.CodeAction(title, kind);
    codeAction.range = range;
    codeAction.diagnostics = diagnostics;
    return codeAction;
}