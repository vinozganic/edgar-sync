import { Module } from '@nestjs/common';
import mongoProvider from './mongo.provider';

@Module({
  providers: [mongoProvider],
  exports: [mongoProvider],
})
export class MongoModule {}