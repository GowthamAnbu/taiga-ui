import {TuiRounding} from '@taiga-ui/cdk';
import {TuiDecimal, TuiDecimalSymbol} from '@taiga-ui/core/types';

/**
 * Formatting configuration for displayed numbers
 */
export interface TuiNumberFormatSettings {
    /**
     * Number of digits of decimal part.
     * @note Use `Infinity` to keep untouched.
     */
    readonly decimalLimit: number;
    /**
     * Separator between the integer and the decimal part.
     * @example 0,42 (',' by default)
     */
    readonly decimalSeparator: TuiDecimalSymbol;
    /**
     * Rounding method.
     */
    readonly rounding: TuiRounding;
    /**
     * Separator between thousands.
     * @example 360 000 (' ' by default)
     */
    readonly thousandSeparator: string;
    /**
     * Enable zeros at the end of decimal part.
     */
    readonly zeroPadding: boolean;
    /**
     * Decimal part display mode. ('not-zero' by default)
     */
    readonly decimal: TuiDecimal;
}
