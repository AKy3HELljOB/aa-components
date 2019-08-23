import { ModelValidatorSys } from './Validator/ModelValidatorSys';
import { ErrorSys } from './ErrorSys';


export class BaseClass {

    public errorSys: ErrorSys;
    public modelValidatorSys: ModelValidatorSys;

    constructor(errorSys: ErrorSys) {
        this.modelValidatorSys = new ModelValidatorSys(errorSys);
        this.errorSys = errorSys;
    }

    protected className() {
        return this.constructor.name;
    }
}