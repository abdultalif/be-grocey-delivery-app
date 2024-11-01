import { Products } from 'src/products/products.entity';
import { DataSource } from 'typeorm';

export class productSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const productRepository = dataSource.getRepository(Products);

    const existingProducts = await productRepository.find();
    if (existingProducts.length > 0) return;

    const products = [
      {
        id: 'f2b3fa88-357c-4c21-8547-7988fd9b59bf',
        name: 'Anggur',
        category: 'Buah-buahan',
        weight: '500',
        price: '120000',
        stock: '30',
        image:
          'https://ik.imagekit.io/abdullt85/products/grapes-white-background_181303-4423_ey_PIxvQR.avif',
        image_public_id: '672505c4e375273f60f36ee6',
        description:
          'Anggur merah dengan tekstur renyah dan rasa manis alami. Buah ini kaya akan antioksidan dan cocok dinikmati sebagai camilan segar atau bahan tambahan pada salad buah.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'f7a6ccb8-ed4c-490e-9450-db83b9144a0e',
        name: 'Jeruk',
        category: 'Buah-buahan',
        weight: '500',
        price: '75000',
        stock: '24',
        image: 'https://ik.imagekit.io/abdullt85/products/jeruk_rwn6Rsqej.jpg',
        image_public_id: '67250814e375273f60026686',
        description:
          'Jeruk dengan rasa manis dan asam yang menyegarkan, kaya akan vitamin C. Jeruk ini cocok untuk dimakan langsung atau dibuat jus untuk menambah asupan gizi harian.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '108f3e79-f251-4cb4-8351-238468f6db05',
        name: 'Pisang',
        category: 'Buah-buahan',
        weight: '500',
        price: '25000',
        stock: '32',
        image: 'https://ik.imagekit.io/abdullt85/products/pisang_OFVevstvu.jpg',
        image_public_id: '672508cde375273f60056fe3',
        description:
          'Pisang dengan tekstur lembut dan rasa manis alami. Pisang ini sangat baik untuk pencernaan dan dapat dinikmati langsung, sebagai topping oatmeal, atau bahan utama smoothie.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'f9148529-2c57-4c7d-8c06-ba49db4f2994',
        name: 'Apel',
        category: 'Buah-buahan',
        weight: '500',
        price: '90000',
        stock: '47',
        image: 'https://ik.imagekit.io/abdullt85/products/apple_bbXkvi1Mx.jfif',
        image_public_id: '672509e5e375273f600b76ab',
        description:
          'Apel yang manis dan renyah, memberikan sensasi segar di setiap gigitan. Apel ini ideal untuk dikonsumsi langsung, dijadikan jus, atau dipakai sebagai bahan tambahan dalam berbagai hidangan pencuci mulut.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '7e07ae79-d450-4222-ae47-8d343fa8dbcd',
        name: 'Daging Sapi',
        category: 'Daging',
        weight: '1000',
        price: '150000',
        stock: '15',
        image: 'https://ik.imagekit.io/abdullt85/products/sapi_c0UsYX5FU.jfif',
        image_public_id: '67250b02e375273f601129e6',
        description:
          'Daging sapi berkualitas tinggi dengan tekstur lembut dan cita rasa kaya. Cocok untuk berbagai hidangan seperti steak, rendang, atau sup.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '9a09fcdf-a74f-4452-8663-4dcbc311519b',
        name: 'Daging Ayam',
        category: 'Daging',
        weight: '1000',
        price: '40000',
        stock: '15',
        image: 'https://ik.imagekit.io/abdullt85/products/ayam_u1aqYiYVt.jfif',
        image_public_id: '67250c52e375273f601dfb71',
        description:
          'Daging ayam segar dengan tekstur lembut, cocok untuk masakan sehari-hari seperti goreng, panggang, atau sup ayam yang lezat.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'b2ddde3c-9c88-41e5-8a8c-a69f72a393ca',
        name: 'Daging Domba',
        category: 'Daging',
        weight: '1000',
        price: '180000',
        stock: '34',
        image: 'https://ik.imagekit.io/abdullt85/products/domba_rKP_eYFFb.avif',
        image_public_id: '67250d7ce375273f60255501',
        description:
          'Daging domba berkualitas dengan rasa khas yang gurih dan tekstur lembut. Sempurna untuk hidangan istimewa seperti kari domba atau kebab.s',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '2e31279f-66fa-4bd4-bf27-4eb27439576b',
        name: 'Daging Ikan',
        category: 'Daging',
        weight: '1000',
        price: '60000',
        stock: '35',
        image: 'https://ik.imagekit.io/abdullt85/products/ikan_8VsM7aOD6.png',
        image_public_id: '67250f22e375273f602fa83f',
        description:
          'Daging ikan segar yang kaya akan nutrisi dan rendah lemak. Cocok untuk hidangan sehat seperti panggang, kukus, atau dibuat menjadi sup ikan.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'a34996cf-f754-4a05-a181-3db292f170c2',
        name: 'Tomat',
        category: 'Sayuran',
        weight: '500',
        price: '15000',
        stock: '23',
        image: 'https://ik.imagekit.io/abdullt85/products/Tomat_eui1SFqYX.jfif',
        image_public_id: '6725108fe375273f6035b361',
        description:
          'Tomat segar dengan rasa asam manis yang cocok untuk salad, saus, atau dimakan langsung. Kaya akan vitamin C dan antioksidan.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: '0c973ae0-2410-4eec-a40f-9251dc9c3a03',
        name: 'Wortel',
        category: 'Sayuran',
        weight: '500',
        price: '15000',
        stock: '23',
        image:
          'https://ik.imagekit.io/abdullt85/products/wortel_tO3mTfwu7.avif',
        image_public_id: '67251142e375273f6039dae9',
        description:
          'Wortel segar dengan tekstur renyah dan rasa manis alami. Sumber vitamin A yang baik untuk kesehatan mata dan kulit, cocok untuk jus atau hidangan tumis.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'b181c83d-dc6a-41d8-a3fa-ba5177896676',
        name: 'Brokoli',
        category: 'Sayuran',
        weight: '500',
        price: '15000',
        stock: '23',
        image:
          'https://ik.imagekit.io/abdullt85/products/brokoli_FBcktwjFa.webp',
        image_public_id: '672511b9e375273f603cf2d0',
        description:
          'Brokoli segar yang kaya akan serat dan vitamin K. Ideal untuk dikukus, ditumis, atau digunakan dalam hidangan sehat lainnya.',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await productRepository.save(products);
  }
}
