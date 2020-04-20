import { commands, ExtensionContext } from 'vscode';
import { XamarinFormsGenerator } from './generators/xamarin-forms-generator';
import { XamariniOSGenerator } from './generators/xamarin-ios-generator';
import { XamarinAndroidGenerator } from './generators/xamarin-android-generator';

enum Keys {
	XamarinForms = 'xamarin.forms',
	XamariniOS = 'xamarin.ios',
	XamarinAndroid = 'xamarin.android',
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

	commands.registerCommand(`azuredevopsyamlgenerator.${Keys.XamarinAndroid}`, async () => {
		bootstrap(Keys.XamarinAndroid, context);
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
		case Keys.XamarinAndroid:
			generator = new XamarinAndroidGenerator();
			break;
		default:
			break;
	}

	if (generator) {
		generator.generate(context);
	}
}