export type OperationType = 
  | 'sigma0' 
  | 'sigma1' 
  | 'capsigma0' 
  | 'capsigma1' 
  | 'ch' 
  | 'maj'
  | 'add'
  | 'prepare_schedule'
  | 'init'
  | 'finalize';

export type GateType = 'XOR' | 'AND' | 'OR' | 'NOT' | 'ROTR' | 'SHR' | 'ADD';

export interface Gate {
  type: GateType;
  inputs: number[];
  output: number;
  position: { x: number; y: number };
}

export interface SHA256State {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
  g: number;
  h: number;
}

export interface SHA256Step {
  round: number;
  operation: OperationType;
  stateBefore: SHA256State;
  stateAfter: SHA256State;
  gates: Gate[];
  description: string;
  codeLineNumber: number;
  intermediateValues: {
    [key: string]: number | string;
  };
  changedBits: number[]; // Indices des bits qui ont changé
}

export interface SHA256Config {
  rounds: number;
  messageSize: number; // en bits
  useNativeParams: boolean;
}

export interface AnimationState {
  isPlaying: boolean;
  currentStepIndex: number;
  speed: number; // ms par step
}

export type CircuitType = 'ASIC' | 'OPTIC';

