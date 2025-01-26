import { VK, getRandomId } from 'vk-io';
import { config } from '../common/config.ts';
import type { BotHandler } from './bot.type.ts';

export class BotService {
  private readonly client: VK;

  constructor() {
    this.client = new VK({ token: config.vk.token });
  }

  /** Send a message to a conversation */
  public sendMessage(message: string) {
    return this.client.api.messages.send({
      message,
      peer_id: config.vk.conversationId,
      random_id: getRandomId(),
    });
  }

  private commands = new Map<string, BotHandler>();
  public addCommand(command: string, fn: BotHandler) {
    this.commands.set(command, fn);
  }

  public async mount() {
    this.client.updates.on('message_new', async (ctx) => {
      if (
        !ctx.isInbox ||
        !ctx.isChat ||
        !ctx.text ||
        ctx.peerId !== config.vk.conversationId ||
        !config.vk.admins.includes(ctx.senderId)
      ) {
        if (!config.isDev) {
          return;
        }
      }

      for (const [command, handler] of this.commands.entries()) {
        if (ctx?.text?.startsWith(`/${command}`)) {
          await handler();
          break;
        }
      }
    });

    await this.client.updates.start();
  }
}
