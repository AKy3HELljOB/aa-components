
/** Типы валидации */
export interface ModelRulesI {
	objectName?:string; // Название

	key?:string; // ключ проверяемого поля
	type?:string; // Проверяемый тип
	def?:any; // Значение по умолчанию
	if?:RegExp|any[]; // Дополнительная опция проверки
	require?:boolean; // Поле обязательно
    require_def?: boolean; // Поле обязательно, если присланно не верно установить по умолчанию
	depend?:string; // ранее указанное поле от которого зависит проверять или нет данное поле
	error?:string; // Сообщение если проверка провалилась
	error_key?:{key:string; msg:string}; // Кастомная ошибка имеющая ключ

	// Логические операторы
	max_len?:number; // Максимальная длинна строки
	min_len?:number; // Минимальная длинна строки
	more?:number; // Число больше
	more_or_equal?:number; // Число больше или равно
	less?:number; // Число меньше
	less_or_equal?:number; // Число меньше или равно

    before_action?:Function; // Функция выполняющаяся до проверки правила
}

/** Типы валидации */
export enum ModelRulesT {
	str = 'str', // RegExp условие / enum условие(Array)
	text = 'text', // Поле обязательно
	boolean = 'boolean', // Булево значение
	int = 'int', // Целое
	enum = 'enum', // Список значений
	json = 'json', // json поле
	decimal = 'decimal', // float двойной точности 10.00
	object = 'object', // js object {}
	array = 'array', // js array []
	arrayNumbers = "arrayNumbers", // js number[]
}