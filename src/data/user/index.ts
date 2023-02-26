import { Table, Column, Model, HasMany, BeforeCreate } from 'sequelize-typescript';
import { Post } from '@data/post';
import { Image } from '@data/image';

@Table
export class User extends Model<User> {
  @Column
  name!: string;

  @Column
  email!: string;

  @HasMany(() => Post)
  posts!: Post[];

  @HasMany(() => Image)
  images!: Image[];

  @BeforeCreate
  static doSomething(instance: User) {
    console.log(instance.get('name'));
  }
}
