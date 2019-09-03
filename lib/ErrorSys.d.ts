/**
 * Системный сервис обработки ошибок
 */
export declare class ErrorSys {
    errorClass: string;
    private ok;
    private env;
    private ifDevMode;
    private errorList;
    private errorDeclareList;
    private devWarningList;
    private warningList;
    private devNoticeList;
    private noticeList;
    private devLogList;
    private errorCount;
    constructor(env?: string);
    /**
     * очистка стека
     */
    clear(): void;
    /**
     * Получить глобальный статус выполнения
     *
     * @return boolean
     */
    isOk(): boolean;
    /**
     * Получить режим окружения
     *
     * @return boolean
     */
    isDev(): boolean;
    /**
     *	Декларировать одну возможную ошибку
     *
     * @param keyError
     */
    decl(keyError: string, infoError: string): void;
    /**
     *	Декларация возможных ошибок
     *
     * @param keyErrorList
     */
    declare(keyErrorList: string[]): void;
    /**
     *	Декларация возможных ошибок
     *
     * @param keyErrorList
     */
    declareEx(keyErrorList: {
        [key: string]: string;
    }): void;
    /**
     * Добавляет ошибку в стек
     *
     * @param string kError - ключ ошибки
     * @param string sError - сообщение
     * @return void
     */
    error(kError: string, sError?: string): void;
    getErrorCount(): number;
    /**
     * Добавление ошибки в стек по ключу декларирования
     * @param kError
     */
    setError(kError: string): void;
    /**
     * Добавляет ошибку в стек,
     * В dev режиме выводит catch(e) ошибки в консоль
     *
     * @param e // Error exeption
     * @param kError // Ключ ошибки - для тестирования
     * @param sError // Сообщение об ошибке
     */
    errorEx(e: any, kError: string, sError: string): void;
    /**
     * Добавляет уведомление в стек
     *
     * @param string kNotice - ключ ошибки
     * @param string sNotice - сообщение
     * @return void
     */
    notice(kNotice: string, sNotice: string): void;
    /**
     * Добавляет уведомление для разработки в стек
     *
     * @param string kNotice - ключ ошибки
     * @param string sNotice - сообщение
     * @return void
     */
    devNotice(kNotice: string, sNotice: string): void;
    /**
     * Добавляет предупреждение в стек
     *
     * @param string kWarning - ключ ошибки
     * @param string sWarning - сообщение
     * @return void
     */
    warning(kWarning: string, sWarning: string): void;
    /**
     * Добавляет предупреждение для разработки в стек
     * Добавляется информация только в тестовом режиме
     *
     * @param string kWarning - ключ ошибки
     * @param string sWarning - сообщение
     * @return void
     */
    devWarning(kWarning: string, sWarning: string): void;
    /**
     * Получить все ошибки
     *
     * @return array|null - возвращаются ошибки (key, val)
     */
    getErrors(): {
        [s: string]: string;
    };
    /**
     * Получить все декларации для DEV режима
     */
    getDeclareList(): {
        [s: string]: string;
    };
    /**
     * Получить все декларации для DEV режима
     */
    getDevDeclare(): {
        [s: string]: string;
    };
    /**
     * Получить все предупреждения для разработки
     *
     * @return array|null - возвращаются предупреждения (key, val)
     */
    getDevWarning(): {
        [s: string]: string;
    };
    /**
     * Получить все предупреждения для пользователя
     *
     * @return array|null - возвращаются предупреждения (key, val)
     */
    getWarning(): {
        [s: string]: string;
    };
    /**
     * Получить все уведомления для разработки
     *
     * @return array|null - возвращаются уведомления (key, val)
     */
    getDevNotice(): {
        [s: string]: string;
    };
    /**
     * Получить все уведомления для пользователя
     *
     * @return array|null - возвращаются уведомления (key, val)
     */
    getNotice(): {
        [s: string]: string;
    };
    /**
     * Получить все логи для разработки
     *
     * @return array|null - возвращаются уведомления (key, val)
     */
    getDevLog(): {
        [s: string]: string;
    };
}
