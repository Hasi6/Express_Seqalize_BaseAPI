import { BelongsToMany, Column, HasMany, Model, Table } from 'sequelize-typescript';

import { Template } from '@data/template';
import { TemplateNode } from '@data/template_node';

@Table({ tableName: 'nodes' })
export class Node extends Model<Node> {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  name!: string;

  @BelongsToMany(() => Template, () => TemplateNode)
  templates!: Template[];

  @HasMany(() => TemplateNode)
  templateNodes!: TemplateNode[];
}
