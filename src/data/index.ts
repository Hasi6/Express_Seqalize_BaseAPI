import { Sequelize } from 'sequelize-typescript';
import { User } from '@data/user';
import { Post } from '@data/post';
import { Template } from '@data/template';
import { TemplateNode } from '@data/template_node';
import { Node } from '@data/node';
import { Image } from './image';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite',
  models: [User, Post, Image, Template, Node, TemplateNode],
  logging: false,
  // sync: {
  //   alter: true,
  //   force: true,
  // },
});

export async function connectDB() {
  try {
    await sequelize.sync();
    console.log('Connection to the database has been established successfully.');

    // ... start your application here ...
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

export { User as users, Post as posts, Image as images, Template as templates, Node as nodes };
