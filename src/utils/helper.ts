// 基础的id转换 - 热更新测试
export function c2i(char: string) {
  return string.unpack(">I4", char)[0] as number
}

export function i2c(id: number) {
  return string.pack(">I4", id)
}

export function FourCC(id: string) {
  return c2i(id)
}


/**
 * 世界坐标转屏幕坐标的配置选项
 */
export interface WorldToScreenOptions {
  /** 屏幕 X 偏移量（0-1 范围） */
  offsetScreenX?: number;
  /** 屏幕 Y 偏移量（0-1 范围） */
  offsetScreenY?: number;
}



/**
 * 世界坐标转屏幕坐标（基于 Antares 的 FastWorld2ScreenTransform，支持任意宽高比）
 * 
 * 在 worldToScreen 的基础上添加宽高比校正，确保在不同屏幕比例下都能正确工作
 * 
 * @param x 世界坐标 X
 * @param y 世界坐标 Y
 * @param z 世界坐标 Z（垂直高度）
 * @param options 可选的偏移配置
 * @returns 屏幕坐标 { screenX, screenY, onScreen }
 */
export function worldToScreen(
  x: number,
  y: number,
  z: number = 0,
  options: WorldToScreenOptions = {}
): { screenX: number, screenY: number, onScreen: boolean } {
  // 获取相机参数
  const eyeX = GetCameraEyePositionX();
  const eyeY = GetCameraEyePositionY();
  const eyeZ = GetCameraEyePositionZ();
  const angleOfAttack = GetCameraField(ConvertCameraField(2)); // CAMERA_FIELD_ANGLE_OF_ATTACK
  const rotation = GetCameraField(ConvertCameraField(5));      // CAMERA_FIELD_ROTATION
  const fieldOfView = GetCameraField(ConvertCameraField(3));   // CAMERA_FIELD_FIELD_OF_VIEW

  // 预计算三角函数
  const cosAttack = Math.cos(angleOfAttack);
  const sinAttack = Math.sin(angleOfAttack);
  const cosRot = Math.cos(rotation);
  const sinRot = Math.sin(rotation);

  // 经验公式（Antares 校准）
  const yCenterScreenShift = 0.1284 * cosAttack;
  const scaleFactor = 0.0524 * fieldOfView * fieldOfView * fieldOfView
    - 0.0283 * fieldOfView * fieldOfView
    + 1.061 * fieldOfView;

  // 矩阵元素预计算
  const cosAttackCosRot = cosAttack * cosRot;
  const cosAttackSinRot = cosAttack * sinRot;
  const sinAttackCosRot = sinAttack * cosRot;
  const sinAttackSinRot = sinAttack * sinRot;

  // 世界坐标到相机的向量
  const dx = x - eyeX;
  const dy = y - eyeY;
  const dz = z - eyeZ;

  // 核心变换公式
  const xPrime = scaleFactor * (-cosAttackCosRot * dx - cosAttackSinRot * dy - sinAttack * dz);

  // 获取屏幕宽高比并计算校正因子
  const clientWidth = DzGetWindowWidth();
  const clientHeight = DzGetWindowHeight();
  let aspectRatio = 4.0 / 3.0; // 默认 4:3
  if (clientHeight > 0) {
    aspectRatio = clientWidth / clientHeight;
  }

  // 宽高比校正因子（相对于 4:3 基准）
  // 当 aspectRatio = 4/3 时，correction = 1.0（无变化）
  // 当 aspectRatio > 4/3（更宽）时，correction < 1.0（X 轴缩小）
  // 当 aspectRatio < 4/3（更窄）时，correction > 1.0（X 轴放大）
  const baseAspectRatio = 4.0 / 3.0;
  const aspectRatioCorrection = baseAspectRatio / aspectRatio;

  // X 轴应用宽高比校正，Y 轴保持不变
  const screenX = 0.4 + ((cosRot * dy - sinRot * dx) / xPrime) * aspectRatioCorrection;
  const screenY = 0.42625 - yCenterScreenShift + (sinAttackCosRot * dx + sinAttackSinRot * dy - cosAttack * dz) / xPrime;

  // 屏幕可见性判断（边界可能需要根据宽高比调整，但先保持原样）
  const onScreen = xPrime < 0 && screenX > -0.1333 && screenX < 0.9333 && screenY > 0 && screenY < 0.6;

  // 应用偏移量
  const finalScreenX = screenX + (options.offsetScreenX || 0);
  const finalScreenY = screenY + (options.offsetScreenY || 0);

  return { screenX: finalScreenX, screenY: finalScreenY, onScreen };
}
