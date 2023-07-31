import { BaggoTask } from "../../../../engine/task";
import { cleaverTask } from "./shared";
import * as LOV from "./lov";
import * as Oasis from "./oasis";
import * as Gingerbread from "./gingerbread";
import * as Buyable from "./buyable";
import * as Payphone from "./closedcircuitphone";
import * as Snojo from "./snojo";
import * as Tentacles from "./tentacles";
import * as Oliver from "./oliver";
import * as Locket from "./locket";
import * as Prof from "./pocketprofessor";
import * as Putty from "./putty";
import * as Backup from "./backup";
import * as Witchess from "./witchess";
import * as Fax from "./fax";
import * as Chateau from "./chateau";
import * as Drunks from "./drunks";
import * as NEP from "./nep";

const freeFightTasks = [cleaverTask];

const freeFightTaskGroups = [
  LOV,
  Oasis,
  Gingerbread,
  Buyable,
  Payphone,
  Snojo,
  Tentacles,
  Oliver,
  Locket,
  Prof,
  Putty,
  Backup,
  Witchess,
  Fax,
  Chateau,
  Drunks,
  NEP,
];

freeFightTaskGroups.forEach((tasks) => {
  freeFightTasks.push(...tasks.freefightTasks);
});

export const getFreeFightTasks = (): BaggoTask[] => {
  return [...freeFightTasks];
};
