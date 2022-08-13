import dotenv from 'dotenv'

const { error } = dotenv.config()
if (error) throw new Error('Couldn\'t find .env file')

const config = {
  brawl: {
    token: process.env.BRAWL_TOKEN,
    clanTag: process.env.BRAWL_CLAN_TAG
  },
  vk: {
    conversationId: process.env.VK_CONVERSATION_ID,
    token: process.env.VK_TOKEN
  }
}

export { config }