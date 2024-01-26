import { Banner } from "../banner.entity";


export class BannerInsertDTO extends Banner {
    typeUpdate: "insert" | "delete";
}