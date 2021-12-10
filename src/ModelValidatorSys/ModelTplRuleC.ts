import { ModelOneRuleC } from "..";


/**
 * Класс с шаблонами правил для одного поля
 */
export class ModelTplRuleC {

	private vRule:ModelOneRuleC;

	constructor(sColumn: string, bRequire = false, sName = '') {
		this.vRule = new ModelOneRuleC(sColumn, sName);

		if(bRequire){
			this.vRule.require();
		}
	}

	/** ID > 0 */
	public tplID(sMsg = ''): ModelOneRuleC {
		this.vRule.typeInt();
		this.vRule.more(0);
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** int - целое число */
	public tplInt(sMsg = ''): ModelOneRuleC {
		this.vRule.typeInt();
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** text - простой текст */
	public tplText(sMsg = ''): ModelOneRuleC {
		this.vRule.typeText();
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** str - if опция if:RegEx if:['ss','af'] */
	public tplStr(sMsg = ''): ModelOneRuleC {
		this.vRule.typeStr();
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** array ['se',123,2,4,'12'] */
	public tplArray(sMsg = ''): ModelOneRuleC {
		this.vRule.typeArray();
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** array number [1,2,54,2] */
	public tplArrayNumber(sMsg = ''): ModelOneRuleC {
		this.vRule.typeArrayNumbers();
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** boolean 1|0 */
	public tplBool(sMsg = ''): ModelOneRuleC {
		this.vRule.typeBool();
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** enum ['ws',2,34] => 34 */
	public tplEnum(sMsg = ''): ModelOneRuleC {
		this.vRule.typeEnum();
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** decimal 10.01 */
	public tplDecimal(sMsg = ''): ModelOneRuleC {
		this.vRule.typeDecimal();
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** json "{}" "[]" */
	public tplJson(sMsg = ''): ModelOneRuleC {
		this.vRule.typeJson();
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** object {} */
	public tplObject(sMsg = ''): ModelOneRuleC {
		this.vRule.typeObject();
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** login */
	public tplLogin(sMsg = ''): ModelOneRuleC {
		this.vRule.typeStr();
		this.vRule.if(/^[a-z][a-z0-9._-]*$/);
		this.vRule.minLen(3);
		this.vRule.maxLen(150);
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** UUID 36 символов */
	public tplUUID(sMsg = ''): ModelOneRuleC {
		this.vRule.typeText();
		this.vRule.minLen(36);
		this.vRule.maxLen(36);
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** MD5 32 символа */
	public tplMD5(sMsg = ''): ModelOneRuleC {
		this.vRule.typeText();
		this.vRule.minLen(32);
		this.vRule.maxLen(32);
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** email name12@yandex.ru */
	public tplEmail(sMsg = ''): ModelOneRuleC {
		this.vRule.typeStr();
		this.vRule.if(/^[a-z0-9._-]+@[a-z0-9-]+\.[a-z]{2,4}$/);
		this.vRule.minLen(5);
		this.vRule.maxLen(100);
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** Телефон 79998887766 */
	public tplTel(sMsg = ''): ModelOneRuleC {
		this.vRule.typeStr();
		this.vRule.if(/^79\d{9}$/);
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** Пароль 123456asd */
	public tplPswd(sMsg = ''): ModelOneRuleC {
		this.vRule.typeStr();
		this.vRule.minLen(6);
		this.vRule.maxLen(100);
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** Дата */
	public tplDate(sMsg = ''): ModelOneRuleC {
		this.vRule.typeStr();
		this.vRule.if('/^\d{4}-([0-1][0-9])-([0-3][0-9])$/');
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** Время */
	public tplTime(sMsg = ''): ModelOneRuleC {
		this.vRule.typeStr();
		this.vRule.if('/^([0-2][0-9]):([0-5][0-9]):([0-5][0-9])$/');
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}

	/** Дата и время */
	public tplDatetime(sMsg = ''): ModelOneRuleC {
		this.vRule.typeStr();
		this.vRule.if('/^\d{4}-([0-1][0-9])-([0-3][0-9]) ([0-2][0-9]):([0-5][0-9]):([0-5][0-9])$/');
		if (sMsg) {
			this.vRule.errorEx(this.vRule.getKey(), sMsg);
		}
		return this.vRule;
	}
}
