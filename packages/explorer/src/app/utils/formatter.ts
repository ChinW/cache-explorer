import * as d3 from 'd3-format';

export class Formatter {
    static percent = (number: any, decimal: number = 0) => {
        return d3.format(`.${decimal}%`)(number);
    }

    static quantity = (number: any, decimal: number = 0) => {
        return d3.format(`,.${decimal}d`)(number);
    }
}