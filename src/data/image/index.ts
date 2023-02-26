import { Table, Column, Model, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from '@data/user';

@Table
export class Image extends Model<Image> {
  @Column
  title!: string;

  @Column
  content!: string;

  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;
}
