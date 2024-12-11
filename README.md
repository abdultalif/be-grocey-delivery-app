<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Tech Stack

NestJS, TypeORM, TypeScript, Redis, PostgreSQL, Jest, Super Test, ImageKit, JWT, Raja Ongkir, Midtrans Snap, Docker

# Backend Environment Variables

Untuk menjalankan projek ini, kamu perlu menambahkkan environment variables berikut ke dalam file .env di backend

`DB_HOST`
`DB_PORT`
`DB_USERNAME`
`DB_PASSWORD`
`DB_NAME`
`JWT_SECRET`
`JWT_EXPIRES_IN`
`IMAGEKIT_PUBLIC_KEY`
`IMAGEKIT_PRIVATE_KEY`
`IMAGEKIT_URL_ENDPOINT`
`RAJA_ONGKIR_KEY`
`PORT`
`MIDTRANS_SERVER_KEY`
`REDIS_HOST`
`REDIS_PORT`

# Menjalankan Projek di Lokal

## Menjalankan backend

Clone projek github

```bash
  git clone https://github.com/abdultalif/be-grocey-delivery-app.git
```

Buka direktori project

```bash
  cd .\be-grocey-delivery-app\
```

Install dependencies backend

```bash
  yarn install
```

migaration table database

```bash
  yarn migration:run
```

Jalankan server

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

# Menjalankan Unit Testing

Clone projek github

```bash
    git clone https://github.com/abdultalif/be-grocey-delivery-app.git
```

Buka direktori project

```bash
  cd .\be-grocey-delivery-app\
```

Jalankan integration test

```bash
  yarn test:e2e
```

Jalankan unit test

```bash
  yarn test
```

Jalankan coverage

```bash
  yarn test:cov
```
