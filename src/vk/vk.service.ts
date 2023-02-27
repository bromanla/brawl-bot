import { VK, getRandomId } from 'vk-io';
import { Emitter } from '#src/common/emitter.js';
import type { Event } from './vk.type';

export class VkService {
  private readonly emitter = new Emitter<Event>();
  private readonly client: VK;
  private readonly peerId: number;
  private readonly admins: number[];
  private readonly commands = ['season', 'origin'] as const;

  constructor(token: string, peerId: number, admins: number[]) {
    this.client = new VK({ token });
    this.peerId = peerId;
    this.admins = admins;
  }

  /* Отправить сообщение в беседу */
  public sendMessage(message: string) {
    return this.client.api.messages.send({
      message,
      peer_id: this.peerId,
      random_id: getRandomId(),
    });
  }

  public async mount() {
    this.client.updates.on('message_new', async (ctx) => {
      if (
        !ctx.isInbox ||
        !ctx.isChat ||
        !ctx.text ||
        ctx.peerId !== this.peerId ||
        !this.admins.includes(ctx.senderId)
      )
        return false;

      for (const command of this.commands) {
        if (`/${ctx.text}`.includes(command)) {
          this.emitter.emit(command, undefined);
          break;
        }
      }
    });

    await this.client.updates.start();
  }

  public get on() {
    return this.emitter.on;
  }
}
