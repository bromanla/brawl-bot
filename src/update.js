import { VK } from 'vk-io'
import { config } from './config.js'

const vk = new VK({ token: config.vk.token })

vk.updates.on('message_new', (context) => {
  console.log(context.peerId)
})

await vk.updates.start()
