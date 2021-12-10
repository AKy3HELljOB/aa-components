import { ModelRulesT } from "..";
import { ModelRulesI } from "./ModelRulesE";


/**
 * Класс конструирующий правила для одного поля
 */
export class ModelOneRuleC {

	private aRule:ModelRulesI;

	constructor(sColumn: string, sName = '') {

		this.aRule = {};
		this.aRule.key = sColumn;
		this.aRule.objectName = sName;
	}

	// ===================================================

	/**
	 * [str, int, enum, text] - тип правила
	 *
	 * @param string sType
	 * @return ModelOneRuleC
	 */
	public type(sType:ModelRulesT): ModelOneRuleC {
		this.aRule.type = sType;
		return this;
	}

	// arrayNumbers = "arrayNumbers", // js number[]

	/** Целое число */
	public typeInt(): ModelOneRuleC {
		this.aRule.type = ModelRulesT.int;
		return this;
	}
	
	/** Текст */
	public typeText(): ModelOneRuleC {
		this.aRule.type = ModelRulesT.text;
		return this;
	}

	/** Строка - if:RegExp / if:enum(Array) */
	public typeStr(): ModelOneRuleC {
		this.aRule.type = ModelRulesT.str;
		return this;
	}

	/** Булево значение */
	public typeBool(): ModelOneRuleC {
		this.aRule.type = ModelRulesT.boolean;
		return this;
	}

	/** Список значений(number|string) */
	public typeEnum(): ModelOneRuleC {
		this.aRule.type = ModelRulesT.enum;
		return this;
	}

	/** JSON строка */
	public typeJson(): ModelOneRuleC {
		this.aRule.type = ModelRulesT.json;
		return this;
	}

	/** float двойной точности 10.00 */
	public typeDecimal(): ModelOneRuleC {
		this.aRule.type = ModelRulesT.decimal;
		return this;
	}
	
	/** js object {} */
	public typeObject(): ModelOneRuleC {
		this.aRule.type = ModelRulesT.object;
		return this;
	}

	/** js array [2,{},'dd'] */
	public typeArray(): ModelOneRuleC {
		this.aRule.type = ModelRulesT.array;
		return this;
	}

	/** js array [2,3,1,5] */
	public typeArrayNumbers(): ModelOneRuleC {
		this.aRule.type = ModelRulesT.arrayNumbers;
		return this;
	}

	// ===================================================

	/**
	 * [rgexp<string>, enum(array)] - условие валидации
	 *
	 * @param mixed if
	 * @return ModelOneRuleC
	 */
	public if(ifType: any): ModelOneRuleC {
		this.aRule.if = ifType;
		return this;
	}

    /**
	 * @param function name(v:any,k?:string) {
	 * @return ModelOneRuleC
	 */
	public beforeAction(fAction:Function): ModelOneRuleC {
		this.aRule.before_action = fAction;
		return this;
	}

	/**
	 * @param boolean bDef - если присланно неверно - установить по умолчанию
	 * @return ModelOneRuleC
	 */
	public require(bDef = false): ModelOneRuleC {
		this.aRule.require = true;
        this.aRule.require_def = bDef;
		return this;
	}

	/**
	 * [column] От какого поля зависит
	 *
	 * @param string sDepend
	 * @return ModelOneRuleC
	 */
	public depend(sDepend: string): ModelOneRuleC {
		this.aRule.depend = sDepend;
		return this;
	}

	/**
	 * [текст ошибки] - Сообщение в случае если проверка не прошла
	 *
	 * @param string sError
	 * @return ModelOneRuleC
	 */
	public error(sError: string): ModelOneRuleC {
		this.aRule.error = sError;
		return this;
	}

	/**
	 * [клич ошибки, сообшение ошибки] - Ключ и сообщение ошибки в случае если проверка не прошла
	 *
	 * @param string sError
	 * @return ModelOneRuleC
	 */
	public errorEx(sKey:string, sError:string): ModelOneRuleC{
		this.aRule.error_key = {key:sKey, msg:sError};

		this.error(sError); // Вывод стандартных ошибок
		return this;
	}

	/**
	 * Значение по умолчанию
	 *
	 * @param mixed val
	 * @return ModelOneRuleC
	 */
	public def(val: any): ModelOneRuleC {
		this.aRule.def = val;
		return this;
	}

	/**
	 * Максимальная длинна строки
	 *
	 * @param [type] iVal
	 * @return ModelOneRuleC
	 */
	public maxLen(iVal: number): ModelOneRuleC {
		this.aRule.max_len = iVal;
		return this;
	}

	/**
	 * Минимальная длинна строки
	 *
	 * @param [type] iVal
	 * @return ModelOneRuleC
	 */
	public minLen(iVal: number): ModelOneRuleC {
		this.aRule.min_len = iVal;
		return this;
	}

    /**
     * Больше
     * @param iVal - Числовое сравнение [больше]
     */
	public more(iVal: number): ModelOneRuleC {
		this.aRule.more = iVal;
		return this;
	}

	/**
     * Больше или равно
     * @param iVal - Числовое сравнение [больше или равно]
     */
	public moreOrEq(iVal: number): ModelOneRuleC {
		this.aRule.more_or_equal = iVal;
		return this;
	}

    /**
     * Меньше
     * @param iVal - Числовое сравнение [меньше]
     */
	public less(iVal: number): ModelOneRuleC {
		this.aRule.less = iVal;
		return this;
	}

	/**
     * Меньше или равно
     * @param iVal - Числовое сравнение [меньше или равно]
     */
	public lessOrEq(iVal: number): ModelOneRuleC {
		this.aRule.less_or_equal = iVal;
		return this;
	}

	/**
	 * Получить правило
	 *
	 * @return array
	 */
	public get(): { [key: string]: any } {

		if (!this.aRule.type) { // Тип
			this.aRule.type = null;
		}
		if (!this.aRule.if) { // Условие
			this.aRule.if = null;
		}
		if (!this.aRule.require) { //  Поле обязательно для заполнения
			this.aRule.require = false;
		}

		if (!this.aRule.depend) { // Зависемость от другова поля
			this.aRule.depend = null;
		}
		if (!this.aRule.error) { // Текст об ошибке
			this.aRule.error = null;
		}

		return this.aRule;
	}

	/**
	 * Получить название колонки
	 *
	 * @return string
	 */
	public getKey(): string {
		return this.aRule.key;
	}

	//ФОРМАТ ПРАВИЛА [0:type, 1:condition, 2:required, 3:depend, 4:msg_error]
	// 	'refund_tpl_name' : ['str', "/^[0-9a-zA-Zа-яА-Я ]{2,30}/u", true, false, 'refund_tpl_name неверный формат'],
	// 	'user_id' : ['int', "/^[0-9]{1,11}/", true, false, 'user_id не верный формат'],
	// 	'refund_money' : ['int', "/^[0-9]{1,11}/", false, false, 'refund_money неверный формат'],
	// 	'refund_type' : ['enum', ['card', 'account'], true, false, 'refund_type неверный формат'],

	// 	'refund_card' : ['str', "/^[0-9]{16,18}/", false, ['refund_type':'card'], 'refund_card неверный формат'],

	// 	'refund_card_account' : ['str', "/^[0-9]{20}/", false, ['refund_type':'account'], 'refund_card_account неверный формат'],
	// 	'refund_bik' : ['str', "/^[0-9]{9,9}/", false, ['refund_type':'account'], 'refund_bik неверный формат'],
	// 	'refund_inn' : ['str', "/^[0-9]{10,10}/", false, ['refund_type':'account'], 'refund_inn неверный формат'],
	// 	'refund_kpp' : ['str', "/^[0-9]{9,9}/", false, ['refund_type':'account'], 'refund_kpp неверный формат'],

	// 	'refund_firstname' : ['str', "/^[а-яА-Я]{2,30}/u", false, false, 'refund_firstname неверный формат'],
	// 	'refund_lastname' : ['str', "/^[а-яА-Я]{2,30}/u", false, false, 'refund_lastname неверный формат'],
	// 	'refund_fathername' : ['str', "/^[а-яА-Я]{2,30}/u", false, false, 'refund_fathername неверный формат'],
	// 	'refund_fullname' : ['text', false, false, false, 'refund_fullname неверный формат'],

	// 	'refund_reason' : ['text', false, false, false, 'refund_reason неверный формат'],

}

