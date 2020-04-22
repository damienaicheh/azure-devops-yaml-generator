import { commands, ExtensionContext, window } from 'vscode';
import { XamarinFormsGenerator } from './generators/xamarin-forms-generator';
import { XamariniOSGenerator } from './generators/xamarin-ios-generator';
import { XamarinAndroidGenerator } from './generators/xamarin-android-generator';

enum Keys {
	XamarinForms = 'xamarin.forms',
	XamariniOS = 'xamarin.ios',
	XamarinAndroid = 'xamarin.android',
	UWP = 'uwp'
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	commands.registerCommand(`azure-pipeline-yaml-generator.${Keys.XamarinForms}`, async () => {
		bootstrap(Keys.XamarinForms, context);
	});

	commands.registerCommand(`azure-pipeline-yaml-generator.${Keys.XamariniOS}`, async () => {
		bootstrap(Keys.XamariniOS, context);
	});

	commands.registerCommand(`azure-pipeline-yaml-generator.${Keys.XamarinAndroid}`, async () => {
		bootstrap(Keys.XamarinAndroid, context);
	});

	commands.registerCommand(`azure-pipeline-yaml-generator.${Keys.UWP}`, async () => {
		bootstrap(Keys.UWP, context);
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
		case Keys.UWP:
			window.showInformationMessage("Not implemented yet");
			break;
		default:
			break;
	}

	if (generator) {
		generator.generate(context);
	}
}