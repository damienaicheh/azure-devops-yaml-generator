import { window, QuickPickItem } from 'vscode';
import { YamlGenerator } from "./yaml-generator";
import { MultiStepInput } from '../helpers/multi-step-case';

export async function chooseFileName(generator: YamlGenerator, step: number, input: MultiStepInput) {
    const title = 'Give a name to your yaml pipeline file';

    generator.fileName = await input.showInputBox({
        title,
        value: 'azure-pipelines.yml',
        step: step,
        totalSteps: generator.entries.length,
        prompt: 'Give a name to your yaml pipeline file',
        validate: validateFileName,
        shouldResume: shouldResume
    });

    async function validateFileName(name: string) {
        return name.endsWith('.yml') ? undefined : 'Make sure your file extension is \'.yml\'';
    }

    window.showInformationMessage(`You choose: ${generator.fileName}`);
}

export async function enableUnitTests(generator: YamlGenerator, step: number, input: MultiStepInput) {
    generator.unitTests = await booleanPicker(generator, step, input, 'Do you want to run Unit Tests?');
}

export async function manageVersionAutomatically(generator: YamlGenerator, step: number, input: MultiStepInput) {
    generator.automaticVersion = await booleanPicker(generator, step, input, 'Manage version automatically?');
}

export async function updateIdenfier(generator: YamlGenerator, step: number, input: MultiStepInput) {

    generator.updateIdentifier = await booleanPicker(generator, step, input, 'Manage application identifier?');
}

export async function addLaunchIconBadge(generator: YamlGenerator, step: number, input: MultiStepInput) {
    generator.launchIconBadge = await booleanPicker(generator, step, input, 'Add launch icon badge?');
}

export async function publishArtifacts(generator: YamlGenerator, step: number, input: MultiStepInput) {
    generator.generateArtifacts = await booleanPicker(generator, step, input, 'Do you want to publish tha artifacts?');
}

export async function enableAppCenterDistribution(generator: YamlGenerator, step: number, input: MultiStepInput) {
    generator.distribute = await booleanPicker(generator, step, input, 'Do you want to distribute it using App Center?');
}

function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>(() => {

    });
}

export async function booleanPicker(generator: YamlGenerator, step: number, input: MultiStepInput, title: string, yesOption: string = 'Yes', noOption: string = 'No') {

    const answers: QuickPickItem[] = [yesOption, noOption].map(label => ({ label }));

    const pick = await input.showQuickPick({
        title,
        step: step,
        totalSteps: generator.entries.length,
        items: answers,
        shouldResume: shouldResume
    });

    return pick.label === yesOption;
}