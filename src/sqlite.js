import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  host: 'database.sqlite',
  logging: false
})

const Players = sequelize.define('players', {
  name: { type: DataTypes.STRING },
  trophies: { type: DataTypes.NUMBER }
}, {
  createdAt: false,
  updatedAt: false
})

await sequelize.sync()
export { Players }