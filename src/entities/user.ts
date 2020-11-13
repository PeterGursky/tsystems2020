export class User {
    constructor(
        public name: string,
        public email: string,
        public id? : number,
        public lastLogin?: Date,
        public password: string = ''
    ) {}

    public static clone(user:any):User {
        return new User(user.name, user.email, user.id, user.lastLogin, user.password);
    }
 }