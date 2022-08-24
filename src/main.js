import axios from 'axios'
import { Op } from 'sequelize'
import { config } from './config.js'
import { Players } from './sqlite.js'
import { API, getRandomId } from 'vk-io'
import { endOfDay, startOfDay } from 'date-fns'

const api = new API({ token: config.vk.token })

const { data } = await axios({
  method: 'get',
  url: `https://api.brawlstars.com/v1/clubs/%23${config.brawl.clanTag}/members`,
  headers: { Authorization: `Bearer ${config.brawl.token}` }
})

const messageStats = []

const lastRow = await Players.findOne({
  attributes: ['createdAt'],
  order: [
    ['id', 'desc']
  ]
})

const playersCache = lastRow
  ? await Players.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfDay(lastRow.createdAt), endOfDay(lastRow.createdAt)]
        }
      }
    })
  : []

const insertSql = data.items.map((player) => {
  let difference = 0
  const cache = playersCache.find((el) => el.tag === player.tag)

  if (cache) {
    difference = player.trophies - cache.trophies

    if (difference !== 0) {
      messageStats.push({ name: player.name, difference })
    }
  }

  return {
    name: player.name,
    tag: player.tag,
    trophies: player.trophies,
    difference
  }
})

await Players.bulkCreate(insertSql)

const maxDifferencePlayer = await Players.findOne({
  order: [
    ['difference', 'desc']
  ]
})

const minDifferencePlayer = await Players.findOne({
  order: [
    ['difference', 'asc']
  ]
})

if (messageStats.length) {
  const statsMessage = messageStats
    .sort((a, b) => b.difference - a.difference)
    .reduce((acc, player, index) => {
      return acc += `${index + 1}. ${player.name} ${player.difference}\n`
    }, 'Статистика за день:\n')

  const recordMessage = `Рекорд: ${minDifferencePlayer.name} ${minDifferencePlayer.difference}`
  const antiRecordMessage = `Антирекорд: ${maxDifferencePlayer.name} ${maxDifferencePlayer.difference}`
  const message = [statsMessage, recordMessage, antiRecordMessage].join('\n')

  await api.messages.send({
    message,
    peer_id: config.vk.conversationId,
    random_id: getRandomId()
  })
} else {
  console.log('Обновлений нет')
}


