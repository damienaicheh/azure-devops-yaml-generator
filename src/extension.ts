import { window, commands, workspace, ExtensionContext, QuickPickItem, Disposable, CancellationToken, QuickInputButton, QuickInput, QuickInputButtons, Uri } from 'vscode';
import { MultiStepInput } from './helpers/multi-step-case';
import { YamlGenerator } from './generators/yaml-generator';

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

	async function chooseFileName(input: MultiStepInput, context: ExtensionContext) {
		const title = 'Give a name to your yaml pipeline file';

		generator.fileName = await input.showInputBox({
			title,
			value: 'azure-pipelines.yml',
			step: currentStep,
			totalSteps: totalStep,
			prompt: 'Give a name to your yaml pipeline file',
			validate: validateFileName,
			shouldResume: shouldResume
		});

		async function validateFileName(name: string) {
			return name.endsWith('.yml') ? undefined : 'Make sure your file extension is \'.yml\'';
		}

		window.showInformationMessage(`You choose: ${generator.fileName}`);

		currentStep++;

		return (input: MultiStepInput) => enableUnitTests(input, context);
	}

	async function enableUnitTests(input: MultiStepInput, context: ExtensionContext) {

		const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

		const title = 'Do you want to run Unit Tests?';

		const pick = await input.showQuickPick({
			title,
			step: currentStep,
			totalSteps: totalStep,
			items: answers,
			shouldResume: shouldResume
		});

		var answer = getKeyFromValue(AnswerLabel, pick.label);
		generator.unitTests = answer === Answer.Yes;

		currentStep++;

		return (input: MultiStepInput) => manageVersionAutomatically(input, context);
	}

	async function manageVersionAutomatically(input: MultiStepInput, context: ExtensionContext) {

		const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

		const title = 'Manage version automatically?';

		const pick = await input.showQuickPick({
			title,
			step: currentStep,
			totalSteps: totalStep,
			items: answers,
			shouldResume: shouldResume
		});

		var answer = getKeyFromValue(AnswerLabel, pick.label);
		generator.automaticVersion = answer === Answer.Yes;

		currentStep++;

		return (input: MultiStepInput) => setIdenfier(input, context);
	}

	async function setIdenfier(input: MultiStepInput, context: ExtensionContext) {

		const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

		const title = 'Manage application identifier?';

		const pick = await input.showQuickPick({
			title,
			step: currentStep,
			totalSteps: totalStep,
			items: answers,
			shouldResume: shouldResume
		});

		var answer = getKeyFromValue(AnswerLabel, pick.label);
		//generator.automaticVersion = answer === Answer.Yes;

		currentStep++;

		return (input: MultiStepInput) => addLaunchIconBadge(input, context);
	}

	async function addLaunchIconBadge(input: MultiStepInput, context: ExtensionContext) {

		const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

		const title = 'Add launch icon badge?';

		const pick = await input.showQuickPick({
			title,
			step: currentStep,
			totalSteps: totalStep,
			items: answers,
			shouldResume: shouldResume
		});

		var answer = getKeyFromValue(AnswerLabel, pick.label);
		generator.launchIconBadge = answer === Answer.Yes;

		currentStep++;

		return (input: MultiStepInput) => publishArtifacts(input, context);
	}

	async function publishArtifacts(input: MultiStepInput, context: ExtensionContext) {

		const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

		const title = 'Do you want to publish tha artifacts?';

		const pick = await input.showQuickPick({
			title,
			step: currentStep,
			totalSteps: totalStep,
			items: answers,
			shouldResume: shouldResume
		});

		generator.distribute = getKeyFromValue(AnswerLabel, pick.label) === Answer.Yes;

		currentStep++;

		return (input: MultiStepInput) => enableAppCenterDistribution(input, context);
	}

	async function enableAppCenterDistribution(input: MultiStepInput, context: ExtensionContext) {

		const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

		const title = 'Do you want to distribute it using App Center?';

		const pick = await input.showQuickPick({
			title,
			step: currentStep,
			totalSteps: totalStep,
			items: answers,
			shouldResume: shouldResume
		});

		generator.distribute = getKeyFromValue(AnswerLabel, pick.label) === Answer.Yes;

		generator.generate(context);
	}

	function getKeyFromValue<T>(map: Map<T, string>, search: string) {
		for (let [key, value] of map.entries()) {
			if (value === search) {
				return key;
			}
		}
	}

	function shouldResume() {
		// Could show a notification with the option to resume.
		return new Promise<boolean>((resolve, reject) => {

		});
	}

	await MultiStepInput.run(input => chooseFileName(input, context));
}

enum Answer {
	No,
	Yes
}

export const AnswerLabel = new Map<Answer, string>([
	[Answer.Yes, 'Yes'],
	[Answer.No, 'No'],
]);