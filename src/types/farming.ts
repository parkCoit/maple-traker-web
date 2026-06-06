export type Character = {
  name: string;
  world: string;
  job: string;
  level: number;
  exp: number;
  image?: string;
};

export type MapleInfo = {
  ocid: string;
  character_name: string;
  world_name: string;
  character_class: string;
  character_level: number;
  character_exp: number;
  character_image?: string;
};

export type Revenue = {
  today: number;
  week: number;
  month: number;
};

export type FarmingLog = {
  date: string;
  stuff: number;
  meso: number;
  frags: number;
  gems: number;
  total: number;
};

export type DisplayFarmingLog = FarmingLog;
