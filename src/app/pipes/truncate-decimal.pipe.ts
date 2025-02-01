import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateDecimal'
})
export class TruncateDecimalPipe implements PipeTransform {

  transform(value: number) : string{
    if(isNaN(value)){return '0.00'}
    return (Math.ceil(value * 100) / 100).toFixed(2);
  }

}
