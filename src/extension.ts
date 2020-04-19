import { window, commands, workspace, ExtensionContext, QuickPickItem, Disposable, CancellationToken, QuickInputButton, QuickInput, QuickInputButtons, Uri } from 'vscode';
import { MultiStepInput } from './helpers/multi-step-case';
import { YamlGenerator } from './generators/yaml-generator';
import { chooseFileName, enableUnitTests, manageVersionAutomatically, setIdenfier, addLaunchIconBadge, publishArtifacts, enableAppCenterDistribution } from './generators/steps';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	let disposable = commands.registerCommand('azuredevopsyamlgenerator.xamarin.ios', async () => {
		bootstrap(context);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

async function bootstrap(context: ExtensionContext) {
	var generator = new YamlGenerator();
	var currentStep = 1;
	var totalStep = 7;


	//await MultiStepInput.run(input => chooseFileName(generator, currentStep, totalStep, input, context));
	await MultiStepInput.runAll([
		input => chooseFileName(generator, currentStep, totalStep, input, context),
		input => enableUnitTests(generator, currentStep, totalStep, input, context),
		input => manageVersionAutomatically(generator, currentStep, totalStep, input, context),
		input => setIdenfier(generator, currentStep, totalStep, input, context),
		input => addLaunchIconBadge(generator, currentStep, totalStep, input, context),
		input => publishArtifacts(generator, currentStep, totalStep, input, context),
		input => enableAppCenterDistribution(generator, currentStep, totalStep, input, context),
	]);

	generator.generate(context);

}

export async function showQuickPick() {
	let i = 0;
	const result = await window.showQuickPick(['eins', 'zwei', 'drei'], {
		placeHolder: 'eins, zwei or drei',
		onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
	});
	window.showInformationMessage(`Got: ${result}`);
}
