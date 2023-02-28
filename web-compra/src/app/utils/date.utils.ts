export abstract class DateUtils {

  public static daysDiff(date1: Date, date2: Date) {
    var diff = date1.getTime() - date2.getTime();
    const daysDiff = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return daysDiff;
  }

  public static hoursDiff(date1: Date, date2: Date) {
    var diff = date1.getTime() - date2.getTime();
    const hoursDiff = Math.ceil(diff / (1000 * 60 * 60));
    return hoursDiff;
  }

  public static minsDiff(date1: Date, date2: Date) {
    var diff = date1.getTime() - date2.getTime();
    const minsDiff = Math.ceil(diff / (1000 * 60));
    return minsDiff;
  }

  public static secsDiff(date1: Date, date2: Date) {
    var diff = date1.getTime() - date2.getTime();
    const secsDiff = Math.ceil(diff / (1000));
    return secsDiff;
  }

  public static milisecDiff(date1: Date, date2: Date) {
    var diff = date1.getTime() - date2.getTime();
    return diff;
  }
}
