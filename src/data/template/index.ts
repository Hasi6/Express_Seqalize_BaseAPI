import { Model, Table, Column, BelongsToMany, HasMany } from 'sequelize-typescript';

import { Node } from '@data/node';
import { TemplateNode } from '@data/template_node';

@Table({ tableName: 'templates' })
export class Template extends Model<Template> {
  @Column({ primaryKey: true, autoIncrement: true })
  id!: number;

  @Column
  name!: string;

  @BelongsToMany(() => Node, () => TemplateNode)
  nodes!: Node[];

  @HasMany(() => TemplateNode)
  templateNodes!: TemplateNode[];

  public async addNode(nodeId: number) {
    await TemplateNode.create({ nodeId, templateId: this.id } as any);
  }
}
