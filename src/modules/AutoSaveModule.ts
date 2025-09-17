import { IModule } from '../types';

/**
 * 自动保存模块
 * 展示如何创建可插拔的游戏模块
 */
export class AutoSaveModule implements IModule {
  public readonly name = 'AutoSaveModule';
  private _enabled = false;
  private saveTimer?: timer;
  private saveInterval = 60.0; // 60秒

  /**
   * 获取模块启用状态
   */
  public get enabled(): boolean {
    return this._enabled;
  }

  /**
   * 启用模块
   */
  public enable(): void {
    if (this._enabled) {
      print(`${this.name} is already enabled`);
      return;
    }

    print(`>>> Enabling ${this.name}...`);
    
    // 创建定时器
    this.saveTimer = CreateTimer();
    TimerStart(this.saveTimer, this.saveInterval, true, () => {
      this.performAutoSave();
    });

    this._enabled = true;
    print(`>>> ${this.name} enabled with interval ${this.saveInterval}s`);
  }

  /**
   * 禁用模块
   */
  public disable(): void {
    if (!this._enabled) {
      print(`${this.name} is already disabled`);
      return;
    }

    print(`>>> Disabling ${this.name}...`);

    // 销毁定时器
    if (this.saveTimer) {
      DestroyTimer(this.saveTimer);
      this.saveTimer = undefined;
    }

    this._enabled = false;
    print(`>>> ${this.name} disabled`);
  }

  /**
   * 设置保存间隔
   */
  public setSaveInterval(seconds: number): void {
    this.saveInterval = seconds;
    
    if (this._enabled && this.saveTimer) {
      // 重新启动定时器
      this.disable();
      this.enable();
    }
    
    print(`>>> Auto-save interval set to ${seconds}s`);
  }

  /**
   * 执行自动保存
   */
  private performAutoSave(): void {
    print('>>> Performing auto-save...');
    
    // 这里可以添加实际的保存逻辑
    // 例如：保存玩家数据、游戏状态等
    
    // 给所有玩家显示消息
    for (let i = 0; i < 12; i++) {
      const player = Player(i);
      DisplayTextToPlayer(player, 0, 0, "Game auto-saved");
    }
    
    print('>>> Auto-save completed');
  }
}