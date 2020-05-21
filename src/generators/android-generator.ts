import { YamlGenerator } from "./yaml-generator";
import *  as steps from "./steps";

export class AndroidGenerator extends YamlGenerator {

    constructor() {
        super();
        this.template = 'android.stages.yml.tmpl';
        this.vmImage = 'macOS-latest';
        this.steps = this.steps.concat([
            input => steps.manageVersionAutomatically(this, input),
            input => steps.updateIdentifier(this, input),
            input => steps.addLaunchIconBadge(this, input),
            input => steps.publishArtifacts(this, input),
            input => steps.enableAppCenterDistribution(this, input),
        ]);
    }
}