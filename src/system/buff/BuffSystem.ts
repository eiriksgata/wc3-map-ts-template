/**
 * 全局 Buff 驱动力：按固定间隔 tick 所有单位上的 Buff（持续时间、耗尽护盾移除等）
 */

import { Timer } from "@eiriksgata/wc3ts/*";
import { Actor } from "../actor";

const TICK_INTERVAL = 0.1;

export class BuffSystem {
  private static instance: BuffSystem;
  private timer: Timer | null = null;

  private constructor() {}

  public static getInstance(): BuffSystem {
    if (!BuffSystem.instance) {
      BuffSystem.instance = new BuffSystem();
    }
    return BuffSystem.instance;
  }

  public init(): void {
    if (this.timer !== null) return;
    this.timer = Timer.create();
    this.timer.start(TICK_INTERVAL, true, () => {
      const delta = TICK_INTERVAL;
      for (const id in Actor.allActors) {
        const actor = Actor.allActors[id];
        if (actor !== undefined && actor.hasBuffManager()) {
          actor.buffManager.tick(delta);
        }
      }
    });
  }
}
