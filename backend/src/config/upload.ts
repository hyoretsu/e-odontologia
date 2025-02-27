import multer from 'multer';
import path from 'path';

interface IUploadConfig {
    driver: 'disk';

    uploadsFolder: string;

    multer: multer.Options;
}

const uploadsFolder = path.resolve(process.env.NODE_ENV === 'production' ? '/srv/ton/backend/storage' : 'tmp/uploads');

export default {
    driver: process.env.STORAGE_DRIVER,

    uploadsFolder,

    multer: {
        fileFilter(req, file, cb) {
            file.fieldname = Buffer.from(file.fieldname, 'latin1')
                .toString('utf8')
                .replace(/l.+?ngua/g, 'língua')
                .replace(/C.+?u/g, 'Céu');
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');

            return cb(null, true);
        },
        storage: multer.diskStorage({
            destination(req, file, cb) {
                return cb(null, uploadsFolder);
            },
            filename(req, file, cb) {
                return cb(null, `${file.originalname}`);
            },
        }),
    },
} as IUploadConfig;
