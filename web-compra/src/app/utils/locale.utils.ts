export abstract class LocaleUtils {

  public static numberToEn(number: string) {
    number = number.replace('.', ',');
    const lastIndex = number.lastIndexOf(',');
    if(lastIndex > -1){
      const replacement = '.';
      number = number.slice(0, lastIndex) + replacement + number.slice(lastIndex + 1);
    }
    
    return number;
  }

  public static numberToEs(number: string) {
    number = number.replace(',', '.');
    const lastIndex = number.lastIndexOf('.');
    if(lastIndex > -1){
      const replacement = ',';
      number = number.slice(0, lastIndex) + replacement + number.slice(lastIndex + 1);
    }
    
    return number;
  }

}
