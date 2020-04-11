import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "azuredevopsyamlgenerator" is now active!');

	let disposable = vscode.commands.registerCommand('azuredevopsyamlgenerator.helloWorld', async () => {
		const result = await vscode.window.showInputBox({
			value: 'azure-pipelines.yml',
			placeHolder: 'Give a name to your yaml pipeline file',
			validateInput: text => {
				return text.endsWith('.yml') ? null : 'Make sure your file extension is \'.yml\'';
			}
		});

		vscode.window.showInformationMessage(`You choose: ${result}`);

		//		vscode.window.showInformationMessage('Reload Hello World from AzureDevOpsYamlGenerator!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
