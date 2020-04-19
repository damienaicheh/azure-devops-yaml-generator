import { commands, ExtensionContext } from 'vscode';
import { XamarinFormsGenerator } from './generators/xamarin-forms-generator';
import { XamariniOSGenerator } from './generators/xamarin-ios-generator';

enum Keys {
	XamarinForms = 'xamarin.forms',
	XamariniOS = 'xamarin.ios',
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	commands.registerCommand(`azuredevopsyamlgenerator.${Keys.XamarinForms}`, async () => {
		bootstrap(Keys.XamarinForms, context);
	});

	commands.registerCommand(`azuredevopsyamlgenerator.${Keys.XamariniOS}`, async () => {
		bootstrap(Keys.XamariniOS, context);
	});

	//context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

async function bootstrap(key: string, context: ExtensionContext) {
	var generator = undefined;

	switch (key) {
		case Keys.XamarinForms:
			generator = new XamarinFormsGenerator();
			break;
		case Keys.XamariniOS:
			generator = new XamariniOSGenerator();
			break;

		default:
			break;
	}

	if (generator) {
		generator.generate(context);
	}
}