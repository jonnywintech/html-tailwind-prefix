const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('tailwind-prefixer.addPrefix', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor!');
            return;
        }

        const document = editor.document;
        const text = document.getText();

        // Regular expression to match class attributes
        const classRegex = /class="([^"]*)"/g;

        // Function to process class names
        const processClasses = (match, classNames) => {
            const classes = classNames.split(' ');
            const processedClasses = classes.map(cls => {
                // Skip if class already has tw- prefix or is empty
                if (cls.includes('_')) {
                    return cls;
                }
                if (cls.startsWith('tw-') || !cls.trim()) {
                    return cls;
                }
                return `tw-${cls}`;
            });
            return `class="${processedClasses.join(' ')}"`;
        };

        // Replace all class attributes
        const newText = text.replace(classRegex, processClasses);

        // Apply the edit
        editor.edit(editBuilder => {
            const fullRange = new vscode.Range(
                document.positionAt(0),
                document.positionAt(text.length)
            );
            editBuilder.replace(fullRange, newText);
        }).then(success => {
            if (success) {
                vscode.window.showInformationMessage('Successfully added tw- prefix to Tailwind classes!');
            } else {
                vscode.window.showErrorMessage('Failed to add prefixes!');
            }
        });
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};