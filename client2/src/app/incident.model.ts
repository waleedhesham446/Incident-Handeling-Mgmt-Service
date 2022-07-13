export class Incident {
    constructor(
        public title: string = '',
        public description: string = '',
        public status: string = '',
        public userName: string = '',
        public id: string = '',
        public updated: string = '',
        public comment: string = '',
    ) {}
    init(tit: string, desc: string, status: string, user: string, id: string, updated: string = '', comment: string = ''): void {
        this.title = tit;
        this.description = desc;
        this.status = status;
        this.userName = user;
        this.id = id;
        this.updated = updated;
        this.comment = comment;
    }
}