import { Sequelize, DataTypes } from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'sqlite',
  host: 'database.sqlite',
  logging: false
})

const Players = sequelize.define('players', {
  name: { type: DataTypes.STRING },
  tag: { type: DataTypes.STRING },
  trophies: { type: DataTypes.NUMBER },
  difference: { type: DataTypes.NUMBER }
}, {
  createdAt: true,
  updatedAt: false
})

await sequelize.sync()
export { Players }
