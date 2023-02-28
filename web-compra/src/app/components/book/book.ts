export class Book {
    id: number;
    title: string;
    volume: string;
    image: string;
    free_link: string;
    CID: string|undefined;    
    owned: boolean = false;
    pdf: any;

    constructor(id: number = 0, title: string = "", volume: string = "", image: string = "", free_link: string = "", CID?: string) {
        this.id = id;
        this.title = title;
        this.volume = volume;
        this.image = image;
        this.free_link = free_link;
        this.CID = CID;
    }
}