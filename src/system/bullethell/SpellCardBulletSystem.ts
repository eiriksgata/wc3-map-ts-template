import {
  ATTACK_TYPE_MAGIC,
  DAMAGE_TYPE_NORMAL,
  Timer,
  UNIT_TYPE_DEAD,
  WEAPON_TYPE_WHOKNOWS,
} from "@eiriksgata/wc3ts/*";
import { EffectEx } from "src/system/EffectEx";
import {
  BulletState,
  BulletSystemStats,
  ImpactState,
  SpellCardEmitterState,
  SpellCardId,
  StartSpellCardOptions,
} from "./types";
import { createLogger } from "src/utils/logger";

const log = createLogger("BulletHell");

interface SystemConfig {
  bulletModel: string;
  impactModel: string;
  tickInterval: number;
  maxBullets: number;
  maxImpacts: number;
  collisionChecksPerTick: number;
  collisionTickStride: number;
}

const DEFAULT_CONFIG: SystemConfig = {
  bulletModel: "Abilities\\Weapons\\LichMissile\\LichMissile.mdl",
  impactModel: "Abilities\\Weapons\\LichMissile\\LichMissile.mdl",
  tickInterval: 0.02,
  maxBullets: 320,
  maxImpacts: 72,
  collisionChecksPerTick: 84,
  collisionTickStride: 2,
};

const DEFAULT_OPTIONS: Required<StartSpellCardOptions> = {
  duration: 10,
  emissionInterval: 0.08,
  baseSpeed: 620,
  bulletLife: 4,
  bulletRadius: 90,
  bulletDamage: 15,
  maxDistance: 1700,
};

const PLAYABLE_PLAYER_SLOTS = 12;

export class SpellCardBulletSystem {
  private static instance: SpellCardBulletSystem | null = null;

  private config: SystemConfig = DEFAULT_CONFIG;
  private timer: Timer | null = null;
  private collisionGroup: group = CreateGroup();

  private bullets: BulletState[] = [];
  private bulletFx: Array<EffectEx | undefined> = [];
  private freeBulletIndices: number[] = [];
  private activeBulletIndices: number[] = [];

  private impacts: ImpactState[] = [];
  private impactFx: Array<EffectEx | undefined> = [];

  private emitters: Record<number, SpellCardEmitterState> = {};
  private nextEmitterId = 1;

  private updateTick = 0;
  private collisionCursor = 0;

  private totalSpawned = 0;
  private totalDropped = 0;
  private totalHit = 0;
  private totalRecycled = 0;

  private constructor() {}

  public static getInstance(): SpellCardBulletSystem {
    if (!SpellCardBulletSystem.instance) {
      SpellCardBulletSystem.instance = new SpellCardBulletSystem();
    }
    return SpellCardBulletSystem.instance;
  }

  public initialize(custom?: Partial<SystemConfig>): void {
    if (custom) {
      this.config = { ...DEFAULT_CONFIG, ...custom };
    }

    if (this.bullets.length === 0) {
      this.allocateBulletPool();
      this.allocateImpactPool();
      log.info(`initialized, bullet pool=${this.config.maxBullets}`);
    }
  }

  private ensureTimer(): void {
    if (this.timer !== null) {
      return;
    }
    this.timer = Timer.create();
    this.timer.start(this.config.tickInterval, true, () => {
      this.update(this.config.tickInterval);
      this.stopTimerIfIdle();
    });
  }

  private hasWork(): boolean {
    for (const id in this.emitters) {
      if (this.emitters[id] !== undefined && this.emitters[id].active) {
        return true;
      }
    }
    if (this.activeBulletIndices.length > 0) {
      return true;
    }
    for (const impact of this.impacts) {
      if (impact.active) {
        return true;
      }
    }
    return false;
  }

  private stopTimerIfIdle(): void {
    if (this.hasWork()) {
      return;
    }
    if (this.timer !== null) {
      this.timer.destroy();
      this.timer = null;
    }
  }

  public startCardFromCaster(
    caster: unit,
    cardId: SpellCardId,
    options?: StartSpellCardOptions
  ): number | undefined {
    if (!caster || !this.isUnitAlive(caster)) {
      return undefined;
    }

    this.initialize();
    this.ensureTimer();

    const merged: Required<StartSpellCardOptions> = {
      ...DEFAULT_OPTIONS,
      ...options,
    };

    const id = this.nextEmitterId++;
    this.emitters[id] = {
      id,
      active: true,
      caster,
      cardId,
      duration: merged.duration,
      elapsed: 0,
      emissionInterval: merged.emissionInterval,
      emissionElapsed: 0,
      baseSpeed: merged.baseSpeed,
      bulletLife: merged.bulletLife,
      bulletRadius: merged.bulletRadius,
      bulletDamage: merged.bulletDamage,
      maxDistance: merged.maxDistance,
      phase: 0,
      wave: 0,
    };

    return id;
  }

  public stopCard(emitterId: number): void {
    const emitter = this.emitters[emitterId];
    if (!emitter) return;
    emitter.active = false;
    delete this.emitters[emitterId];
  }

  public stopAllCards(): void {
    for (const id in this.emitters) {
      delete this.emitters[id];
    }
  }

  public getStats(): BulletSystemStats {
    let activeEmitters = 0;
    for (const id in this.emitters) {
      if (this.emitters[id]?.active) {
        activeEmitters++;
      }
    }

    return {
      activeBullets: this.activeBulletIndices.length,
      activeEmitters,
      totalSpawned: this.totalSpawned,
      totalDropped: this.totalDropped,
      totalHit: this.totalHit,
      totalRecycled: this.totalRecycled,
    };
  }

  public destroy(): void {
    this.stopAllCards();

    if (this.timer) {
      this.timer.destroy();
      this.timer = null;
    }

    for (const fx of this.bulletFx) {
      fx?.destroy();
    }
    this.bulletFx = [];

    for (const fx of this.impactFx) {
      fx?.destroy();
    }
    this.impactFx = [];

    this.bullets = [];
    this.impacts = [];
    this.freeBulletIndices = [];
    this.activeBulletIndices = [];

    DestroyGroup(this.collisionGroup);
    this.collisionGroup = CreateGroup();
  }

  private allocateBulletPool(): void {
    for (let i = 0; i < this.config.maxBullets; i++) {
      this.bullets[i] = {
        id: i,
        active: false,
        activeSlot: -1,
        owner: undefined,
        cardId: SpellCardId.RING_BURST,
        x: 0,
        y: 0,
        z: -2000,
        startX: 0,
        startY: 0,
        vx: 0,
        vy: 0,
        life: 0,
        elapsed: 0,
        radius: 0,
        damage: 0,
        maxDistanceSq: 0,
      };

      this.bulletFx[i] = EffectEx.create(this.config.bulletModel, 0, 0, -2000);
      this.bulletFx[i]?.setUniformScale(0.01);
      this.freeBulletIndices.push(i);
    }
  }

  private allocateImpactPool(): void {
    for (let i = 0; i < this.config.maxImpacts; i++) {
      this.impacts[i] = {
        active: false,
        life: 0,
        elapsed: 0,
      };
      this.impactFx[i] = EffectEx.create(this.config.impactModel, 0, 0, -2000);
      this.impactFx[i]?.setUniformScale(0.01);
    }
  }

  private update(delta: number): void {
    this.updateEmitters(delta);
    this.updateBullets(delta);
    this.updateImpacts(delta);

    this.updateTick++;
    if (this.updateTick % this.config.collisionTickStride === 0) {
      this.updateCollisions();
    }
  }

  private updateEmitters(delta: number): void {
    for (const id in this.emitters) {
      const emitter = this.emitters[id];
      if (!emitter || !emitter.active) continue;

      if (!this.isUnitAlive(emitter.caster)) {
        delete this.emitters[id];
        continue;
      }

      emitter.elapsed += delta;
      emitter.emissionElapsed += delta;

      while (emitter.emissionElapsed >= emitter.emissionInterval) {
        emitter.emissionElapsed -= emitter.emissionInterval;
        this.emitByCard(emitter);
        emitter.wave++;
      }

      if (emitter.elapsed >= emitter.duration) {
        delete this.emitters[id];
      }
    }
  }

  private emitByCard(emitter: SpellCardEmitterState): void {
    const cx = GetUnitX(emitter.caster);
    const cy = GetUnitY(emitter.caster);

    if (emitter.cardId === SpellCardId.RING_BURST) {
      const count = 12;
      const step = (2 * math.pi) / count;
      emitter.phase += 0.17;
      for (let i = 0; i < count; i++) {
        const angle = emitter.phase + step * i;
        this.spawnBullet(
          emitter,
          cx,
          cy,
          math.cos(angle) * emitter.baseSpeed,
          math.sin(angle) * emitter.baseSpeed
        );
      }
      return;
    }

    if (emitter.cardId === SpellCardId.DUAL_SPIRAL) {
      emitter.phase += 0.26;
      const speed = emitter.baseSpeed * 0.95;
      const angleA = emitter.phase;
      const angleB = emitter.phase + math.pi;
      this.spawnBullet(emitter, cx, cy, math.cos(angleA) * speed, math.sin(angleA) * speed);
      this.spawnBullet(emitter, cx, cy, math.cos(angleB) * speed, math.sin(angleB) * speed);

      const sidePhase = emitter.phase + math.pi / 2;
      const sideSpeed = emitter.baseSpeed * 0.7;
      this.spawnBullet(emitter, cx, cy, math.cos(sidePhase) * sideSpeed, math.sin(sidePhase) * sideSpeed);
      this.spawnBullet(emitter, cx, cy, math.cos(sidePhase + math.pi) * sideSpeed, math.sin(sidePhase + math.pi) * sideSpeed);
      return;
    }

    if (emitter.cardId === SpellCardId.FAN_PULSE) {
      const fanCount = 10;
      const fanAngle = 1.5;
      emitter.phase += 0.21;
      const forward = emitter.phase;

      for (let i = 0; i < fanCount; i++) {
        const t = fanCount <= 1 ? 0 : i / (fanCount - 1);
        const angle = forward - fanAngle / 2 + fanAngle * t;
        const speed = emitter.baseSpeed * (0.75 + t * 0.45);
        this.spawnBullet(
          emitter,
          cx,
          cy,
          math.cos(angle) * speed,
          math.sin(angle) * speed
        );
      }
      return;
    }

    if (emitter.cardId === SpellCardId.ROSE_BLOOM) {
      const petalCount = 6;
      const step = (2 * math.pi) / petalCount;
      emitter.phase += 0.18;

      for (let i = 0; i < petalCount; i++) {
        const angle = emitter.phase + step * i;
        const speed = emitter.baseSpeed * (0.82 + 0.18 * math.sin(emitter.phase * 2));
        this.spawnBullet(
          emitter,
          cx,
          cy,
          math.cos(angle) * speed,
          math.sin(angle) * speed
        );
      }

      for (let i = 0; i < petalCount; i++) {
        const angle = emitter.phase + math.pi / petalCount + step * i;
        const speed = emitter.baseSpeed * 0.56;
        this.spawnBullet(
          emitter,
          cx,
          cy,
          math.cos(angle) * speed,
          math.sin(angle) * speed
        );
      }
      return;
    }

    if (emitter.cardId === SpellCardId.ECHO_FAN) {
      const fanCount = 8;
      const reverseCount = 5;
      const fanAngle = 1.18;
      const reverseAngle = 0.76;
      const waveSwing = emitter.wave % 4 >= 2 ? math.pi / 10 : 0;
      emitter.phase += 0.2;
      const forward = emitter.phase + waveSwing;
      const backward = forward + math.pi;

      for (let i = 0; i < fanCount; i++) {
        const t = fanCount <= 1 ? 0 : i / (fanCount - 1);
        const angle = forward - fanAngle / 2 + fanAngle * t;
        const speed = emitter.baseSpeed * (0.78 + t * 0.28);
        this.spawnBullet(
          emitter,
          cx,
          cy,
          math.cos(angle) * speed,
          math.sin(angle) * speed
        );
      }

      for (let i = 0; i < reverseCount; i++) {
        const t = reverseCount <= 1 ? 0 : i / (reverseCount - 1);
        const angle = backward - reverseAngle / 2 + reverseAngle * t;
        const speed = emitter.baseSpeed * (0.54 + t * 0.12);
        this.spawnBullet(
          emitter,
          cx,
          cy,
          math.cos(angle) * speed,
          math.sin(angle) * speed
        );
      }
      return;
    }

    if (emitter.cardId === SpellCardId.LATTICE_SPIN) {
      emitter.phase += 0.24;

      for (let i = 0; i < 4; i++) {
        const angle = emitter.phase + (math.pi / 2) * i;
        const speed = emitter.baseSpeed * 0.88;
        this.spawnBullet(
          emitter,
          cx,
          cy,
          math.cos(angle) * speed,
          math.sin(angle) * speed
        );
      }

      for (let i = 0; i < 4; i++) {
        const angle = emitter.phase * 1.45 + math.pi / 4 + (math.pi / 2) * i;
        const speed = emitter.baseSpeed * 0.66;
        this.spawnBullet(
          emitter,
          cx,
          cy,
          math.cos(angle) * speed,
          math.sin(angle) * speed
        );
      }
      return;
    }

    const count = 12;
    const step = (2 * math.pi) / count;
    emitter.phase += 0.17;
    for (let i = 0; i < count; i++) {
      const angle = emitter.phase + step * i;
      this.spawnBullet(
        emitter,
        cx,
        cy,
        math.cos(angle) * emitter.baseSpeed,
        math.sin(angle) * emitter.baseSpeed
      );
    }
  }

  private spawnBullet(
    emitter: SpellCardEmitterState,
    x: number,
    y: number,
    vx: number,
    vy: number
  ): void {
    const idx = this.freeBulletIndices.pop();
    if (idx === undefined) {
      this.totalDropped++;
      return;
    }

    const bullet = this.bullets[idx];
    bullet.active = true;
    bullet.owner = emitter.caster;
    bullet.cardId = emitter.cardId;
    bullet.x = x;
    bullet.y = y;
    bullet.z = 85;
    bullet.startX = x;
    bullet.startY = y;
    bullet.vx = vx;
    bullet.vy = vy;
    bullet.life = emitter.bulletLife;
    bullet.elapsed = 0;
    bullet.radius = emitter.bulletRadius;
    bullet.damage = emitter.bulletDamage;
    bullet.maxDistanceSq = emitter.maxDistance * emitter.maxDistance;

    bullet.activeSlot = this.activeBulletIndices.length;
    this.activeBulletIndices.push(idx);

    const fx = this.bulletFx[idx];
    if (fx) {
      fx.setUniformScale(0.9);
      fx.setSpeed(1);
      fx.setXYZ(x, y, bullet.z);
      fx.faceByRadians(Math.atan2(vy, vx));
    }

    this.totalSpawned++;
  }

  private updateBullets(delta: number): void {
    for (let i = this.activeBulletIndices.length - 1; i >= 0; i--) {
      const idx = this.activeBulletIndices[i];
      const bullet = this.bullets[idx];
      if (!bullet.active) continue;

      bullet.elapsed += delta;
      bullet.x += bullet.vx * delta;
      bullet.y += bullet.vy * delta;

      const dx = bullet.x - bullet.startX;
      const dy = bullet.y - bullet.startY;
      const distSq = dx * dx + dy * dy;

      const fx = this.bulletFx[idx];
      if (fx) {
        fx.setXY(bullet.x, bullet.y);
      }

      if (bullet.elapsed >= bullet.life || distSq >= bullet.maxDistanceSq) {
        this.recycleBulletByIndex(idx);
      }
    }
  }

  private updateCollisions(): void {
    const activeCount = this.activeBulletIndices.length;
    if (activeCount <= 0) {
      this.collisionCursor = 0;
      return;
    }

    for (let check = 0; check < this.config.collisionChecksPerTick; check++) {
      if (this.activeBulletIndices.length <= 0) break;

      if (this.collisionCursor >= this.activeBulletIndices.length) {
        this.collisionCursor = 0;
      }

      const idx = this.activeBulletIndices[this.collisionCursor];
      this.collisionCursor++;
      const bullet = this.bullets[idx];
      if (!bullet.active || !bullet.owner) continue;

      if (this.checkBulletHit(bullet)) {
        this.recycleBulletByIndex(idx);
      }
    }
  }

  private checkBulletHit(bullet: BulletState): boolean {
    const owner = bullet.owner;
    if (!owner || !this.isUnitAlive(owner)) {
      return false;
    }

    GroupEnumUnitsInRange(this.collisionGroup, bullet.x, bullet.y, bullet.radius, null);

    let u = FirstOfGroup(this.collisionGroup);
    while (u != null) {
      GroupRemoveUnit(this.collisionGroup, u);

      if (
        this.isUnitAlive(u) &&
        this.isPlayablePlayerUnit(u) &&
        IsUnitEnemy(u, GetOwningPlayer(owner))
      ) {
        UnitDamageTarget(
          owner,
          u,
          bullet.damage,
          true,
          false,
          ATTACK_TYPE_MAGIC(),
          DAMAGE_TYPE_NORMAL(),
          WEAPON_TYPE_WHOKNOWS()
        );

        this.spawnImpact(bullet.cardId, bullet.x, bullet.y, bullet.z);
        this.totalHit++;
        return true;
      }

      u = FirstOfGroup(this.collisionGroup);
    }

    return false;
  }

  private updateImpacts(delta: number): void {
    for (let i = 0; i < this.impacts.length; i++) {
      const impact = this.impacts[i];
      if (!impact.active) continue;

      impact.elapsed += delta;
      if (impact.elapsed >= impact.life) {
        impact.active = false;
        impact.elapsed = 0;
        impact.life = 0;

        const fx = this.impactFx[i];
        fx?.setUniformScale(0.01);
        fx?.setZ(-2000);
      }
    }
  }

  private spawnImpact(cardId: SpellCardId, x: number, y: number, z: number): void {
    for (let i = 0; i < this.impacts.length; i++) {
      const impact = this.impacts[i];
      if (impact.active) continue;

      const fx = this.impactFx[i];
      if (!fx) return;

      impact.active = true;
      impact.elapsed = 0;

      if (cardId === SpellCardId.RING_BURST) {
        impact.life = 0.12;
        fx.setUniformScale(1.05).setSpeed(1.0).setXYZ(x, y, z + 10);
        return;
      }

      if (cardId === SpellCardId.DUAL_SPIRAL) {
        impact.life = 0.16;
        fx.setUniformScale(0.85).setSpeed(1.35).setXYZ(x, y, z + 25);
        return;
      }

      if (cardId === SpellCardId.FAN_PULSE) {
        impact.life = 0.2;
        fx.setUniformScale(1.2).setSpeed(0.8).setXYZ(x, y, z + 35);
        return;
      }

      if (cardId === SpellCardId.ROSE_BLOOM) {
        impact.life = 0.14;
        fx.setUniformScale(0.95).setSpeed(1.15).setXYZ(x, y, z + 18);
        return;
      }

      if (cardId === SpellCardId.ECHO_FAN) {
        impact.life = 0.18;
        fx.setUniformScale(1.1).setSpeed(1.05).setXYZ(x, y, z + 28);
        return;
      }

      if (cardId === SpellCardId.LATTICE_SPIN) {
        impact.life = 0.22;
        fx.setUniformScale(0.78).setSpeed(1.5).setXYZ(x, y, z + 22);
        return;
      }

      impact.life = 0.16;
      fx.setUniformScale(1).setSpeed(1).setXYZ(x, y, z + 20);
      return;
    }
  }

  private recycleBulletByIndex(idx: number): void {
    const bullet = this.bullets[idx];
    if (!bullet.active) return;

    const slot = bullet.activeSlot;
    const lastIndex = this.activeBulletIndices[this.activeBulletIndices.length - 1];

    if (slot >= 0 && slot < this.activeBulletIndices.length) {
      this.activeBulletIndices[slot] = lastIndex;
      this.bullets[lastIndex].activeSlot = slot;
      this.activeBulletIndices.pop();
    }

    bullet.active = false;
    bullet.activeSlot = -1;
    bullet.owner = undefined;

    this.freeBulletIndices.push(idx);

    const fx = this.bulletFx[idx];
    fx?.setUniformScale(0.01);
    fx?.setZ(-2000);

    this.totalRecycled++;

    if (this.collisionCursor > this.activeBulletIndices.length) {
      this.collisionCursor = this.activeBulletIndices.length;
    }
  }

  private isPlayablePlayerUnit(u: unit): boolean {
    const owner = GetOwningPlayer(u);
    const playerId = GetPlayerId(owner);
    return playerId >= 0 && playerId < PLAYABLE_PLAYER_SLOTS;
  }

  private isUnitAlive(u: unit): boolean {
    return !IsUnitType(u, UNIT_TYPE_DEAD()) && GetWidgetLife(u) > 0.405;
  }
}
