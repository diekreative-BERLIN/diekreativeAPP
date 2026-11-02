import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({ name: 'toHHMMSSPipe' })
export class toHHMMSSPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(secs) {
    var sec_num = parseInt(secs, 10)
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60

    return [minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i >= 0)
      .join(":")
  }
} 