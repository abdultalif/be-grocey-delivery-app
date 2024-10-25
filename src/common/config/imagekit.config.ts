// import { ConfigService } from '@nestjs/config';
// import ImageKit from 'imagekit';

// export class ImagekitService {
//   private imagekit: ImageKit;

//   constructor(private configService: ConfigService) {
//     this.imagekit = new ImageKit({
//       publicKey: this.configService.get('IMAGEKIT_PUBLIC_KEY'),
//       privateKey: this.configService.get('IMAGEKIT_PRIVATE_KEY'),
//       urlEndpoint: this.configService.get('IMAGEKIT_URL_ENDPOINT'),
//     });
//   }

//   getInstance(): ImageKit {
//     return this.imagekit;
//   }
// }

import ImageKit from 'imagekit';

export const imagekit = new ImageKit({
  publicKey: 'ublic_sBnwnruGG/rhPZDu6DkNM7rb2DA=',
  privateKey: 'private_gY63K7N6p90/9XOJy4y7dFWf/Vc=',
  urlEndpoint: 'https://ik.imagekit.io/abdullt85/',
});
