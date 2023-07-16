import { BaggoCombatStrategy, CombatActions } from "./combat";
import { Limit, Quest, Task } from "grimoire-kolmafia";

export type BaggoLimit = Limit & { completed?: boolean };
export type BaggoTask = {
  combat?: BaggoCombatStrategy;
  limit?: BaggoLimit;
} & Task<CombatActions>;
export type BaggoQuest = Quest<BaggoTask>;
