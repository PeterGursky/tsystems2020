export class Group {
    constructor(
        public name: string,
        public id?: number,
        public permissions: string[] = []
    ){}
}