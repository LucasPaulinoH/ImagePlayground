export enum ArithmeticOperation {
  ADDITION,
  SUBTRACTION,
  MULTIPLICATION,
  DIVISION,
}

export enum LogicOperation {
  AND,
  OR,
  XOR,
}

export enum TransformationOperation {
  ROTATION,
  TRANSLATION,
  SCALE,
  HORIZONTAL_REFLECTION,
  VERTICAL_REFLECTION,
  X_SHEAR,
  Y_SHEAR,
}

export enum ZoomOperation {
  REPLICATION,
  INTERPOLATION,
  DELETION,
  MEAN_VALUE,
}

export enum ColorChannel {
  RED,
  GREEN,
  BLUE,
}

export enum RgbConversion {
  HSB,
  YUV,
  CMYK,
}

export enum PseudocoloringOperation {
  DENSITY_SLICING,
  REDISTRIBUTION,
}

export enum EnhancementOperation {
  INTERVAL,
  BINARY,
  REVERSE,
  LOG,
  SQUARE_ROOT,
  EXPONENTIAL,
  SQUARED,
}

export interface Interval {
  min: number;
  max: number;
}
