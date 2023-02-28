import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'ellipsize'})
export class EllipsizePipe implements PipeTransform {
  
  transform(string: string, length: number) {
    if(string.length > length){
      return string.slice(0, length) + '...';
    }else{
      return string;
    }
  }
}