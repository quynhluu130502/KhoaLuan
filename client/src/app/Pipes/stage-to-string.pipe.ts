import { Pipe, PipeTransform } from '@angular/core';
import { STAGE } from '../constant';
@Pipe({
  name: 'stageToString',
  standalone: true,
})
export class StageToStringPipe implements PipeTransform {
  transform(value: number): string {
    return STAGE[value.toString()];
  }
}
