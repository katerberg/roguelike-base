export type DungeonMap = {
  levels: MapLevel[];
};

export type NumberCoordinates = {x: number; y: number};
export type Coordinate = `${number},${number}`;

export enum CellType {
  VerticalDoor,
  HorizontalDoor,
  Earth,
  Exit,
  Wall,
}

export enum VisibilityStatus {
  Unseen,
  Seen,
  Visible,
}

export enum TrophyType {
  Trophy = 'Orb',
}

export enum PotionType {
  Health = 'Health',
}

export enum GearType {
  SwordBasic = 'Basic',
}

export enum ItemType {
  Gear,
  Trophy,
  Potion,
}

export type Item = {
  itemId: string;
  type: ItemType;
  subtype: PotionType | GearType | TrophyType;
  minAttack?: number;
  maxAttack?: number;
};

export type Cell = {
  x: number;
  y: number;
  isEntrance: boolean;
  isExit: boolean;
  isPassable: boolean;
  isWalkable: boolean;
  type: CellType;
  visibilityStatus: VisibilityStatus;
  items: Item[];
};

export type MapLevel = {
  playerSpawn: Coordinate;
  exits: Coordinate[];
  cells: {
    [key: Coordinate]: Cell;
  };
};