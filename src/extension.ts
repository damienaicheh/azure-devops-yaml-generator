import { window, commands, workspace, ExtensionContext, QuickPickItem, Disposable, CancellationToken, QuickInputButton, QuickInput, QuickInputButtons, Uri } from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
const YAML = require('yaml');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	let disposable = commands.registerCommand('azuredevopsyamlgenerator.helloWorld', async () => {
		configureYaml(context);
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

class ProjectConfiguration {
	fileName: string = 'azure-pipelines.yml';
	technology: Technology | undefined;
	enableUnitTest: boolean | undefined;
	enableAppCenter: boolean | undefined;
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

export async function configureYaml(context: ExtensionContext) {

	async function chooseFileName(configuration: ProjectConfiguration, input: MultiStepInput) {
		const title = 'Give a name to your yaml pipeline file';

		configuration.fileName = await input.showInputBox({
			title,
			value: 'azure-pipelines.yml',
			prompt: 'Give a name to your yaml pipeline file',
			validate: validateFileName,
			shouldResume: shouldResume
		});

		async function validateFileName(name: string) {
			return name.endsWith('.yml') ? undefined : 'Make sure your file extension is \'.yml\'';
		}

		window.showInformationMessage(`You choose: ${configuration.fileName}`);

		return (input: MultiStepInput) => chooseTechnology(configuration, input);
	}

	async function chooseTechnology(configuration: ProjectConfiguration, input: MultiStepInput) {

		const technologies: QuickPickItem[] = Array.from(TechnologyLabel.values())
			.sort((a, b) => (a > b ? -1 : 1)).map(label => ({ label }));

		const title = 'Which technology do you use?';

		const pick = await input.showQuickPick({
			title,
			placeholder: '',
			items: technologies,
			shouldResume: shouldResume
		});

		configuration.technology = getKeyFromValue(TechnologyLabel, pick.label);

		return (input: MultiStepInput) => enableUnitTests(configuration, input);
	}

	function getKeyFromValue<T>(map: Map<T, string>, search: string) {
		for (let [key, value] of map.entries()) {
			if (value === search) {
				return key;
			}
		}
	}

	async function enableUnitTests(configuration: ProjectConfiguration, input: MultiStepInput) {

		const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

		const title = 'Do you want to run Unit Tests?';

		const pick = await input.showQuickPick({
			title,
			items: answers,
			shouldResume: shouldResume
		});

		var answer = getKeyFromValue(AnswerLabel, pick.label);
		configuration.enableUnitTest = answer === Answer.Yes;

		return (input: MultiStepInput) => enableAppCenterDistribution(configuration, input);
	}

	async function enableAppCenterDistribution(configuration: ProjectConfiguration, input: MultiStepInput) {

		const answers: QuickPickItem[] = Array.from(AnswerLabel.values()).map(label => ({ label }));

		const title = 'Do you want to distribute it using App Center?';

		const pick = await input.showQuickPick({
			title,
			items: answers,
			shouldResume: shouldResume
		});

		configuration.enableAppCenter = getKeyFromValue(AnswerLabel, pick.label) === Answer.Yes;

		await create();
	}

	function shouldResume() {
		// Could show a notification with the option to resume.
		return new Promise<boolean>((resolve, reject) => {

		});
	}

	async function create() {
		const folderPath = workspace.rootPath ?? '';
		console.log(folderPath);

		const object = {
			pool: { vmImage: 'macOS-latest' },
			steps: [{
				script: 'sudo $AGENT_HOMEDIRECTORY/scripts/select-xamarin-sdk.sh 6_4_0',
				displayName: 'Select the Xamarin SDK version',
				enabled: true,
			}, {
				task: 'InstallAppleCertificate@2',
				inputs: {
					certSecureFile: '$(p12FileName)',
					certPwd: '$(p12Password)',
					keychain: 'temp',
					deleteCert: true
				}
			}],
		};

		const yamlContent = YAML.stringify(object);

		fs.writeFile(path.join(folderPath, configuration.fileName), yamlContent, err => {
			if (err) {
				console.log(err);
				return window.showErrorMessage(
					"Failed to create file!"
				);
			}
			window.showInformationMessage('Generation done.');
		});
	}


	//const state = {} as Partial<State>;
	var configuration = new ProjectConfiguration();
	await MultiStepInput.run(input => chooseFileName(configuration, input));

	console.log(configuration);
}

// -------------------------------------------------------
// Helper code that wraps the API for the multi-step case.
// -------------------------------------------------------

class InputFlowAction {
	private constructor() { }
	static back = new InputFlowAction();
	static cancel = new InputFlowAction();
	static resume = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
	title: string;
	items: T[];
	shouldResume: () => Thenable<boolean>;
	placeholder?: string;
	step?: number;
	totalSteps?: number;
	activeItem?: T;
	buttons?: QuickInputButton[];
}

interface InputBoxParameters {
	title: string;
	value: string;
	prompt: string;
	validate: (value: string) => Promise<string | undefined>;
	shouldResume: () => Thenable<boolean>;
	step?: number;
	totalSteps?: number;
	buttons?: QuickInputButton[];
}

class MultiStepInput {

	static async run<T>(start: InputStep) {
		const input = new MultiStepInput();
		return input.stepThrough(start);
	}

	private current?: QuickInput;
	private steps: InputStep[] = [];

	private async stepThrough<T>(start: InputStep) {
		let step: InputStep | void = start;
		while (step) {
			this.steps.push(step);
			if (this.current) {
				this.current.enabled = false;
				this.current.busy = true;
			}
			try {
				step = await step(this);
			} catch (err) {
				if (err === InputFlowAction.back) {
					this.steps.pop();
					step = this.steps.pop();
				} else if (err === InputFlowAction.resume) {
					step = this.steps.pop();
				} else if (err === InputFlowAction.cancel) {
					step = undefined;
				} else {
					throw err;
				}
			}
		}
		if (this.current) {
			this.current.dispose();
		}
	}

	async showQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({ title, step, totalSteps, items, activeItem, placeholder, buttons, shouldResume }: P) {
		const disposables: Disposable[] = [];
		try {
			return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = window.createQuickPick<T>();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.placeholder = placeholder;
				input.items = items;

				if (activeItem) {
					input.activeItems = [activeItem];
				}

				input.buttons = [
					...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
					...(buttons || [])
				];

				disposables.push(
					input.onDidTriggerButton(item => {
						if (item === QuickInputButtons.Back) {
							reject(InputFlowAction.back);
						} else {
							resolve(<any>item);
						}
					}),
					input.onDidChangeSelection(items => resolve(items[0])),
					input.onDidHide(() => {
						(async () => {
							reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
						})()
							.catch(reject);
					})
				);

				if (this.current) {
					this.current.dispose();
				}

				this.current = input;
				this.current.show();
			});
		} finally {
			disposables.forEach(d => d.dispose());
		}
	}

	async showInputBox<P extends InputBoxParameters>({ title, step, totalSteps, value, prompt, validate, buttons, shouldResume }: P) {
		const disposables: Disposable[] = [];
		try {
			return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = window.createInputBox();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.value = value || '';
				input.prompt = prompt;
				input.buttons = [
					...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
					...(buttons || [])
				];
				let validating = validate('');
				disposables.push(
					input.onDidTriggerButton(item => {
						if (item === QuickInputButtons.Back) {
							reject(InputFlowAction.back);
						} else {
							resolve(<any>item);
						}
					}),
					input.onDidAccept(async () => {
						const value = input.value;
						input.enabled = false;
						input.busy = true;
						if (!(await validate(value))) {
							resolve(value);
						}
						input.enabled = true;
						input.busy = false;
					}),
					input.onDidChangeValue(async text => {
						const current = validate(text);
						validating = current;
						const validationMessage = await current;
						if (current === validating) {
							input.validationMessage = validationMessage;
						}
					}),
					input.onDidHide(() => {
						(async () => {
							reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
						})()
							.catch(reject);
					})
				);
				if (this.current) {
					this.current.dispose();
				}
				this.current = input;
				this.current.show();
			});
		} finally {
			disposables.forEach(d => d.dispose());
		}
	}
}