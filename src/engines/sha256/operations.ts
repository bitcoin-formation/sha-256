import { Gate } from '@/types/sha256';

// Opérations bit à bit avec traçage des portes logiques

export function rotr(value: number, bits: number): number {
  return ((value >>> bits) | (value << (32 - bits))) >>> 0;
}

export function shr(value: number, bits: number): number {
  return value >>> bits;
}

// Fonction pour tracer les changements de bits
export function getChangedBits(before: number, after: number): number[] {
  const changed: number[] = [];
  const xor = (before ^ after) >>> 0;
  
  for (let i = 0; i < 32; i++) {
    if ((xor & (1 << i)) !== 0) {
      changed.push(i);
    }
  }
  
  return changed;
}

// Σ0(x) = ROTR²(x) ⊕ ROTR¹³(x) ⊕ ROTR²²(x)
// Version pure (logique seule)
export function Sigma0(x: number): number {
  const rotr2 = rotr(x, 2);
  const rotr13 = rotr(x, 13);
  const rotr22 = rotr(x, 22);
  return (rotr2 ^ rotr13 ^ rotr22) >>> 0;
}

// Version avec gates (pour visualisation)
export function capsigma0(x: number): { result: number; gates: Gate[] } {
  const gates: Gate[] = [];
  
  const rotr2 = rotr(x, 2);
  const rotr13 = rotr(x, 13);
  const rotr22 = rotr(x, 22);
  
  gates.push({ type: 'ROTR', inputs: [x], output: rotr2, position: { x: 100, y: 100 } });
  gates.push({ type: 'ROTR', inputs: [x], output: rotr13, position: { x: 100, y: 200 } });
  gates.push({ type: 'ROTR', inputs: [x], output: rotr22, position: { x: 100, y: 300 } });
  
  const xor1 = (rotr2 ^ rotr13) >>> 0;
  gates.push({ type: 'XOR', inputs: [rotr2, rotr13], output: xor1, position: { x: 300, y: 150 } });
  
  const result = (xor1 ^ rotr22) >>> 0;
  gates.push({ type: 'XOR', inputs: [xor1, rotr22], output: result, position: { x: 500, y: 200 } });
  
  return { result, gates };
}

// Σ1(x) = ROTR⁶(x) ⊕ ROTR¹¹(x) ⊕ ROTR²⁵(x)
// Version pure (logique seule)
export function Sigma1(x: number): number {
  const rotr6 = rotr(x, 6);
  const rotr11 = rotr(x, 11);
  const rotr25 = rotr(x, 25);
  return (rotr6 ^ rotr11 ^ rotr25) >>> 0;
}

// Version avec gates (pour visualisation)
export function capsigma1(x: number): { result: number; gates: Gate[] } {
  const gates: Gate[] = [];
  
  const rotr6 = rotr(x, 6);
  const rotr11 = rotr(x, 11);
  const rotr25 = rotr(x, 25);
  
  gates.push({ type: 'ROTR', inputs: [x], output: rotr6, position: { x: 100, y: 100 } });
  gates.push({ type: 'ROTR', inputs: [x], output: rotr11, position: { x: 100, y: 200 } });
  gates.push({ type: 'ROTR', inputs: [x], output: rotr25, position: { x: 100, y: 300 } });
  
  const xor1 = (rotr6 ^ rotr11) >>> 0;
  gates.push({ type: 'XOR', inputs: [rotr6, rotr11], output: xor1, position: { x: 300, y: 150 } });
  
  const result = (xor1 ^ rotr25) >>> 0;
  gates.push({ type: 'XOR', inputs: [xor1, rotr25], output: result, position: { x: 500, y: 200 } });
  
  return { result, gates };
}

// σ0(x) = ROTR⁷(x) ⊕ ROTR¹⁸(x) ⊕ SHR³(x)
// Version pure (logique seule)
export function sigma0Pure(x: number): number {
  const rotr7 = rotr(x, 7);
  const rotr18 = rotr(x, 18);
  const shr3 = shr(x, 3);
  return (rotr7 ^ rotr18 ^ shr3) >>> 0;
}

// Version avec gates (pour visualisation)
export function sigma0(x: number): { result: number; gates: Gate[] } {
  const gates: Gate[] = [];
  
  const rotr7 = rotr(x, 7);
  const rotr18 = rotr(x, 18);
  const shr3 = shr(x, 3);
  
  gates.push({ type: 'ROTR', inputs: [x], output: rotr7, position: { x: 100, y: 100 } });
  gates.push({ type: 'ROTR', inputs: [x], output: rotr18, position: { x: 100, y: 200 } });
  gates.push({ type: 'SHR', inputs: [x], output: shr3, position: { x: 100, y: 300 } });
  
  const xor1 = (rotr7 ^ rotr18) >>> 0;
  gates.push({ type: 'XOR', inputs: [rotr7, rotr18], output: xor1, position: { x: 300, y: 150 } });
  
  const result = (xor1 ^ shr3) >>> 0;
  gates.push({ type: 'XOR', inputs: [xor1, shr3], output: result, position: { x: 500, y: 200 } });
  
  return { result, gates };
}

// σ1(x) = ROTR¹⁷(x) ⊕ ROTR¹⁹(x) ⊕ SHR¹⁰(x)
// Version pure (logique seule)
export function sigma1Pure(x: number): number {
  const rotr17 = rotr(x, 17);
  const rotr19 = rotr(x, 19);
  const shr10 = shr(x, 10);
  return (rotr17 ^ rotr19 ^ shr10) >>> 0;
}

// Version avec gates (pour visualisation)
export function sigma1(x: number): { result: number; gates: Gate[] } {
  const gates: Gate[] = [];
  
  const rotr17 = rotr(x, 17);
  const rotr19 = rotr(x, 19);
  const shr10 = shr(x, 10);
  
  gates.push({ type: 'ROTR', inputs: [x], output: rotr17, position: { x: 100, y: 100 } });
  gates.push({ type: 'ROTR', inputs: [x], output: rotr19, position: { x: 100, y: 200 } });
  gates.push({ type: 'SHR', inputs: [x], output: shr10, position: { x: 100, y: 300 } });
  
  const xor1 = (rotr17 ^ rotr19) >>> 0;
  gates.push({ type: 'XOR', inputs: [rotr17, rotr19], output: xor1, position: { x: 300, y: 150 } });
  
  const result = (xor1 ^ shr10) >>> 0;
  gates.push({ type: 'XOR', inputs: [xor1, shr10], output: result, position: { x: 500, y: 200 } });
  
  return { result, gates };
}

// Ch(x,y,z) = (x ∧ y) ⊕ (¬x ∧ z)
// Version pure (logique seule)
export function chPure(x: number, y: number, z: number): number {
  const and1 = (x & y) >>> 0;
  const notX = (~x) >>> 0;
  const and2 = (notX & z) >>> 0;
  return (and1 ^ and2) >>> 0;
}

// Version avec gates (pour visualisation)
export function ch(x: number, y: number, z: number): { result: number; gates: Gate[] } {
  const gates: Gate[] = [];
  
  const and1 = (x & y) >>> 0;
  gates.push({ type: 'AND', inputs: [x, y], output: and1, position: { x: 200, y: 100 } });
  
  const notX = (~x) >>> 0;
  gates.push({ type: 'NOT', inputs: [x], output: notX, position: { x: 100, y: 200 } });
  
  const and2 = (notX & z) >>> 0;
  gates.push({ type: 'AND', inputs: [notX, z], output: and2, position: { x: 200, y: 250 } });
  
  const result = (and1 ^ and2) >>> 0;
  gates.push({ type: 'XOR', inputs: [and1, and2], output: result, position: { x: 400, y: 175 } });
  
  return { result, gates };
}

// Maj(x,y,z) = (x ∧ y) ⊕ (x ∧ z) ⊕ (y ∧ z)
// Version pure (logique seule)
export function majPure(x: number, y: number, z: number): number {
  const and1 = (x & y) >>> 0;
  const and2 = (x & z) >>> 0;
  const and3 = (y & z) >>> 0;
  return (and1 ^ and2 ^ and3) >>> 0;
}

// Version avec gates (pour visualisation)
export function maj(x: number, y: number, z: number): { result: number; gates: Gate[] } {
  const gates: Gate[] = [];
  
  const and1 = (x & y) >>> 0;
  gates.push({ type: 'AND', inputs: [x, y], output: and1, position: { x: 200, y: 100 } });
  
  const and2 = (x & z) >>> 0;
  gates.push({ type: 'AND', inputs: [x, z], output: and2, position: { x: 200, y: 200 } });
  
  const and3 = (y & z) >>> 0;
  gates.push({ type: 'AND', inputs: [y, z], output: and3, position: { x: 200, y: 300 } });
  
  const xor1 = (and1 ^ and2) >>> 0;
  gates.push({ type: 'XOR', inputs: [and1, and2], output: xor1, position: { x: 400, y: 150 } });
  
  const result = (xor1 ^ and3) >>> 0;
  gates.push({ type: 'XOR', inputs: [xor1, and3], output: result, position: { x: 600, y: 200 } });
  
  return { result, gates };
}

// Addition modulo 2^32
export function add(...values: number[]): number {
  let sum = 0;
  for (const value of values) {
    sum = (sum + value) >>> 0;
  }
  return sum;
}

