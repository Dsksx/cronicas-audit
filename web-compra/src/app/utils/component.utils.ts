export abstract class ComponentsUtils {

  public static ellipsize(str:string, length: number) {
    if (str.length >= length) {
      return str.substr(0, length) + '...';
    }
    return str;
  }
}
