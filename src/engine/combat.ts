import { CombatStrategy, DelayedMacro } from "grimoire-kolmafia";
import { Monster } from "kolmafia";
import { $item, $skill, StrictMacro } from "libram";

export class Macro extends StrictMacro {
  private delevel(): this {
    return this.trySkill($skill`Micrometeorite`)
      .tryItem($item`Rain-Doh indigo cup`)
      .trySkill($skill`Summon Love Mosquito`)
      .tryItem($item`Time-Spinner`)
      .tryItem($item`HOA citation pad`);
  }

  kill(): this {
    return this.delevel()
      .trySkill($skill`Sing Along`)
      .trySkill($skill`Bowl Straight Up`)
      .attack()
      .repeat();
  }

  static kill(): Macro {
    return new Macro().kill();
  }
}

export class BaggoStrategy extends CombatStrategy {
  autoAndMacro(macro: DelayedMacro, monsters?: Monster | Monster[]): this {
    return this.autoattack(macro, monsters).macro(macro, monsters);
  }
}
