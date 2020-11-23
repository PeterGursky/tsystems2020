import { Pipe, PipeTransform } from '@angular/core';
import { Group } from 'src/entities/group';

@Pipe({
  name: 'groupsToString'
})
export class GroupsToStringPipe implements PipeTransform {

  transform(groups: Group[], property?: string): string {
    if(property === 'permissions') {
//      debugger;
      // let perms:string[] = [];
      // for(let group of groups) {
      //   for(let perm of group.permissions) {
      //     let isThere = false;
      //     for(let exist of perms) {
      //       if (exist === perm) {
      //         isThere = true;
      //       }
      //     }
      //     if (!isThere)
      //       perms.push(perm);
      //   }
      // }
      // return perms.join(', ');
      return groups.map(group => group.permissions).flat()
      .reduce((acc,perm)=> acc.includes(perm) ? acc : [...acc, perm], []).join(', ');
    }
    return groups.map(group => group.name).join(', ');
  }

}
