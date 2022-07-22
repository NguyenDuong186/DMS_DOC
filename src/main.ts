import {ValidationPipe} from '@nestjs/common'
import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true})

  //app.use(helmet())
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(5001)
}
bootstrap()
