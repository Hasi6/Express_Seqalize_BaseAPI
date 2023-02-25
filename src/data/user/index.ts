import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import Post from '@data/post';
import Image from '@data/image';

@Table
class User extends Model<User> {
  @Column
  name!: string;

  @Column
  email!: string;

  @HasMany(() => Post)
  posts!: Post[];

  @HasMany(() => Image)
  images!: Image[];
}

export default User;
