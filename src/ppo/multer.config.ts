import { diskStorage } from 'multer';
import { extname } from 'path';

export const storage = diskStorage({
  destination: './images/ppo', // папка для всіх ППО файлів
  filename: (req, file, cb) => {
    // беремо slug з body або з link
    // якщо в body немає link, fallback - 'default'
    const slug = req.body.link?.replace('/ppo/', '') || 'default';
    // додаємо суфікс для аватару
    const suffix = file.fieldname === 'avatar' ? '-avatar' : '';
    // беремо розширення оригінального файлу
    const fileExt = extname(file.originalname);
    // генеруємо назву: slug[-avatar].ext
    cb(null, `${slug}${suffix}${fileExt}`);
  },
});
