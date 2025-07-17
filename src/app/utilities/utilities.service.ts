import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  public generateGuid(): string {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  public waitAsync(time: number): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  public truncateText(text: string, limit: number = 30): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '..' : text;
  }

  public groupBy<T>(list?: Array<T>, prop?: any): Array<GroupItemModel<T>> {
    let idx = 0;
    const groupArr: Array<GroupItemModel<T>> = [];

    list!.reduce(function (groups: any, item: any) {
      const val = item[prop];
      groups[val] = groups[val] || [];
      groups[val].push(item);

      const x = groupArr.findIndex(o => o.id === item[prop]);
      idx = x > -1 ? x : groupArr.length;
      groupArr[idx] = groupArr[idx] || {
        id: item[prop],
        itemList: []
      };
      groupArr[idx].itemList.push(item);

      return groups;
    }, {});

    return groupArr;
  }

  /**
   * Converts enum to item array
   */

  /** */
  public toLocalDate(date: Date): Date {
    return new Date(`${new Date(date).toString()} UTC`);
  }

  omitSpecialChar(event: any) {
    var k;
    var l: string;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    l = event.key;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57)
      || (k == 305)
      || (k == 231)
      || (k == 351)
      || (k == 246)
      || (k == 252)
      || (k == 287)
      || (k == 304)
      || (k == 199)
      || (k == 350)
    );
  }
  sanitizeFileName(fileName: string): string {

    return fileName
      .replace(/[^a-zA-Z0-9ğüşıöçĞÜŞİÖÇ\s\-.]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  isEmailValid(email: string): boolean {
    const emailValidator = Validators.email;
    const testControl = { value: email } as any;
    const result = emailValidator(testControl);
    return !result;
  }

  isPhoneNumberValid(phoneNumber: string): boolean {
    if (phoneNumber.includes('-')) {
      phoneNumber = phoneNumber.replaceAll('-', '');
    }
    const phoneRegex = /^[5][0-9]{9}$/;
    return phoneRegex.test(phoneNumber);
  }

}

export interface GroupItemModel<T> {
  id: any;
  itemList: Array<T>;
}
