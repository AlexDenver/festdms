import {
    PipeTransform,
    Pipe
} from '@angular/core';

@Pipe({
    name: "arSort"
})
const ArraySortPipe = class ArraySortPipe implements PipeTransform {
    transform(array: Array < string > , args: string): Array < string > {
        array.sort((a: any, b: any) => {
            a = a.total, b = b.total;
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;
    }
}

export {
    ArraySortPipe
};