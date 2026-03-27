import { BOSS_FIRING_CONFIG, BOSS_HEALTH_CONFIG, CHAR_UPGRADE_HP_1, CHAR_UPGRADE_HP_2, CHAR_UPGRADE_HP_3, CHAR_UPGRADE_HP_4 } from './constants';

// Helper function to calculate player stage based on current HP and MAX HP
export const getPlayerStage = (count: number): number => {
  if (count <= CHAR_UPGRADE_HP_1) return 0;
  if (count <= CHAR_UPGRADE_HP_2) return 1;
  if (count <= CHAR_UPGRADE_HP_3) return 2;
  if (count <= CHAR_UPGRADE_HP_4) return 3;
  return 4;
};

export const ANIMALS = ['fluffy puppy', 'cute bear', 'white rabbit', 'orange fox', 'chubby panda'];
export const ITEMS = ['glowing banana', 'shiny star', 'magic shield', 'red heart', 'lightning bolt'];

// --- Gate Health Constants ---
export const GATE_HEALTH_BASE = {
  MULT: 10,
  ADD: 5,
  SUB: 5,
  DIV: 0.8,
  SPECIAL: 20,
  DEFAULT: 10
};
export const GATE_HEALTH_STAGE_MULTIPLIER = 0.3; // 20% increase per stage

// --- Helper Functions ---
export const getHitsNeeded = (type: string, value: number, playerCount: number, stage: number = 1) => {
  const stageMultiplier = 1 + (stage - 1) * GATE_HEALTH_STAGE_MULTIPLIER;
  let baseHits = GATE_HEALTH_BASE.DEFAULT;
  
  if (type === 'MULT') baseHits = Math.max(1, Math.floor(playerCount * GATE_HEALTH_BASE.MULT));
  else if (type === 'ADD') baseHits = Math.max(10, Math.floor(Math.pow(value, 2) * GATE_HEALTH_BASE.ADD));
  else if (type === 'SUB') baseHits = Math.max(10, Math.floor(Math.pow(value, 2) * GATE_HEALTH_BASE.SUB));
  else if (type === 'DIV') baseHits = Math.max(20, Math.floor(playerCount * GATE_HEALTH_BASE.DIV));
  else if (type === 'TIME_WARP' || type === 'ELEMENT_INFUSION' || type === 'SHIELD_GENERATOR' || type === 'SPLIT') {
    baseHits = Math.max(GATE_HEALTH_BASE.SPECIAL, Math.floor(playerCount * 2));
  }
  
  return Math.floor(baseHits * stageMultiplier);
};

export function getFormationOffsets(count: number, spacing: number) {
  if (count <= 0) return [];
  const offsets = [];
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  
  const startX = -((cols - 1) * spacing) / 2;
  const startY = -((rows - 1) * spacing) / 2;
  
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    offsets.push({
      x: startX + c * spacing,
      y: startY + r * spacing
    });
  }
  return offsets;
}

export const BOSSES = [
  { name: 'Inferno King', effect: 'FIRE', image: '/src/assets/bosses/inferno_king.png', prompt: 'A spherical fire boss with a golden crown, glowing magma cracks, intense heat, launching fireballs, 3D render, octane render, high detail, volumetric lighting, cinematic.', bg: '#FBE9E7', grid: '#FFAB91', ...BOSS_FIRING_CONFIG.INFERNO_KING, hp: BOSS_HEALTH_CONFIG.INFERNO_KING },
  { name: 'Ice Monarch', effect: 'ICE', image: '/src/assets/bosses/ice_monarch.png', prompt: 'A spherical ice boss with sharp snowflake patterns, translucent crystalline texture, freezing aura, firing ice shards, 3D render, octane render, high detail, cinematic.', bg: '#E0F7FA', grid: '#80DEEA', ...BOSS_FIRING_CONFIG.ICE_MONARCH, hp: BOSS_HEALTH_CONFIG.ICE_MONARCH },
  { name: 'Vortex Bringer', effect: 'WATERFALL', image: '/src/assets/bosses/vortex_bringer.png', prompt: 'A spherical water boss with swirling vortex patterns, liquid dynamics, splashing droplets, deluge of water, 3D render, octane render, high detail, cinematic.', bg: '#E3F2FD', grid: '#90CAF9', ...BOSS_FIRING_CONFIG.VORTEX_BRINGER, hp: BOSS_HEALTH_CONFIG.VORTEX_BRINGER },
  { name: 'Thunder Dragon', effect: 'THUNDER', image: '/src/assets/bosses/thunder_dragon.png', prompt: 'A spherical dragon-themed boss with glowing green eyes, crackling lightning aura, summoning lightning, 3D render, octane render, high detail, cinematic.', bg: '#ECEFF1', grid: '#90A4AE', ...BOSS_FIRING_CONFIG.THUNDER_DRAGON, hp: BOSS_HEALTH_CONFIG.THUNDER_DRAGON },
  { name: 'Toxic Cloud', effect: 'POISON', image: '/src/assets/bosses/toxic_cloud.png', prompt: 'A spherical poison boss surrounded by toxic clouds and potion bottles, swirling green gas, releasing toxic gas, 3D render, octane render, high detail, cinematic.', bg: '#F1F8E9', grid: '#C5E1A5', ...BOSS_FIRING_CONFIG.TOXIC_CLOUD, hp: BOSS_HEALTH_CONFIG.TOXIC_CLOUD },
  { name: 'Acid Stalker', effect: 'POISON', image: '/src/assets/bosses/acid_stalker.png', prompt: 'A spherical acid boss with insectoid features, dripping green acid, shooting acid drops, 3D render, octane render, high detail, cinematic.', bg: '#F1F8E9', grid: '#C5E1A5', ...BOSS_FIRING_CONFIG.ACID_STALKER, hp: BOSS_HEALTH_CONFIG.ACID_STALKER },
  { name: 'Volt Spiker', effect: 'ELECTRIC', image: '/src/assets/bosses/volt_spiker.png', prompt: 'A spherical electric boss with radiating spikes, crackling electricity, firing electric spikes, 3D render, octane render, high detail, cinematic.', bg: '#FFFDE7', grid: '#FFF59D', ...BOSS_FIRING_CONFIG.VOLT_SPIKER, hp: BOSS_HEALTH_CONFIG.VOLT_SPIKER },
  { name: 'Rock Cracker', effect: 'EARTHQUAKE', image: '/src/assets/bosses/rock_cracker.png', prompt: 'A spherical rock boss with rocky texture and a drill, cracking the ground, 3D render, octane render, high detail, cinematic.', bg: '#EFEBE9', grid: '#BCAAA4', ...BOSS_FIRING_CONFIG.ROCK_CRACKER, hp: BOSS_HEALTH_CONFIG.ROCK_CRACKER },
  { name: 'Beam Sentinel', effect: 'LASER', image: '/src/assets/bosses/beam_sentinel.png', prompt: 'A spherical laser boss with a central camera lens focus, mechanical rings, firing laser beams, 3D render, octane render, high detail, cinematic.', bg: '#F3E5F5', grid: '#CE93D8', ...BOSS_FIRING_CONFIG.BEAM_SENTINEL, hp: BOSS_HEALTH_CONFIG.BEAM_SENTINEL },
  { name: 'Void Glitch', effect: 'ALL', image: '/src/assets/bosses/void_glitch.png', prompt: 'A spherical void boss with glitchy reality patches, dark matter, creating reality glitches, 3D render, octane render, high detail, cinematic.', bg: '#FAFAFA', grid: '#EEEEEE', ...BOSS_FIRING_CONFIG.VOID_GLITCH, hp: BOSS_HEALTH_CONFIG.VOID_GLITCH },
  { name: 'Void Entity', effect: 'ALL', image: '/src/assets/bosses/void_entity.png', prompt: 'A spherical void entity with purple glitchy patches, dark matter, creating reality glitches, 3D render, octane render, high detail, cinematic.', bg: '#FAFAFA', grid: '#EEEEEE', ...BOSS_FIRING_CONFIG.VOID_ENTITY, hp: BOSS_HEALTH_CONFIG.VOID_ENTITY },
  { name: 'Ancient Core', effect: 'LASER', image: '/src/assets/bosses/ancient_core.png', prompt: 'A spherical ancient mechanical boss, made of rusty bronze and copper gears, intricate clockwork mechanisms, central keyhole, 3D render, octane render, high detail, cinematic.', bg: '#FFF3E0', grid: '#FFCC80', ...BOSS_FIRING_CONFIG.ANCIENT_CORE, hp: BOSS_HEALTH_CONFIG.ANCIENT_CORE },
  { name: 'The Ultimate Void', effect: 'ALL', image: '/src/assets/bosses/void_entity.png', prompt: 'A massive, terrifying spherical void boss, the ultimate glitch in reality, multiple eyes, dark matter tentacles, reality-warping aura, 3D render, octane render, high detail, cinematic.', bg: '#000000', grid: '#333333', ...BOSS_FIRING_CONFIG.ULTIMATE_VOID, hp: BOSS_HEALTH_CONFIG.ULTIMATE_VOID }
];

export const STAGES = [
  { level: 1, boss: BOSSES[0], enemyTypes: ['NORMAL'], spawnRateBase: 450 },
  { level: 2, boss: BOSSES[1], enemyTypes: ['NORMAL', 'ICE'], spawnRateBase: 420 },
  { level: 3, boss: BOSSES[2], enemyTypes: ['NORMAL', 'WATER'], spawnRateBase: 390 },
  { level: 4, boss: BOSSES[3], enemyTypes: ['NORMAL', 'FIRE', 'ICE'], spawnRateBase: 360 },
  { level: 5, boss: BOSSES[4], enemyTypes: ['NORMAL', 'POISON'], spawnRateBase: 330 },
  { level: 6, boss: BOSSES[5], enemyTypes: ['NORMAL', 'POISON', 'FIRE'], spawnRateBase: 300 },
  { level: 7, boss: BOSSES[6], enemyTypes: ['NORMAL', 'BOMB', 'ARCHER'], spawnRateBase: 270 },
  { level: 8, boss: BOSSES[7], enemyTypes: ['NORMAL', 'ARCHER', 'FIRE'], spawnRateBase: 240 },
  { level: 9, boss: BOSSES[8], enemyTypes: ['NORMAL', 'BOMB', 'ICE'], spawnRateBase: 210 },
  { level: 10, boss: BOSSES[9], enemyTypes: ['NORMAL', 'BOMB', 'ARCHER', 'POISON'], spawnRateBase: 180 },
  { level: 11, boss: BOSSES[10], enemyTypes: ['NORMAL', 'FIRE', 'ICE', 'POISON', 'BOMB', 'ARCHER'], spawnRateBase: 150 },
  { level: 12, boss: BOSSES[11], enemyTypes: ['NORMAL', 'FIRE', 'ICE', 'POISON', 'BOMB', 'ARCHER'], spawnRateBase: 120 },
  { level: 13, boss: BOSSES[12], enemyTypes: ['NORMAL', 'FIRE', 'ICE', 'POISON', 'BOMB', 'ARCHER'], spawnRateBase: 100 }
];
