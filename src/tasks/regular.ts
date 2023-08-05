import {
  abort,
  adv1,
  canAdventure,
  expectedColdMedicineCabinet,
  getWorkshed,
  inebrietyLimit,
  Location,
  myInebriety,
  runChoice,
  totalTurnsPlayed,
  visitUrl,
} from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $location,
  $monster,
  $skill,
  AutumnAton,
  Counter,
  get,
  getKramcoWandererChance,
  have,
  JuneCleaver,
  Macro,
  SourceTerminal,
  uneffect,
  withProperty,
} from "libram";
import { args } from "../args";
import { BaggoCombatStrategy } from "../engine/combat";
import { BaggoTask } from "../engine/task";
import { freeFightFamiliarSpec } from "../familiar/free-fight-familiar";
import { meatFamiliarSpec } from "../familiar/meat-familiar";
import { isSober } from "../lib";
import { baggoOutfit } from "../outfit";
import { EFFECTS } from "../effects";
import { Outfit, OutfitSpec } from "grimoire-kolmafia";
import { juneCleaverChoices } from "../resources/cleaver";
import { BaggoEngine } from "../engine/engine";

export const REGULAR_TASKS: BaggoTask[] = [
  {
    name: "Digitized Wanderer",
    completed: () => Counter.get("Digitize Monster") > 0,
    do: () => (isSober() ? $location`Noob Cave` : $location`Drunken Stupor`),
    outfit: (): OutfitSpec | Outfit => {
      return SourceTerminal.getDigitizeMonster() === $monster`Knob Goblin Embezzler`
        ? { ...meatFamiliarSpec(), modifier: "meat" }
        : baggoOutfit();
    },
    combat: new BaggoCombatStrategy().kill(),
    effects: EFFECTS,
    limit: { completed: true },
  },
  {
    name: "June Cleaver",
    completed: () => get("_juneCleaverFightsLeft") > 0,
    ready: () => JuneCleaver.have(),
    do: () =>
      withProperty("recoveryScript", "", () => {
        const target =
          myInebriety() > inebrietyLimit() ? $location`Drunken Stupor` : $location`Noob Cave`;
        adv1(target, -1, "");
      }),
    post: (): void => {
      if (["Poetic Justice", "Lost and Found"].includes(get("lastEncounter")))
        uneffect($effect`Beaten Up`);
    },
    choices: juneCleaverChoices,
    outfit: { weapon: $item`June cleaver` },
    combat: new BaggoCombatStrategy().macro(Macro.abort()),
    limit: { completed: true },
  },
  {
    name: "Proton Ghost",
    ready: () =>
      have($item`protonic accelerator pack`) && canAdventure(get("ghostLocation", Location.none)),
    completed: () => get("questPAGhost") === "unstarted" || args.buff,
    do: () => get("ghostLocation") ?? abort("Failed to find proper ghost location"),
    effects: EFFECTS,
    outfit: (): OutfitSpec => {
      return {
        ...baggoOutfit(false).spec(),
        ...freeFightFamiliarSpec(),
        back: $item`protonic accelerator pack`,
      };
    },
    combat: new BaggoCombatStrategy().macro(
      Macro.trySkill($skill`Sing Along`)
        .trySkill($skill`Summon Love Gnats`)
        .trySkill($skill`Shoot Ghost`)
        .trySkill($skill`Shoot Ghost`)
        .trySkill($skill`Shoot Ghost`)
        .trySkill($skill`Trap Ghost`)
    ),
    limit: { completed: true },
  },
  {
    name: "Kramco",
    ready: () => have($item`Kramco Sausage-o-Matic™`),
    completed: () => getKramcoWandererChance() < 1,
    do: () => (isSober() ? $location`Noob Cave` : $location`Drunken Stupor`),
    outfit: (): OutfitSpec => {
      return {
        ...baggoOutfit(false).spec(),
        ...freeFightFamiliarSpec(),
        offhand: $item`Kramco Sausage-o-Matic™`,
      };
    },
    combat: new BaggoCombatStrategy().kill(),
    limit: { completed: true },
  },
  {
    name: "Cold Medicine Cabinet",
    ready: () =>
      getWorkshed() === $item`cold medicine cabinet` &&
      expectedColdMedicineCabinet()["pill"] === $item`Extrovermectin™`,
    completed: () =>
      get("_coldMedicineConsults") >= 5 || get("_nextColdMedicineConsult") > totalTurnsPlayed(),
    do: (): void => {
      visitUrl("campground.php?action=workshed");
      runChoice(5);
    },
    limit: { tries: 5 },
  },
  {
    name: "Autumn-Aton",
    completed: () => !AutumnAton.available(),
    do: (): void => {
      AutumnAton.sendTo($location`The Neverending Party`);
    },
    limit: { completed: true },
  },
  {
    name: "Pledge Allegiance",
    completed: () =>
      have($effect`Citizen of a Zone`) && get("_citizenZoneMods").includes("Item Drop: +30"),
    ready: () => isSober() && have($familiar`Patriotic Eagle`),
    prepare: () => uneffect($effect`Citizen of a Zone`),
    do: $location`Noob Cave`,
    outfit: (): OutfitSpec => {
      return { ...baggoOutfit(false).spec(), familiar: $familiar`Patriotic Eagle` };
    },
    combat: new BaggoCombatStrategy().macro(() =>
      Macro.skill($skill`%fn, let's pledge allegiance to a Zone`)
        .step(BaggoEngine.runMacro())
        .attack()
        .repeat()
    ),
  },
];
