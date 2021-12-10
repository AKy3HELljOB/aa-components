// Системные сервисы
import { ErrorSys } from '../ErrorSys/ErrorSys';
import { ModelValidatorTaskS } from './ModelValidatorTaskS';
import { ModelRulesI } from './ModelRulesE';
import { ModelRulesT } from '..';


/**
 * Системный сервис валидации данных для моделей
 */
export class ModelValidatorSys {
	protected okResult: boolean; // Статус проверки
	protected abValidOK: any; // поля успешно прошедшие проверку
	public data: any; // Входящие данные
	public aResult: any; // Отфильтрованные проверенные данные
	protected aResultType: any;
	protected aMsg: string[]; // Сообщения валидации

	/**
	 * Система регистрации ошибок
	 */
	public errorSys: ErrorSys;
	protected vValidatorTask:ModelValidatorTaskS;

	/** маппинг валидаторов типа */
	private typeValidators: Record<string, (k: string, v: ModelRulesI) => boolean > = {
		[ModelRulesT.str] : this.fTypeStr,
		[ModelRulesT.boolean] : this.fTypeBool,
		[ModelRulesT.int] : this.fTypeInt,
		[ModelRulesT.enum] : this.fTypeEnum,
		[ModelRulesT.text] : this.fTypeText,
		[ModelRulesT.json] : this.fTypeJson,
		[ModelRulesT.decimal] : this.fTypeDecimal,
		[ModelRulesT.arrayNumbers] : this.fTypeArrayNumbers,
		[ModelRulesT.object] : this.fTypeObject,
		[ModelRulesT.array] : this.fTypeArray,
	}

	/** Маппинг логических валидаторов */
	private logicValidators: Record<string, (k: string, v: ModelRulesI) => boolean > = {
		more : this.fMore,
		more_or_equal : this.fMoreOrEqual,
		less : this.fLess,
		less_or_equal : this.fLessOrEqual,
		max_len : this.fMaxLen,
		min_len : this.fMinLen,
	}
	constructor(errorSys: ErrorSys) {
		this.errorSys = errorSys;
		this.vValidatorTask = new ModelValidatorTaskS(this);
		console.log('object');
	}
	// ================================================================

	/**
	 * Получить проверенные отфильтрованные данные в качестве массива
	 *
	 * @return array|null
	 */
	public getResult(): any { // Получить проверенные отфильтрованные данные
		return this.aResult;
	}
	public getStatus() { // Получиь статус проверки
		return this.okResult;
	}
	public getMsg(): string[] {
		return this.aMsg;
	}

	/**
	 * Валидация данных
	 * @param aRules
	 * @param data
	 */
	public fValid(aRules: {[key:string]:ModelRulesI}, data: { [key: string]: any }) { // Проверка данных

        if(!data){ // Проверка указанны данные или нет
            data = {};
            this.errorSys.error('valid_input_data', 'Данные для проверки не указаны');
        }

		this.data = data;
		this.okResult = true; // [true/false] - Успешно или нет прошла валидация
		this.abValidOK = {};
		this.aResult = {};
		this.aMsg = [];

		const akRules = Object.keys(aRules);
		for (let i = 0; i < akRules.length; i++) {
			const k = akRules[i]; // Ключ поля
			const v = aRules[k]; // Правила валидации

			this.abValidOK[k] = true;

			//Подстановка значений по умолчанию, если значения нет
			if(!this.data[k] && this.data[k] !== 0 && this.data[k] !== false){
				if(v.def || v.def === 0 || v.def === false || v.def === ''){
					this.data[k] = v.def;
				}
			}


			if( 'error_key' in v ){ // Если указываем ключ ошибки декларируем ее
				let errorKey:any = {};
				errorKey[v.error_key.key] = v.error_key.msg;
			}

			// Проверка существования данных
			let bExist = this.vValidatorTask.checkExist(this.data[k]);

            // Выполнение предварительного действия
            if(bExist && v.before_action){
                try {
                    this.data[k] = v.before_action(this.data[k], k);
                } catch (e) {
                    this.errorSys.error('valid_before_action_'+k, 'Предварительное действие перед проверкой не выполненно');
                }
            }

			// Проверка зависимостей
			if( v.depend ){
				this.fDepend(k,v);
			}//if

			//Проверка - обязательного поля
			if( v.require ){
				this.fRequire(v);
			}

			if (bExist) {
				/** Проверка типа */ 
				const fTypeValidator = this.typeValidators[v.type];
				if (fTypeValidator) {
					fTypeValidator.call(this,k,v);
				}

				/** Логические проверки */
				const aLogicKey = Object.keys(this.logicValidators);
				for (let i = 0; i < aLogicKey.length && this.abValidOK[k]; i++) {
					const key = aLogicKey[i];
					if (key in v) {
						this.logicValidators[key].call(this,k,v);
					}
				}
			}

            // ============================================
            // Если поле обязательно, но указанно неправильно - подставить значение по умолчанию если есть
            // Если requre(true)
            // ============================================

            if( v.require && v.require_def && !this.abValidOK[k]){                
				if( v.def || v.def === 0 || v.def === false || v.def === ''){
                    this.aResult[k] = v.def;
				}
			}

            // ============================================

			// Кастомная ошибка на поле [error_key]
			if( !this.abValidOK[k] && 'error_key' in v ){ // Вызываем кастомную ошибку, если она произошла и была указана
				this.errorSys.error(v.error_key.key, v.error_key.msg);
			}



		} // for

		return this.okResult;
	}

	/**
	 * TODO проверить работоспособность
	 * Проверяет корректно условие зависимости или нет
	 * @param v
	 */
	private fDepend(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = true;

		const akDepend = Object.keys(vRule.depend);
		for (let i = 0; i < akDepend.length; i++) {
			const kDepend = akDepend[i];
			// TODO востановить работу

			// const vDepend = vRule.depend[kDepend];
			// if( this.okResult && this.abValidOK[kDepend] ){
			// 	if( this.abValidOK[kDepend] && this.data[kDepend] ){
			// 		if( !(this.data[kDepend] == vDepend || vDepend == '*') ){

			// 			bOk = false;
			// 			this.errorSys.error('valid_'+kRule+'_depend', kRule+' - поле не прошло проверку зависимостей');

			// 		}
			// 	}
			// }//if
		}; //for

		return bOk;
	}

	// ==============================================================

	/**
	 * Проверка поля на наличие
	 * @param kRule
	 * @param vRule
	 */
	private fRequire(vRule:ModelRulesI):boolean{
		let bOk = this.vValidatorTask.checkExist(this.data[vRule.key]);

		if (!bOk) {
			this.okResult = false;
			this.abValidOK[vRule.key] = false;
			const key = vRule.objectName ? `${vRule.objectName}.${vRule.key}` : `valid_${vRule.key}_require`;
			this.errorSys.error(key , 'Поле обязательно для заполнения');
		}

		return bOk;
	}

	/**
	 * Ошибка для валидатора типа
	 * @param kRule
	 * @param vRule
	 */
	private fTypeError(vRule: ModelRulesI, sErrorKey: string, sError = '') : void {
		this.okResult = false;
		this.abValidOK[vRule.key] = false;
		const key = vRule.objectName ? `${vRule.objectName}_${vRule.key}` : `valid_${vRule.key}_${sErrorKey}`;
		const error = vRule.error || `Ошибка в данных ${sError || sErrorKey}: ${this.data[vRule.key]}`
		this.errorSys.error(key , error);
	}

	/**
	 * Проверка типа str
	 * @param kRule
	 * @param vRule
	 */
	private fTypeStr(kRule:string,vRule:ModelRulesI):boolean {
		let bOk = this.vValidatorTask.fValidString(vRule.key, vRule.if);
		if (!bOk) {
			this.fTypeError(vRule, 'str', 'string');
		}
		return bOk;
	}

	/**
	 * Проверка типа boolean
	 * @param kRule
	 * @param vRule
	 */
	private fTypeBool(kRule:string,vRule:ModelRulesI):boolean {
		let bOk = this.vValidatorTask.fValidBool(vRule.key);
		if (!bOk) {
			this.fTypeError(vRule, 'bool', 'boolean');
		}
		return bOk;
	}

	/**
	 * Проверка типа boolean
	 * @param kRule
	 * @param vRule
	 */
	private fTypeInt(kRule:string,vRule:ModelRulesI):boolean {
		let bOk = this.vValidatorTask.fValidInt(vRule.key);
		if (!bOk) {
			this.fTypeError(vRule, 'int');
		}
		return bOk;
	}

	/**
	 * Проверка типа enum
	 * @param kRule
	 * @param vRule
	 */
	private fTypeEnum(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = this.vValidatorTask.fValidEnum(vRule.key, <any[]>vRule.if);
		if (!bOk) {
			this.fTypeError(vRule, 'enum');
		}
		return bOk;
	}

	/**
	 * Проверка типа text
	 * @param kRule
	 * @param vRule
	 */
	private fTypeText(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = this.vValidatorTask.fValidText(vRule.key);
		if (!bOk) {
			this.fTypeError(vRule, 'text');
		}
		return bOk;
	}

	/**
	 * Проверка типа json поля
	 * @param kRule
	 * @param vRule
	 */
	private fTypeJson(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = this.vValidatorTask.fValidJson(vRule.key);
		if (!bOk) {
			this.fTypeError(vRule, 'json');
		}
		return bOk;
	}

	/**
	 * Проверка типа decimal поля
	 * @param kRule
	 * @param vRule
	 */
	private fTypeDecimal(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = this.vValidatorTask.fValidDecimal(vRule.key);
		if (!bOk) {
			this.fTypeError(vRule, 'decimal');
		}
		return bOk;
	}

	/**
	 * Проверка типа arrayNumbers поля
	 * @param kRule
	 * @param vRule
	 */
	private fTypeArrayNumbers(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = this.vValidatorTask.fValidArrayNumbers(vRule.key);
		if (!bOk) {
			this.fTypeError(vRule, 'arrayNumbers');
		}
		return bOk;
	}

	/**
	 * Проверка типа object поля
	 * @param kRule
	 * @param vRule
	 */
	private fTypeObject(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = this.vValidatorTask.fValidObject(vRule.key);
		if (!bOk) {
			this.fTypeError(vRule, 'object');
		}
		return bOk;
	}

	/**
	 * Проверка типа array поля
	 * @param kRule
	 * @param vRule
	 */
	private fTypeArray(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = this.vValidatorTask.fValidArray(vRule.key);
		if (!bOk) {
			this.fTypeError(vRule, 'array');
		}
		return bOk;
	}

	/**
	 * Проверка больше
	 * @param kRule
	 * @param vRule
	 */
	private fMore(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = true;

		if( vRule.type == ModelRulesT.int || vRule.type == ModelRulesT.decimal ){
			if( !this.vValidatorTask.fValidMore(kRule, vRule.more) ){
				this.okResult = false;
				this.abValidOK[kRule] = false;
				this.errorSys.error('valid_'+kRule+'_more', vRule['error']+' Число слишком маленькое = '+this.data[kRule]);
			}
		} else {
			this.errorSys.error('valid_'+kRule+'_more_no_number', vRule['error']+' Поле не является числом');
		}

		return bOk;
	}

	/**
	 * Проверка больше или равно
	 * @param kRule
	 * @param vRule
	 */
	private fMoreOrEqual(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = true;

		if (vRule.type == ModelRulesT.int || vRule.type == ModelRulesT.decimal) {
			if( !this.vValidatorTask.fValidMoreOrEqual(kRule, vRule.more_or_equal) ){
				this.abValidOK[kRule] = false;
				this.okResult = false;
				this.errorSys.error('valid_' + kRule + '_more_or_equal', vRule.error + ' Число слишком маленькое = ' + this.data[kRule]);
			}
		} else {
			this.errorSys.error('valid_' + kRule + '_more_or_equal_no_number', vRule.error + ' Поле не является числом');
		}

		return bOk;
	}

	/**
	 * Проверка меньше
	 * @param kRule
	 * @param vRule
	 */
	private fLess(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = true;

		if (vRule.type == ModelRulesT.int || vRule.type == ModelRulesT.decimal) {
			if( !this.vValidatorTask.fValidLess(kRule, vRule.less) ){
				this.okResult = false;
				this.abValidOK[kRule] = false;
				this.errorSys.error('valid_'+kRule+'_less', vRule.error+' Число слишком большое = '+this.data[kRule]);
			}
		} else {
			this.errorSys.error('valid_'+kRule+'_less_no_number', vRule.error+' Поле не является числом');
		}

		return bOk;
	}

	/**
	 * Проверка меньше или равно
	 * @param kRule
	 * @param vRule
	 */
	private fLessOrEqual(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = true;

		if (vRule.type == ModelRulesT.int || vRule.type == ModelRulesT.decimal) {

			if ( !this.vValidatorTask.fValidLessOrEqual(kRule, vRule.less_or_equal) ){
				this.abValidOK[kRule] = false;
				this.okResult = false;
				this.errorSys.error('valid_' + kRule + '_less_or_equal', vRule['error'] + ' Число слишком большое = ' + this.data[kRule]);
			}
		} else {
			this.errorSys.error('valid_' + kRule + '_less_or_equal_no_number', vRule['error'] + ' Поле не является числом');
		}

		return bOk;
	}


	/**
	 * Проверка меньше или равно
	 * @param kRule
	 * @param vRule
	 */
	private fMaxLen(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = true;

		// Проверка является ли поле текстовым
		if( vRule.type == ModelRulesT.text || vRule.type == ModelRulesT.str ){
			if( !this.vValidatorTask.fValidMaxLen(kRule, vRule.max_len) ){

				this.okResult = false;
				this.abValidOK[kRule] = false;
				this.errorSys.error('valid_'+kRule+'_max_len', vRule['error']+' Превышено количество символов = '+this.data[kRule] );
			}
		} else {
			this.errorSys.error('valid_'+kRule+'_max_len_no_string', 'Поле не является строкой');
		}

		return bOk;
	}

	/**
	 * Проверка меньше или равно
	 * @param kRule
	 * @param vRule
	 */
	private fMinLen(kRule:string,vRule:ModelRulesI):boolean{
		let bOk = true;

		// Проверка является ли поле текстовым
		if( vRule.type == ModelRulesT.text || vRule.type == ModelRulesT.str ){
			if (this.vValidatorTask.fValidMinLen(kRule, vRule.min_len)) {
				this.abValidOK[kRule] = true;
			} else {
				this.okResult = false;
				this.errorSys.error(
					`valid_${kRule}_min_len`,
					`${vRule.error} Количество символов меньше минимального значения = ${this.data[kRule]}`);
			}
		} else {
			this.errorSys.error(`valid_${kRule}_min_len_no_string`, 'Поле не является строкой');
		}

		return bOk;
	}

}
