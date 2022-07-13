import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceWords'
})
export class SliceWordsPipe implements PipeTransform {

  isCompleted = '';

  transform(value: string, start: number, end: number): string {
    if (value == null) return '';
    this.isCompleted = (end-start) >= value.split(" ").length ? '' : '...';

    return value
      .split(" ")
      .splice(start, end)
      .join(" ") + this.isCompleted;
  }
}
