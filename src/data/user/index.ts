import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import Post from '@data/post';

@Table
class User extends Model<User> {
  @Column
  name!: string;

  @Column
  email!: string;

  @HasMany(() => Post)
  posts!: Post[];
}

export default User;
