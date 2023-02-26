import { Model, Table, Column, ForeignKey, BelongsTo } from 'sequelize-typescript';

import { Node } from '@data/node';
import { Template } from '@data/template';

@Table({ tableName: 'template_node' })
export class TemplateNode extends Model<TemplateNode> {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @ForeignKey(() => Template)
  @Column
  templateId!: number;

  @ForeignKey(() => Node)
  @Column
  nodeId!: number;

  @BelongsTo(() => Node)
  node!: Node;

  @BelongsTo(() => Template)
  template!: Template;
}
