import { XamarinGenerator } from "./xamarin-generator";

export class XamarinAndroidGenerator extends XamarinGenerator {

    constructor() {
        super();
        this.template = 'xamarin.android.stages.yml.tmpl';
    }
}