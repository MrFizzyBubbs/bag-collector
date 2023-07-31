import { cliExecute, Effect, use } from "kolmafia";
import {
  $effect,
  $effects,
  $item,
  $location,
  CursedMonkeyPaw,
  ensureEffect,
  get,
  getModifier,
  have,
} from "libram";
import { BaggoTask } from "../../../engine/task";

// Not accessible in 2crs :(.

const blocklist: Effect[] = [
  $effect`Green Tongue`,
  $effect`Black Tongue`,
  $effect`Cold Hearted`,
  $effect`ChibiChanged™`,
  $effect`Video... Games?`,
  $effect`Unbarking Dogs`,
  $effect`Sugar-Frosted Pet Guts`,
  $effect`Pajama Party`,
  $effect`Robot Friends`,
  $effect`Smart Drunk`,
  $effect`The Inquisitor's Unknown Effect`,
  $effect`She Ate Too Much Candy`,
  $effect`Thanksgetting`,
  $effect`Wassailing You`,
  $effect`Spirit of Galactic Unity`,
  $effect`Meteor Showered`,
  $effect`Gleam-Inducing`,
  $effect`Party on Your Skin`,
  $effect`Boxing Day Glow`,
  $effect`Crimbeau'd`,
  $effect`Panna Consideration`,
  $effect`Yeg's Glory`,
  $effect`Shortly Stacked`,
  $effect`In the Depths`,
  $effect`Reliable Backup`,
  $effect`Soothing Flute`,
];

const blockedEffects: Effect[] = [...blocklist];
const blockedMonkeyWishes: Effect[] = [...blocklist];
const blockedGenieWishes: Effect[] = [...blocklist];

const ensureBuff = (effect: Effect): BaggoTask[] => {
  return [
    {
      name: `gain ${effect.name}`,
      completed: () => have(effect) || blockedEffects.indexOf(effect) > -1,
      do: () => {
        try {
          ensureEffect(effect);
        } catch (e) {
          blockedEffects.push(effect);
        }
      },
    },
    {
      name: `monkey wish ${effect.name}`,
      completed: () =>
        have(effect) ||
        get("_monkeyPawWishesUsed") >= 5 ||
        blockedMonkeyWishes.indexOf(effect) > -1 ||
        effect.attributes.includes("nohookah"),
      do: () => {
        CursedMonkeyPaw.wishFor(effect);
        blockedMonkeyWishes.push(effect);
      },
    },
    {
      name: `genie wish ${effect.name}`,
      completed: () =>
        have(effect) ||
        blockedGenieWishes.indexOf(effect) > -1 ||
        effect.attributes.includes("nohookah"),
      do: () => {
        cliExecute(`genie effect ${effect.name}`);
        blockedGenieWishes.push(effect);
      },
      acquire: [
        {
          item: $item`pocket wish`,
          price: 50000,
        },
      ],
    },
  ];
};

const famWeightTasks: BaggoTask[] = [];
$effects``
  .filter((effect: Effect) => getModifier("Familiar Weight", effect) > 0)
  .forEach((effect) => {
    famWeightTasks.push(...ensureBuff(effect));
  });

export const BUFF_TASKS: BaggoTask[] = [
  {
    name: "oasis",
    completed: () => have($effect`Ultrahydrated`),
    do: $location`The Oasis`,
  },
  {
    // For whatever reason, getting `vide games...?` doesnt work, so we do it manually.
    name: "defective game grid token",
    ready: () => have($item`defective Game Grid token`),
    completed: () => get("_defectiveTokenUsed"),
    do: () => use($item`defective Game Grid token`),
  },
  ...famWeightTasks,
];