import {getImageAsDataURL} from "@korolion/get-image-as-dataurl";

export default class ImageUploader {
    popups = null;
    cropSize = null;
    compressSize = null;
    apiUpload = (dataURL) => {};

    constructor(popups, apiUpload, cropSize=null, compressSize=null) {
        this.popups = popups
        this.apiUpload = apiUpload;
        this.cropSize = cropSize;
        this.compressSize = compressSize;
    }

    async getUserImage() {
        let dataURL;
        try {
            dataURL = await getImageAsDataURL(this.cropSize, this.compressSize, undefined, Infinity);
        } catch (err) {
            this.popups.error("Ошибка загрузки изображения", err.toString());
        }
        return dataURL;
    }

    async upload(dataURL) {
        if (dataURL === undefined)
            dataURL = await this.getUserImage();

        const response = await this.apiUpload(dataURL);
        if (!response.ok_) {
            this.popups.error(`Ошибка ${response.status_}!`, `Не удалось загрузить картинку на сервер: ${response.info}`);
            return;
        }
        this.popups.success('Загружено', 'Картинка загружена');
        const id = response.id;

        return id;
    }
}
