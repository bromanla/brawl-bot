import axios from 'axios'
import { API, getRandomId } from 'vk-io'
import { Players } from './sqlite.js'
import { config } from './config.js'

const api = new API({ token: config.vk.token })

const { data } = await axios({
  method: 'get',
  url: `https://api.brawlstars.com/v1/clubs/%23${config.brawl.clanTag}/members`,
  headers: { Authorization: `Bearer ${config.brawl.token}` }
})

const stats = []
const playersCache = await Players.findAll()
const updateSql = data.items.map((player) => {
  const cache = playersCache.find(el => el.name === player.name)

  if (cache) {
    const diff = player.trophies - cache.trophies

    if (Math.abs(diff) > 0) {
      stats.push({ name: player.name, diff })
    }
  }

  return { name: player.name, trophies: player.trophies }
})

if (stats.length) {
  const message = stats
    .sort((a, b) => b.diff - a.diff)
    .reduce((acc, player, index) => {
      return acc += `${index + 1}. ${player.name} ${player.diff}\n`
    }, 'Статистика за день:\n')

  await api.messages.send({
    message,
    peer_id: config.vk.conversationId,
    random_id: getRandomId()
  })
}

await Players.destroy({ truncate: true })
await Players.bulkCreate(updateSql)
