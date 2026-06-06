export type MapleInfo = {
  character_name: string;
  world_name?: string;
  level?: number;
};

export type FarmingLog = {
  id?: string;
  nickname: string;
  date: string;
  meso_man: number;
  frags: number;
  gems: number;
};
