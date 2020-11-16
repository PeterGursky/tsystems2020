import { Group } from './group';

export class User {
    constructor(
        public name: string,
        public email: string,
        public id? : number,
        public lastLogin?: Date,
        public password: string = '',
        public active: boolean = true,
        public groups: Group[] = []
    ) {}

    public static clone(user:any):User {
        return new User(user.name, user.email, user.id, user.lastLogin, user.password,
            user.active, user.groups);
    }
 }