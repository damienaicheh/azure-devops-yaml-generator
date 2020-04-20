import { XamarinGenerator } from "./xamarin-generator";

export class XamariniOSGenerator extends XamarinGenerator {

    constructor() {
        super();
        this.template = 'xamarin.ios.stages.yml.tmpl';
    }
}