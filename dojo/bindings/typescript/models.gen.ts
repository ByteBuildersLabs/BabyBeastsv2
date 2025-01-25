import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import type { BigNumberish } from 'starknet';

type RemoveFieldOrder<T> = T extends object
  ? Omit<
      {
        [K in keyof T]: T[K] extends object ? RemoveFieldOrder<T[K]> : T[K];
      },
      'fieldOrder'
    >
  : T;
// Type definition for `babybeasts::models::Beast` struct
export interface Beast {
	fieldOrder: string[];
	beast_id: BigNumberish;
	player: string;
	specie: BigNumberish;
	is_alive: boolean;
	is_awake: boolean;
	hunger: BigNumberish;
	max_hunger: BigNumberish;
	energy: BigNumberish;
	max_energy: BigNumberish;
	happiness: BigNumberish;
	max_happiness: BigNumberish;
	hygiene: BigNumberish;
	max_hygiene: BigNumberish;
	attack: BigNumberish;
	defense: BigNumberish;
	speed: BigNumberish;
	level: BigNumberish;
	experience: BigNumberish;
	next_level_experience: BigNumberish;
}
export type InputBeast = RemoveFieldOrder<Beast>;

// Type definition for `babybeasts::models::BeastValue` struct
export interface BeastValue {
	fieldOrder: string[];
	player: string;
	specie: BigNumberish;
	is_alive: boolean;
	is_awake: boolean;
	hunger: BigNumberish;
	max_hunger: BigNumberish;
	energy: BigNumberish;
	max_energy: BigNumberish;
	happiness: BigNumberish;
	max_happiness: BigNumberish;
	hygiene: BigNumberish;
	max_hygiene: BigNumberish;
	attack: BigNumberish;
	defense: BigNumberish;
	speed: BigNumberish;
	level: BigNumberish;
	experience: BigNumberish;
	next_level_experience: BigNumberish;
}
export type InputBeastValue = RemoveFieldOrder<BeastValue>;

// Type definition for `babybeasts::models::BeastId` struct
export interface BeastId {
	fieldOrder: string[];
	id: BigNumberish;
	beast_id: BigNumberish;
}
export type InputBeastId = RemoveFieldOrder<BeastId>;

// Type definition for `babybeasts::models::BeastIdValue` struct
export interface BeastIdValue {
	fieldOrder: string[];
	beast_id: BigNumberish;
}
export type InputBeastIdValue = RemoveFieldOrder<BeastIdValue>;

export interface SchemaType extends ISchemaType {
	babybeasts: {
		Beast: Beast,
		BeastValue: BeastValue,
		BeastId: BeastId,
		BeastIdValue: BeastIdValue,
	},
}
export const schema: SchemaType = {
	babybeasts: {
		Beast: {
			fieldOrder: ['beast_id', 'player', 'specie', 'is_alive', 'is_awake', 'hunger', 'max_hunger', 'energy', 'max_energy', 'happiness', 'max_happiness', 'hygiene', 'max_hygiene', 'attack', 'defense', 'speed', 'level', 'experience', 'next_level_experience'],
			beast_id: 0,
			player: "",
			specie: 0,
			is_alive: false,
			is_awake: false,
			hunger: 0,
			max_hunger: 0,
			energy: 0,
			max_energy: 0,
			happiness: 0,
			max_happiness: 0,
			hygiene: 0,
			max_hygiene: 0,
			attack: 0,
			defense: 0,
			speed: 0,
			level: 0,
			experience: 0,
			next_level_experience: 0,
		},
		BeastValue: {
			fieldOrder: ['player', 'specie', 'is_alive', 'is_awake', 'hunger', 'max_hunger', 'energy', 'max_energy', 'happiness', 'max_happiness', 'hygiene', 'max_hygiene', 'attack', 'defense', 'speed', 'level', 'experience', 'next_level_experience'],
			player: "",
			specie: 0,
			is_alive: false,
			is_awake: false,
			hunger: 0,
			max_hunger: 0,
			energy: 0,
			max_energy: 0,
			happiness: 0,
			max_happiness: 0,
			hygiene: 0,
			max_hygiene: 0,
			attack: 0,
			defense: 0,
			speed: 0,
			level: 0,
			experience: 0,
			next_level_experience: 0,
		},
		BeastId: {
			fieldOrder: ['id', 'beast_id'],
			id: 0,
			beast_id: 0,
		},
		BeastIdValue: {
			fieldOrder: ['beast_id'],
			beast_id: 0,
		},
	},
};
// Type definition for ERC__Balance struct
export type ERC__Type = 'ERC20' | 'ERC721';
export interface ERC__Balance {
    fieldOrder: string[];
    balance: string;
    type: string;
    tokenMetadata: ERC__Token;
}
export interface ERC__Token {
    fieldOrder: string[];
    name: string;
    symbol: string;
    tokenId: string;
    decimals: string;
    contractAddress: string;
}
export interface ERC__Transfer {
    fieldOrder: string[];
    from: string;
    to: string;
    amount: string;
    type: string;
    executedAt: string;
    tokenMetadata: ERC__Token;
    transactionHash: string;
}