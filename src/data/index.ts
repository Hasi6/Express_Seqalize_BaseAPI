import { Sequelize } from 'sequelize-typescript';
import User from '@data/user';
import Post from '@data/post';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'path/to/database.sqlite',
  models: [User, Post],
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // ... start your application here ...
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
