import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unescape'
})
export class UnescapePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return;
       
    var string = value.replace(/\\\//g,"/");
    string = string.replace(/\\n/g,"<br>");
   string = string.replace(/"/g,"");
   string = string.replace(/\\u00e4/g,"ä");
   string = string.replace(/\\u00c4/g,"Ä");
   string = string.replace(/\\u00f6/g,"ö");
   string = string.replace(/\\u00d6/g,"Ö");
   string = string.replace(/\\u00fc/g,"ü");
   string = string.replace(/\\u00dc/g,"Ü");
   string = string.replace(/\\>/g,"\">");
   string = string.replace(/=\\/g,"\"=");
   let txt = document.createElement("textarea");
   txt.innerHTML = string;
   console.log("after pipe:" +txt.value);
   return txt.value;
  }

}
