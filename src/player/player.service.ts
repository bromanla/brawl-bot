import type { PlayerStore } from './player.store.ts';
import type { Player } from './player.type.ts';
import type { ClanMembers } from '../brawl/brawl.type.ts';

export class PlayerService {
  private readonly playerStore: PlayerStore;

  constructor(playerStore: PlayerStore) {
    this.playerStore = playerStore;
  }

  public handleStats(clanMembers: ClanMembers[], cachePlayers: Player[]) {
    return clanMembers.map((member) => {
      const cachePlayer = cachePlayers.find(({ tag }) => tag === member.tag);
      const difference = cachePlayer
        ? member.trophies - cachePlayer.trophies
        : 0;

      const player = {
        name: member.name,
        tag: member.tag,
        trophies: member.trophies,
        difference,
      };

      return player;
    });
  }

  public getStatsMessage(
    header: string,
    players: Pick<Player, 'name' | 'difference'>[],
  ) {
    return players
      .filter(({ difference }) => difference !== 0)
      .sort((a, b) => b.difference - a.difference)
      .reduce(
        (acc, { name, difference }, index) =>
          acc + `${index + 1}. ${name} ${difference}\n`,
        header,
      );
  }

  public getRecordMessage(
    createdAfter: number,
    message: string,
    sort: 'MAX' | 'MIN',
  ) {
    const player = this.playerStore.getTopByDifference(
      createdAfter,
      sort === 'MAX' ? 'DESC' : 'ASC',
    );

    return player ? `${message} ${player.name} ${player.difference}` : '';
  }
}
