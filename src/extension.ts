import { commands, ExtensionContext } from 'vscode';
import { XamarinFormsGenerator } from './generators/xamarin-forms-generator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	let disposable = commands.registerCommand('azuredevopsyamlgenerator.xamarin.forms', async () => {
		bootstrap(context);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

async function bootstrap(context: ExtensionContext) {
	var generator = new XamarinFormsGenerator();

	generator.generate(context);
}