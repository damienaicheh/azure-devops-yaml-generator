import { YamlGenerator } from "./yaml-generator";
import *  as steps from "./steps";

export class XamariniOSGenerator extends YamlGenerator {

    constructor() {
        super();
        this.template = 'stages.yml.tmpl';
        this.vmImage = 'macOS-latest';
        this.steps = [
            input => steps.chooseFileName(this, 0, input),
        ];
    }
}