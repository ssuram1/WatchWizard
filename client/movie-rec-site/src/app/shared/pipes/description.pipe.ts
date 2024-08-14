//create Pipe to limit plot overview character count
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'description',
    standalone: true
})
export class DescriptionPipe implements PipeTransform {

    transform(value: String, args?: number): any {
        //limit plot overviews to 140 characters
        //return value.substring(0,140) + '...'
        return `${value.substring(0, args)}...)`
    }
}