import { Pipe, PipeTransform } from '@angular/core';

const Stage: { [key: string]: string } = {
  '0': 'Created',
  '1': 'Accepted',
  '2': 'Solved',
  '3': 'Closed',
  '-1': 'Cancelled',
};

@Pipe({
  name: 'stageToString',
  standalone: true,
})
export class StageToStringPipe implements PipeTransform {
  transform(value: number): string {
    return Stage[value.toString()];
  }
}
