import {getImageAsDataURL} from "@korolion/get-image-as-dataurl";
import {hashSHA256} from "./utils";

export default class ImageUploader {
    attachedImages = {};
    popups = null;
    apiUpload = (dataURL) => {};

    constructor(popups, apiUpload) {
        this.popups = popups
        this.apiUpload = apiUpload;
    }

    async upload() {
        let dataURL;
        try {
            dataURL = await getImageAsDataURL(null, undefined, 2);
        } catch (err) {
            this.popups.error("Ошибка загрузки изображения", err.toString());
            return;
        }

        const existsId = this.attachedImages[await hashSHA256(dataURL)];
        if (existsId) {
            return existsId;
        }

        const response = await this.apiUpload(dataURL);
        if (!response.ok_) {
            this.popups.error(`Ошибка ${response.status_}!`, `Не удалось загрузить картинку на сервер: ${response.info}`);
            return;
        }
        this.popups.success('Загружено', 'Картинка загружена');
        const id = response.id;
        this.attachedImages[await hashSHA256(dataURL)] = id;

        return id;
    }
}
