interface Item {
  tag: string;
  name: string;
  nameColor: string;
  role: string;
  trophies: number;
  icon: { id: number };
}

export interface ClanMemberReq {
  items: Item[];
}
