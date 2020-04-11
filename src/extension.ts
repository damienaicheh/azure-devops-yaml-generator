import { window, commands, workspace, ExtensionContext, QuickPickItem, Disposable, CancellationToken, QuickInputButton, QuickInput, QuickInputButtons, Uri } from 'vscode';
import { MultiStepInput } from './helpers/multiStepCase';
import { YamlGenerator } from './generators/yamlGenerator';
import { IosXamarinGenerator } from './generators/iosXamarinGenerator';
import { AndroidXamarinGenerator } from './generators/androidXamarinGenerator';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	let disposable = commands.registerCommand('azuredevopsyamlgenerator.helloWorld', async () => {
		bootstrap();
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

async function bootstrap() {
	var generator: YamlGenerator;

	async function chooseTechnology(input: MultiStepInput) {

		const technologies: QuickPickItem[] = Array.from(TechnologyLabel.values())
			.sort((a, b) => (a > b ? -1 : 1)).map(label => ({ label }));

		const title = 'Which technology do you use?';

		const pick = await input.showQuickPick({
			title,
			placeholder: '',
			items: technologies,
			shouldResume: shouldResume
		});

		switch (getKeyFromValue(TechnologyLabel, pick.label)) {
			case Technology.XamariniOS:
				generator = new IosXamarinGenerator();
				break;
			case Technology.XamarinAndroid:
				generator = new AndroidXamarinGenerator();
				break;
			case Technology.XamarinForms:
				break;
			case Technology.iOS:
				break;
			case Technology.Android:
				break;
			case Technology.UWP:
				break;
		}

		return (input: MultiStepInput) => chooseFileName(input);
	}

	async function chooseFileName(input: MultiStepInput) {
		const title = 'Give a name to your yaml pipeline file';

		generator.fileName = await input.showInputBox({
			title,
			value: 'azure-pipelines.yml',
			prompt: 'Give a name to your yaml pipeline file',
			validate: validateFileName,
			shouldResume: shouldResume
		});

		async function validateFileName(name: string) {
			return name.endsWith('.yml') ? undefined : 'Make sure your file extension is \'.yml\'';
		}

		window.showInformationMessage(`You choose: ${generator.fileName}`);

		return (input: MultiStepInput) => enableUnitTests(input);
	}

	async function enableUnitTests(input: MultiStepInput) {

		const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

		const title = 'Do you want to run Unit Tests?';

		const pick = await input.showQuickPick({
			title,
			items: answers,
			shouldResume: shouldResume
		});

		var answer = getKeyFromValue(AnswerLabel, pick.label);
		generator.addUnitTest = answer === Answer.Yes;

		return (input: MultiStepInput) => enableAppCenterDistribution(input);
	}

	async function enableAppCenterDistribution(input: MultiStepInput) {

		const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

		const title = 'Do you want to distribute it using App Center?';

		const pick = await input.showQuickPick({
			title,
			items: answers,
			shouldResume: shouldResume
		});

		generator.addAppCenter = getKeyFromValue(AnswerLabel, pick.label) === Answer.Yes;

		generator.generate();
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

	await MultiStepInput.run(input => chooseTechnology(input));
}

enum Technology {
	XamariniOS,
	XamarinAndroid,
	XamarinForms,
	UWP,
	iOS,
	Android
}

export const TechnologyLabel = new Map<Technology, string>([
	[Technology.XamariniOS, 'Xamarin.iOS'],
	[Technology.XamarinAndroid, 'Xamarin.Android'],
	[Technology.XamarinForms, 'Xamarin.Forms'],
	[Technology.UWP, 'UWP'],
	[Technology.iOS, 'iOS'],
	[Technology.Android, 'Android'],
]);

enum Answer {
	No,
	Yes
}

export const AnswerLabel = new Map<Answer, string>([
	[Answer.Yes, 'Yes'],
	[Answer.No, 'No'],
]);