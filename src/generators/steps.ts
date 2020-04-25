import { window, QuickPickItem } from 'vscode';
import { YamlGenerator } from "./yaml-generator";
import { MultiStepInput } from '../helpers/multi-step-case';

export async function chooseFileName(generator: YamlGenerator, input: MultiStepInput) {
    generator.fileName = await inputText(generator, input, 'Give a name to your yaml pipeline file', 'azure-pipelines.yml', 'The file name must finish with .yml extension', validateFileName);

    async function validateFileName(text: string) {
        return text.endsWith('.yml') ? undefined : 'Make sure your file extension is \'.yml\'';
    }

    window.showInformationMessage(`You choose: ${generator.fileName}`);
}

export async function chooseProjectName(generator: YamlGenerator, input: MultiStepInput) {
    generator.projectName = await inputText(generator, input, 'Give the same project name', 'ProjectName', 'The project name must not have spaces.', validateProjectName);

    async function validateProjectName(text: string) {
        return (/^\s*$/.test(text) || /\s/.test(text)) ? 'Make sur you don\'t have any spaces in your project name' : undefined;
    }
}

export async function enableUnitTests(generator: YamlGenerator, input: MultiStepInput) {
    generator.unitTests = await booleanPicker(generator, input, 'Do you want to run Unit Tests?');
}

export async function androidPackageType(generator: YamlGenerator, input: MultiStepInput) {
    generator.useAab = await booleanPicker(generator, input, 'What type of Android package do you want to use?', 'Android App Bundle (Recommanded)', 'Apk');
}

export async function manageVersionAutomatically(generator: YamlGenerator, input: MultiStepInput) {
    generator.automaticVersion = await booleanPicker(generator, input, 'Manage version automatically? (Git tag required)');
}

export async function updateIdentifier(generator: YamlGenerator, input: MultiStepInput) {
    generator.updateIdentifier = await booleanPicker(generator, input, 'Manage application identifier?');
}

export async function addLaunchIconBadge(generator: YamlGenerator, input: MultiStepInput) {
    generator.launchIconBadge = await booleanPicker(generator, input, 'Add launch icon badge?');
}

export async function publishArtifacts(generator: YamlGenerator, input: MultiStepInput) {
    generator.generateArtifacts = await booleanPicker(generator, input, 'Do you want to publish tha artifacts?');
}

export async function enableAppCenterDistribution(generator: YamlGenerator, input: MultiStepInput) {
    generator.distribute = await booleanPicker(generator, input, 'Do you want to distribute it using App Center?');
}

function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>(() => {

    });
}

export async function inputText(generator: YamlGenerator, input: MultiStepInput, title: string, defaultValue: string, prompt: string, validate: any) {

    const inputResult = await input.showInputBox({
        title,
        value: defaultValue,
        step: generator.currentStep,
        totalSteps: generator.steps.length,
        prompt: prompt,
        validate: validate,
        shouldResume: shouldResume
    });

    generator.currentStep++;

    return inputResult;
}

export async function booleanPicker(generator: YamlGenerator, input: MultiStepInput, title: string, yesOption: string = 'Yes', noOption: string = 'No') {

    const answers: QuickPickItem[] = [yesOption, noOption].map(label => ({ label }));

    const pick = await input.showQuickPick({
        title,
        step: generator.currentStep,
        totalSteps: generator.steps.length,
        items: answers,
        shouldResume: shouldResume
    });

    generator.currentStep++;

    return pick.label === yesOption;
}