import React from 'react';
import { Play, RotateCcw, Loader2, X, Gamepad2, Skull, Target, Info, Home, ShoppingCart, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import cat1 from './assets/animals/cat/cat1.png';
import cat2 from './assets/animals/cat/cat2.png';
import cat3 from './assets/animals/cat/cat3.png';
import cat4 from './assets/animals/cat/cat4.png';
import cat5 from './assets/animals/cat/cat5.png';
import dog1 from './assets/animals/dog/dog1.png';
import dog2 from './assets/animals/dog/dog2.png';
import dog3 from './assets/animals/dog/dog3.png';
import dog4 from './assets/animals/dog/dog4.png';
import dog5 from './assets/animals/dog/dog5.png';
import rabbit1 from './assets/animals/rabbit/rabbit1.png';
import rabbit2 from './assets/animals/rabbit/rabbit2.png';
import rabbit3 from './assets/animals/rabbit/rabbit3.png';
import rabbit4 from './assets/animals/rabbit/rabbit4.png';
import rabbit5 from './assets/animals/rabbit/rabbit5.png';
import rat1 from './assets/animals/rat/rat1.png';
import rat2 from './assets/animals/rat/rat2.png';
import rat3 from './assets/animals/rat/rat3.png';
import rat4 from './assets/animals/rat/rat4.png';
import rat5 from './assets/animals/rat/rat5.png';
import iceImg from './assets/enemies/ice.png';
import fireImg from './assets/enemies/fire.png';
import slimeImg from './assets/enemies/slime.png';
import poisonImg from './assets/enemies/poison.png';
import bombImg from './assets/enemies/bomb.png';
import fireBulletImg from './assets/bullets/fire_bullet.png';
import iceBulletImg from './assets/bullets/ice_bullet.png';
import poisonBulletImg from './assets/bullets/poison_bullet.png';
import electricBulletImg from './assets/bullets/electric_bullet.png';
import laserBulletImg from './assets/bullets/laser_bullet.png';
import bossFireBulletImg from './assets/boss_bullets/fire_bullet.png';
import bossIceBulletImg from './assets/boss_bullets/ice_bullet.png';
import bossPoisonBulletImg from './assets/boss_bullets/poison_bullet.png';
import bossElectricBulletImg from './assets/boss_bullets/electric_bullet.png';
import bossLaserBulletImg from './assets/boss_bullets/laser_bullet.png';
import coinImg from './assets/items/coin.png';
import blackBombImg from './assets/items/black_bomb.png';
import feverImg from './assets/items/fever.png';
import heartImg from './assets/items/heart.png';
import magnetImg from './assets/items/magnet.png';
import critImg from './assets/items/crit.png';
import criticalBulletImg from './assets/critical-bullet.png';
import shieldImg from './assets/items/shield.png';
import droneImg from './assets/items/drone.png';
import droneItemImg from './assets/items/drone_item.png';
export { droneImg, droneItemImg };
import fireAmmoImg from './assets/items/fire_ammo.png';
import freezeImg from './assets/items/freeze.png';
import poisonAmmoImg from './assets/items/poison_ammo.png';
import homingAmmoImg from './assets/items/homing_ammo.png';
import iceAmmoImg from './assets/items/ice_ammo.png';

// Stage Backgrounds
import bg1 from './assets/background/bg1.png';
import bg2 from './assets/background/bg2.png';
import bg3 from './assets/background/bg3.png';
import bg4 from './assets/background/bg4.png';
import bg5 from './assets/background/bg5.png';
import bg6 from './assets/background/bg6.png';
import bg7 from './assets/background/bg7.png';
import bg8 from './assets/background/bg8.png';
import bg9 from './assets/background/bg9.png';
import bg10 from './assets/background/bg10.png';
import bg11 from './assets/background/bg11.png';
import bg12 from './assets/background/bg12.png';
import victoryPose from './assets/victory_pose.png';

// Boss Images
import acidStalkerImg from './assets/bosses/acid_stalker.png';
import ancientCoreImg from './assets/bosses/ancient_core.png';
import beamSentinelImg from './assets/bosses/beam_sentinel.png';
import iceMonarchImg from './assets/bosses/ice_monarch.png';
import infernoKingImg from './assets/bosses/inferno_king.png';
import rockCrackerImg from './assets/bosses/rock_cracker.png';
import thunderDragonImg from './assets/bosses/thunder_dragon.png';
import toxicCloudImg from './assets/bosses/toxic_cloud.png';
import voidEntityImg from './assets/bosses/void_entity.png';
import voidGlitchImg from './assets/bosses/void_glitch.png';
import voltSpikerImg from './assets/bosses/volt_spiker.png';
import vortexBringerImg from './assets/bosses/vortex_bringer.png';

export {
  cat1, cat2, cat3, cat4, cat5,
  dog1, dog2, dog3, dog4, dog5,
  rabbit1, rabbit2, rabbit3, rabbit4, rabbit5,
  rat1, rat2, rat3, rat4, rat5,
  iceImg, fireImg, slimeImg, poisonImg, bombImg,
  fireBulletImg, iceBulletImg, poisonBulletImg, electricBulletImg, laserBulletImg,
  bossFireBulletImg, bossIceBulletImg, bossPoisonBulletImg, bossElectricBulletImg, bossLaserBulletImg,
  coinImg, blackBombImg, feverImg, heartImg, magnetImg, critImg, criticalBulletImg, shieldImg,
  fireAmmoImg, freezeImg, poisonAmmoImg, homingAmmoImg, iceAmmoImg,
  bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, victoryPose,
  acidStalkerImg, ancientCoreImg, beamSentinelImg, iceMonarchImg, infernoKingImg, rockCrackerImg,
  thunderDragonImg, toxicCloudImg, voidEntityImg, voidGlitchImg, voltSpikerImg, vortexBringerImg
};

// --- Game Constants (상수 설정) ---
export const CANVAS_WIDTH = 400; // 캔버스 너비
export const CANVAS_HEIGHT = 700; // 캔버스 높이
export const CAT_SIZE = 102.375; // 캐릭터 시각적 크기
export const HITBOX_SCALE = 0.2; // 히트박스 크기 배율
export const PLAYER_CIRCLE_SCALE = 0.4; // 플레이어 원형 히트박스 크기 배율
export const PLAYER_IMAGE_SCALE = 0.4;  // 플레이어 이미지 표시 크기 배율
export const PLAYER_SPEED = 2; // 캐릭터 기본 이동 속도

// Bullet & Firing Constants (탄환 및 발사 관련 상수)
export const FIRE_RATE = 40;               // 기본 발사 간격 (프레임 단위, 낮을수록 빠름)
export const BULLET_SPEED = 6;             // 캐릭터 탄환 이동 속도
export const BULLET_SPAWN_OFFSET_Y = -3;    // 탄환 생성 시 Y축 오프셋 (캐릭터와의 거리 조절)
export const BULLET_MAX_SPREAD_RATIO = 0.5; // 화면 너비 대비 탄환 최대 확산 범위 비율
export const FIRING_CIRCLE_SCALE = 0.6;    // 발사 시 시각적 효과 원의 크기 배율

// Game Balance Modifiers (게임 밸런스 조정 관련 상수)
export const DRONE_BASE_FIRE_RATE = 15; // 드론 기본 발사 간격 (프레임 단위)
export const DRONE_ATTACK_SPEED_MULTIPLIER = 0.5; // 드론 공격 속도 배율 (1.0 = 기본, 0.5 = 50% 감소)
export const PLAYER_ATTACK_SPEED_MULTIPLIER = 1.3; // 캐릭터 공격 속도 배율 (1.0 = 기본, 1.3 = 30% 증가)
export const PLAYER_DAMAGE_MULTIPLIER = 1.0; // 캐릭터 데미지 배율 (1.0 = 기본, 0.8 = 20% 감소)
export const PLAYER_MIN_DAMAGE_HP_EQUIVALENT = 10; // 체력이 낮아져도 유지되는 최소 데미지 기준 HP

export const PIERCE_BASE_PROBABILITY = 0.1; // 관통 공격 시 기본 관통 확률 (10%)
export const PIERCE_PROBABILITY_PER_LEVEL = 0.1; // 관통 단계별 추가 확률 (10%)

export const PLAYER_MAX_HP = 200; // 캐릭터 최대 체력
export const CHAR_UPGRADE_HP_1 = 10; // 1단계 -> 2단계 업그레이드 체력
export const CHAR_UPGRADE_HP_2 = 50; // 2단계 -> 3단계 업그레이드 체력
export const CHAR_UPGRADE_HP_3 = 110; // 3단계 -> 4단계 업그레이드 체력
export const CHAR_UPGRADE_HP_4 = 180; // 4단계 -> 5단계 업그레이드 체력
export const BOSS_HP_MULTIPLIER = 3.0; // 보스 체력 배율
export const BOSS_BULLET_COUNT_MULTIPLIER = 0.3; // 보스 탄환 개수 배율 (1.0 = 기본, 0.5 = 50% 감소)
export const BULLET_POWER_MULTIPLIER = 0.3; // 캐릭터 탄환 공격력 배율
export const FEVER_SPEED_MULTIPLIER = 1.1; // 피버 모드 탄환 속도 배율
export const FEVER_COMBO_THRESHOLD = 30; // 피버 모드 발동 콤보 수
export const LEVEL_UP_ATTACK_SPEED_INCREASE = 0.05; // 공격 속도 레벨업 증가량 (5%)
export const LEVEL_UP_BULLET_SIZE_INCREASE = 0.05; // 탄환 크기 레벨업 증가량 (5%)
export const FEVER_DAMAGE_MULTIPLIER = 1.1; // 피버 모드 데미지 배율 (10% 증가)
export const FEVER_ATTACK_SPEED_MULTIPLIER = 1.1; // 피버 모드 공격 속도 배율 (10% 증가)
export const BOSS_DAMAGE_MULTIPLIER = 4.0; // 보스 공격력 배율
export const BULLET_COUNT_HP_THRESHOLD = 20; // HP당 탄환 증가 기준
export const MAX_DRONES = 8; // 최대 드론 수
export const MAX_SHIELDS = 3; // 최대 쉴드 수
export const MAX_BOMBS = 3; // 최대 폭탄 수
export const BULLET_DAMAGE_HP_SCALING = 1.0; // HP에 따른 데미지 배율

// [Player -> Enemy] Character Special Bullets (캐릭터 특수 탄환)
export const CHAR_FIRE_DURATION = 360; // 화염 상태이상 지속 시간 (프레임, 60프레임 = 1초)
export const CHAR_FIRE_TICK_RATE = 60; // 화염 데미지 발생 주기 (프레임)
export const CHAR_FIRE_TICK_DAMAGE = 50; // 화염 틱당 데미지

export const CHAR_POISON_DURATION = 900; // 독 상태이상 지속 시간 (프레임)
export const CHAR_POISON_TICK_RATE = 120; // 독 데미지 발생 주기 (프레임)
export const CHAR_POISON_TICK_DAMAGE = 30; // 독 틱당 데미지

export const CHAR_ICE_DURATION = 120; // 빙결 상태이상 지속 시간 (프레임)

// --- Skill Selection UI Constants (스킬 선택 UI 관련 상수) ---
export const SKILL_MODAL_BG = "bg-black/80"; // 스킬 선택 모달 배경색
export const SKILL_BUTTON_BG = "bg-slate-800"; // 스킬 버튼 배경색
export const SKILL_BUTTON_BORDER = "border-2 border-slate-600"; // 스킬 버튼 테두리
export const SKILL_BUTTON_HOVER = "hover:border-yellow-400 hover:bg-slate-700"; // 스킬 버튼 호버 효과
export const SKILL_TITLE_COLOR = "text-yellow-400"; // 스킬 제목 색상
export const SKILL_DESC_COLOR = "text-slate-300"; // 스킬 설명 색상

// Enemy & Environment Constants (적 및 환경 관련 상수)
export const ENEMY_FIRE_DURATION = 360; // 적 화염 상태이상 지속 시간 (프레임)
export const ENEMY_FIRE_TICK_RATE = 60; // 적 화염 데미지 발생 주기 (프레임)
export const ENEMY_FIRE_TICK_DAMAGE = 5; // 적 화염 틱당 플레이어 카운트 감소량

export const ENEMY_POISON_DURATION = 900; // 적 독 상태이상 지속 시간 (프레임)
export const ENEMY_POISON_TICK_RATE = 60; // 적 독 데미지 발생 주기 (프레임)
export const ENEMY_POISON_TICK_DAMAGE = 3; // 적 독 틱당 플레이어 카운트 감소량

export const ENEMY_ICE_DURATION = 120; // 적 빙결 상태이상 지속 시간 (프레임)
export const ENEMY_STUN_DURATION = 60; // 적 기절(전기/번개) 상태이상 지속 시간 (프레임)

export const ENEMY_BOMB_DAMAGE = 5; // 폭탄 적 폭발 시 플레이어 카운트 감소량

// Enemies & Environment
export const ENEMY_SPEED = 1.25; // 적 이동 속도
export const SCROLL_SPEED = 1.5; // 배경 스크롤 속도
export const SLIME_SIZE = 20; // 슬라임 크기

// Items (아이템 관련 상수)
export const ITEM_CIRCLE_SCALE = 1.0;   // 아이템 원형 히트박스 크기 배율
export const ITEM_IMAGE_SCALE = 1.0;    // 아이템 이미지 표시 크기 배율

// --- BOSS Constants (보스 관련 상수) ---
export const BOSS_CIRCLE_SCALE = 1.0;   // 보스 원형 히트박스 크기 배율
export const BOSS_IMAGE_SCALE = 1.2;    // 보스 이미지 표시 크기 배율
export const BOSS_REWARD_PROBABILITY = 0.2; // 보스 보상 아이템 드랍 확률
export const BOSS_MAX_REWARDS = 3;      // 보스 최대 보상 아이템 수

export const BOSS_FIRING_CONFIG = {
  INFERNO_KING:   { bulletCount: 1.5, bulletSpeed: 1.5 },
  ICE_MONARCH:    { bulletCount: 3.0, bulletSpeed: 2.0 },
  VORTEX_BRINGER: { bulletCount: 0.7, bulletSpeed: 1.2 },
  THUNDER_DRAGON: { bulletCount: 1.1, bulletSpeed: 1.2 },
  TOXIC_CLOUD:    { bulletCount: 1.0, bulletSpeed: 1.0 },
  ACID_STALKER:   { bulletCount: 1.0, bulletSpeed: 1.0 },
  VOLT_SPIKER:    { bulletCount: 1.2, bulletSpeed: 1.1 },
  ROCK_CRACKER:   { bulletCount: 0.8, bulletSpeed: 0.8 },
  BEAM_SENTINEL:  { bulletCount: 1.2, bulletSpeed: 1.3 },
  VOID_GLITCH:    { bulletCount: 1.0, bulletSpeed: 1.0 },
  VOID_ENTITY:    { bulletCount: 1.0, bulletSpeed: 1.0 },
  ANCIENT_CORE:   { bulletCount: 1.5, bulletSpeed: 1.5 },
  ULTIMATE_VOID:  { bulletCount: 2.5, bulletSpeed: 2.2 },
};

export const BOSS_HEALTH_CONFIG = {
  INFERNO_KING:   500 * BOSS_HP_MULTIPLIER,
  ICE_MONARCH:    1000 * BOSS_HP_MULTIPLIER,
  VORTEX_BRINGER: 1500 * BOSS_HP_MULTIPLIER,
  THUNDER_DRAGON: 2200 * BOSS_HP_MULTIPLIER,
  TOXIC_CLOUD:    3000 * BOSS_HP_MULTIPLIER,
  ACID_STALKER:   4000 * BOSS_HP_MULTIPLIER,
  VOLT_SPIKER:    5200 * BOSS_HP_MULTIPLIER,
  ROCK_CRACKER:   6500 * BOSS_HP_MULTIPLIER,
  BEAM_SENTINEL:  8000 * BOSS_HP_MULTIPLIER,
  VOID_GLITCH:    10000 * BOSS_HP_MULTIPLIER,
  VOID_ENTITY:    12000 * BOSS_HP_MULTIPLIER,
  ANCIENT_CORE:   15000 * BOSS_HP_MULTIPLIER,
  ULTIMATE_VOID:  30000 * BOSS_HP_MULTIPLIER,
};

export const STAGE_BACKGROUNDS = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, bg1];

// Fallback high-quality images for characters (since local ones are empty)
export const CAT_PLACEHOLDER = cat1; // 고양이 이미지 플레이스홀더
export const DOG_PLACEHOLDER = dog1; // 강아지 이미지 플레이스홀더
export const RABBIT_PLACEHOLDER = rabbit1; // 토끼 이미지 플레이스홀더
export const RAT_PLACEHOLDER = rat1; // 쥐 이미지 플레이스홀더
export const bossGalleryPngSrc = voidEntityImg; // Use internal image as fallback

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// Helper function to calculate player stage based on current HP and MAX HP
export const getPlayerStage = (count: number): number => {
  if (count <= CHAR_UPGRADE_HP_1) return 0;
  if (count <= CHAR_UPGRADE_HP_2) return 1;
  if (count <= CHAR_UPGRADE_HP_3) return 2;
  if (count <= CHAR_UPGRADE_HP_4) return 3;
  return 4;
};
export const ANIMALS = ['fluffy puppy', 'cute bear', 'white rabbit', 'orange fox', 'chubby panda'];
export const BOSSES = [
  { name: 'Inferno King', effect: 'FIRE', image: infernoKingImg, prompt: 'A spherical fire boss with a golden crown, glowing magma cracks, intense heat, launching fireballs, 3D render, octane render, high detail, volumetric lighting, cinematic.', bg: '#FBE9E7', grid: '#FFAB91', ...BOSS_FIRING_CONFIG.INFERNO_KING, hp: BOSS_HEALTH_CONFIG.INFERNO_KING },
  { name: 'Ice Monarch', effect: 'ICE', image: iceMonarchImg, prompt: 'A spherical ice boss with sharp snowflake patterns, translucent crystalline texture, freezing aura, firing ice shards, 3D render, octane render, high detail, cinematic.', bg: '#E0F7FA', grid: '#80DEEA', ...BOSS_FIRING_CONFIG.ICE_MONARCH, hp: BOSS_HEALTH_CONFIG.ICE_MONARCH },
  { name: 'Vortex Bringer', effect: 'WATERFALL', image: vortexBringerImg, prompt: 'A spherical water boss with swirling vortex patterns, liquid dynamics, splashing droplets, deluge of water, 3D render, octane render, high detail, cinematic.', bg: '#E3F2FD', grid: '#90CAF9', ...BOSS_FIRING_CONFIG.VORTEX_BRINGER, hp: BOSS_HEALTH_CONFIG.VORTEX_BRINGER },
  { name: 'Thunder Dragon', effect: 'THUNDER', image: thunderDragonImg, prompt: 'A spherical dragon-themed boss with glowing green eyes, crackling lightning aura, summoning lightning, 3D render, octane render, high detail, cinematic.', bg: '#ECEFF1', grid: '#90A4AE', ...BOSS_FIRING_CONFIG.THUNDER_DRAGON, hp: BOSS_HEALTH_CONFIG.THUNDER_DRAGON },
  { name: 'Toxic Cloud', effect: 'POISON', image: toxicCloudImg, prompt: 'A spherical poison boss surrounded by toxic clouds and potion bottles, swirling green gas, releasing toxic gas, 3D render, octane render, high detail, cinematic.', bg: '#F1F8E9', grid: '#C5E1A5', ...BOSS_FIRING_CONFIG.TOXIC_CLOUD, hp: BOSS_HEALTH_CONFIG.TOXIC_CLOUD },
  { name: 'Acid Stalker', effect: 'POISON', image: acidStalkerImg, prompt: 'A spherical acid boss with insectoid features, dripping green acid, shooting acid drops, 3D render, octane render, high detail, cinematic.', bg: '#F1F8E9', grid: '#C5E1A5', ...BOSS_FIRING_CONFIG.ACID_STALKER, hp: BOSS_HEALTH_CONFIG.ACID_STALKER },
  { name: 'Volt Spiker', effect: 'ELECTRIC', image: voltSpikerImg, prompt: 'A spherical electric boss with radiating spikes, crackling electricity, firing electric spikes, 3D render, octane render, high detail, cinematic.', bg: '#FFFDE7', grid: '#FFF59D', ...BOSS_FIRING_CONFIG.VOLT_SPIKER, hp: BOSS_HEALTH_CONFIG.VOLT_SPIKER },
  { name: 'Rock Cracker', effect: 'EARTHQUAKE', image: rockCrackerImg, prompt: 'A spherical rock boss with rocky texture and a drill, cracking the ground, 3D render, octane render, high detail, cinematic.', bg: '#EFEBE9', grid: '#BCAAA4', ...BOSS_FIRING_CONFIG.ROCK_CRACKER, hp: BOSS_HEALTH_CONFIG.ROCK_CRACKER },
  { name: 'Beam Sentinel', effect: 'LASER', image: beamSentinelImg, prompt: 'A spherical laser boss with a central camera lens focus, mechanical rings, firing laser beams, 3D render, octane render, high detail, cinematic.', bg: '#F3E5F5', grid: '#CE93D8', ...BOSS_FIRING_CONFIG.BEAM_SENTINEL, hp: BOSS_HEALTH_CONFIG.BEAM_SENTINEL },
  { name: 'Void Glitch', effect: 'ALL', image: voidGlitchImg, prompt: 'A spherical void boss with glitchy reality patches, dark matter, creating reality glitches, 3D render, octane render, high detail, cinematic.', bg: '#FAFAFA', grid: '#EEEEEE', ...BOSS_FIRING_CONFIG.VOID_GLITCH, hp: BOSS_HEALTH_CONFIG.VOID_GLITCH },
  { name: 'Void Entity', effect: 'ALL', image: voidEntityImg, prompt: 'A spherical void entity with purple glitchy patches, dark matter, creating reality glitches, 3D render, octane render, high detail, cinematic.', bg: '#FAFAFA', grid: '#EEEEEE', ...BOSS_FIRING_CONFIG.VOID_ENTITY, hp: BOSS_HEALTH_CONFIG.VOID_ENTITY },
  { name: 'Ancient Core', effect: 'LASER', image: ancientCoreImg, prompt: 'A spherical ancient mechanical boss, made of rusty bronze and copper gears, intricate clockwork mechanisms, central keyhole, 3D render, octane render, high detail, cinematic.', bg: '#FFF3E0', grid: '#FFCC80', ...BOSS_FIRING_CONFIG.ANCIENT_CORE, hp: BOSS_HEALTH_CONFIG.ANCIENT_CORE },
  { name: 'The Ultimate Void', effect: 'ALL', image: voidEntityImg, prompt: 'A massive, terrifying spherical void boss, the ultimate glitch in reality, multiple eyes, dark matter tentacles, reality-warping aura, 3D render, octane render, high detail, cinematic.', bg: '#000000', grid: '#333333', ...BOSS_FIRING_CONFIG.ULTIMATE_VOID, hp: BOSS_HEALTH_CONFIG.ULTIMATE_VOID }
];
export const ITEMS = ['glowing banana', 'shiny star', 'magic shield', 'red heart', 'lightning bolt'];

// --- Stage Configuration ---
export const STAGES = [
  { level: 1, boss: BOSSES[0], enemyTypes: ['NORMAL'], spawnRateBase: 450 },
  { level: 2, boss: BOSSES[1], enemyTypes: ['NORMAL', 'ICE'], spawnRateBase: 420 },
  { level: 3, boss: BOSSES[2], enemyTypes: ['NORMAL', 'POISON'], spawnRateBase: 390 },
  { level: 4, boss: BOSSES[3], enemyTypes: ['NORMAL', 'FIRE', 'ICE'], spawnRateBase: 360 },
  { level: 5, boss: BOSSES[4], enemyTypes: ['NORMAL', 'POISON'], spawnRateBase: 330 },
  { level: 6, boss: BOSSES[5], enemyTypes: ['NORMAL', 'POISON', 'FIRE'], spawnRateBase: 300 },
  { level: 7, boss: BOSSES[6], enemyTypes: ['NORMAL', 'BOMB', 'ARCHER'], spawnRateBase: 270 },
  { level: 8, boss: BOSSES[7], enemyTypes: ['NORMAL', 'ARCHER', 'FIRE'], spawnRateBase: 240 },
  { level: 9, boss: BOSSES[8], enemyTypes: ['NORMAL', 'BOMB', 'ICE'], spawnRateBase: 210 },
  { level: 10, boss: BOSSES[9], enemyTypes: ['NORMAL', 'BOMB', 'ARCHER', 'POISON'], spawnRateBase: 180 },
  { level: 11, boss: BOSSES[10], enemyTypes: ['NORMAL', 'FIRE', 'ICE', 'POISON', 'BOMB', 'ARCHER'], spawnRateBase: 150 },
  { level: 12, boss: BOSSES[11], enemyTypes: ['NORMAL', 'FIRE', 'ICE', 'POISON', 'BOMB', 'ARCHER'], spawnRateBase: 120 },
  { level: 13, boss: BOSSES[12], enemyTypes: ['NORMAL', 'FIRE', 'ICE', 'POISON', 'BOMB', 'ARCHER'], spawnRateBase: 100 },
];

// --- Roguelite Skill Constants ---
export const SKILL_SELECTION_COUNT_DEFAULT = 3;
export const SKILL_RARITY_WEIGHTS = {
  COMMON: 83,
  RARE: 15,
  EPIC: 5,
  LEGENDARY: 2
};

// Stage-specific skill selection count (higher stages offer more choices)
export const getStageSkillCount = (stage: number) => {
  if (stage >= 10) return 5;
  if (stage >= 5) return 4;
  return SKILL_SELECTION_COUNT_DEFAULT;
};

export const SKILL_RARITY_COLORS = {
  COMMON: 'bg-slate-600 text-slate-300',
  RARE: 'bg-blue-600 text-white',
  EPIC: 'bg-orange-600 text-white',
  LEGENDARY: 'bg-purple-600 text-white animate-pulse'
};

export const INITIAL_GAME_STATE: GameState = {
  status: 'START',
  score: 0,
  coins: 0,
  kills: 0,
  statsUpdated: false,
  players: [
    { id: 0, x: CANVAS_WIDTH / 3, y: CANVAS_HEIGHT - 150, count: 1, shield: 0, bombCount: 0, magnetTime: 0, fireTimer: 0, poisonTimer: 0, playerFreezeTimer: 0, critTimer: 0, ammoType: 'NORMAL', ammoTimer: 0, character: 'cat', isDead: false },
    { id: 1, x: (CANVAS_WIDTH / 3) * 2, y: CANVAS_HEIGHT - 150, count: 1, shield: 0, bombCount: 0, magnetTime: 0, fireTimer: 0, poisonTimer: 0, playerFreezeTimer: 0, critTimer: 0, ammoType: 'NORMAL', ammoTimer: 0, character: 'dog', isDead: false }
  ],
  playerCount: 2,
  selectedCharacters: ['cat', 'dog'],
  bullets: [],
  enemyBullets: [],
  enemies: [],
  gates: [],
  particles: [],
  floatingTexts: [],
  items: [],
  drones: [],
  spawnQueue: [],
  feverTime: 0,
  freezeTime: 0,
  combo: 0,
  comboTimer: 0,
  bossActive: false,
  bossDefeated: false,
  bossDefeatedTimer: 0,
  gameCleared: false,
  creditsTimer: 0,
  stage: 1,
  stageStartFrame: 0,
  frameCount: 0,
  lastEnemySpawn: 0,
  lastGateSpawn: 0,
  screenShake: 0,
  isPaused: false,
  squadSkills: {
    pierce: 0,
    multiShot: 0,
    attackSpeed: 0,
    damageUp: 0,
    bulletSize: 0,
    maxHp: 0,
    critChance: 0,
    shieldStart: 0,
    magnetRange: 0,
    feverDuration: 0,
    shieldDuration: 0,
    scoreMult: 0,
    ghostBullets: 0,
    vampiricBullets: 0,
    explosiveBullets: 0,
    speedySquad: 0,
  },
  skillOptions: [],
};

export const createParticles = (state: GameState, x: number, y: number, color: string, count: number) => {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    state.particles.push({
      id: Math.random(), x, y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 1, color
    });
  }
};

export const createFloatingText = (state: GameState, x: number, y: number, text: string, color: string, isWarning: boolean = false) => {
  state.floatingTexts.push({
    id: Math.random(), x, y, text, color, life: 1, isWarning
  });
};

export const vibrate = (pattern: number | number[]) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

export const loadLocalImage = (path: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (path.startsWith('http')) img.crossOrigin = "anonymous";
    img.onload = () => {
      console.log('Loaded:', path);
      resolve(img);
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
    img.src = path;
  });
};

export const removeBackground = (canvas: HTMLCanvasElement, fillWhite: boolean = false) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  
  const isBg = (r: number, g: number, b: number) => {
    const isWhite = r > 230 && g > 230 && b > 230;
    const isGreen = g > 150 && r < 150 && b < 150;
    const isGrey = Math.abs(r-g) < 15 && Math.abs(g-b) < 15 && r > 120 && r < 220;
    return isWhite || isGreen || isGrey;
  };

  for (let j = 0; j < d.length; j += 4) {
    const r = d[j], g = d[j+1], b = d[j+2];
    if (isBg(r, g, b)) {
      if (fillWhite) {
        d[j] = 220; d[j+1] = 220; d[j+2] = 220; d[j+3] = 200;
      } else {
        d[j+3] = 0;
      }
    } else {
      const x = (j/4) % w;
      const y = Math.floor((j/4) / w);
      if (x > 0 && x < w - 1 && y > 0 && y < h - 1) {
        let bgNeighbors = 0;
        const neighbors = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        for (const [nx, ny] of neighbors) {
          const nIdx = ((y + ny) * w + (x + nx)) * 4;
          if (isBg(d[nIdx], d[nIdx+1], d[nIdx+2])) bgNeighbors++;
        }
        if (bgNeighbors > 0) {
          if (fillWhite) {
            d[j] = 220; d[j+1] = 220; d[j+2] = 220; d[j+3] = 200;
          } else {
            d[j+3] = Math.max(0, d[j+3] * (1 - bgNeighbors * 0.2));
          }
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

export type SkillRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';

export type RogueliteSkill = {
  id: 'pierce' | 'multiShot' | 'attackSpeed' | 'damageUp' | 'bulletSize' | 'maxHp' | 'heal' | 'critChance' | 'shieldStart' | 'magnetRange' | 'feverDuration' | 'shieldDuration' | 'scoreMult' | 'ghostBullets' | 'vampiricBullets' | 'explosiveBullets' | 'speedySquad';
  name: string;
  description: string;
  icon: string;
  rarity: SkillRarity;
  value: number;
};

export type UpgradeConfig = {
  name: string;
  description: string;
  icon: string;
  baseCost: number;
  costScaling: number;
  maxLevel: number;
  levelPerValue: string;
};

export const UPGRADE_CONFIG: Record<string, UpgradeConfig> = {
  pierce: { name: 'Piercing Bullets', description: '+10% Pierce Chance', icon: '🏹', baseCost: 100, costScaling: 1.5, maxLevel: 5, levelPerValue: '+10% Pierce Chance' },
  multiShot: { name: 'Multi-Shot', description: '+1 Bullet', icon: '🎯', baseCost: 100, costScaling: 1.8, maxLevel: 3, levelPerValue: '+1 Bullet' },
  attackSpeed: { name: 'Attack Speed', description: '+5% Attack Speed', icon: '⚡', baseCost: 100, costScaling: 1.6, maxLevel: 10, levelPerValue: '+5%' },
  damageUp: { name: 'Damage Up', description: '+5% Damage', icon: '💥', baseCost: 100, costScaling: 1.6, maxLevel: 10, levelPerValue: '+5%' },
  bulletSize: { name: 'Giant Bullets', description: '+2% Bullet Size', icon: '🔮', baseCost: 100, costScaling: 1.5, maxLevel: 5, levelPerValue: '+2%' },
  maxHp: { name: 'Max HP Up', description: '+20 Max HP', icon: '❤️', baseCost: 200, costScaling: 1.4, maxLevel: 5, levelPerValue: '+20 HP' },
  critChance: { name: 'Critical Eye', description: '+1% Crit Chance', icon: '👁️', baseCost: 100, costScaling: 1.7, maxLevel: 5, levelPerValue: '+1%' },
  magnetRange: { name: 'Magnetism', description: '+5% Magnet Range', icon: '🧲', baseCost: 100, costScaling: 1.3, maxLevel: 5, levelPerValue: '+5%' },
  feverDuration: { name: 'Fever Master', description: '+1s Fever Duration', icon: '🔥', baseCost: 100, costScaling: 1.5, maxLevel: 5, levelPerValue: '+1s' },
  shieldDuration: { name: 'Shield Master', description: '+1 Shield per pickup', icon: '🛡️', baseCost: 100, costScaling: 1.5, maxLevel: 5, levelPerValue: '+1 Shield' },
  scoreMult: { name: 'Gold Rush', description: '+1% Score Gain', icon: '💰', baseCost: 100, costScaling: 2.0, maxLevel: 3, levelPerValue: '+1%' },
  vampiricBullets: { name: 'Vampiric Bullets', description: 'Heal 1% of damage', icon: '🧛', baseCost: 150, costScaling: 1.8, maxLevel: 3, levelPerValue: '+1%' },
  explosiveBullets: { name: 'Explosive Bullets', description: '5% Explosion Chance', icon: '🧨', baseCost: 150, costScaling: 1.8, maxLevel: 3, levelPerValue: '+5%' },
  speedySquad: { name: 'Speedy Squad', description: '+5% Movement Speed', icon: '🏃', baseCost: 100, costScaling: 1.4, maxLevel: 5, levelPerValue: '+5%' },
};

export const AVAILABLE_SKILLS: RogueliteSkill[] = [
  { id: 'pierce', name: 'Piercing Bullets', description: 'Bullets have a 10% chance to pierce through enemies.', icon: '🏹', rarity: 'COMMON', value: 1 },
  { id: 'multiShot', name: 'Multi-Shot', description: 'Fire +1 extra bullet per shot.', icon: '🎯', rarity: 'RARE', value: 1 },
  { id: 'attackSpeed', name: 'Attack Speed', description: 'Increase attack speed by 5%.', icon: '⚡', rarity: 'COMMON', value: 1 },
  { id: 'damageUp', name: 'Damage Up', description: 'Increase damage by 1%.', icon: '💥', rarity: 'COMMON', value: 1 },
  { id: 'bulletSize', name: 'Giant Bullets', description: 'Increase bullet size and hitbox by 5%.', icon: '🔮', rarity: 'COMMON', value: 5 },
  { id: 'maxHp', name: 'Max HP Up', description: 'Increase max HP by 20 and heal.', icon: '❤️', rarity: 'RARE', value: 20 },
  { id: 'heal', name: 'Squad Heal', description: 'Restore 20 HP to all players.', icon: '🩹', rarity: 'COMMON', value: 20 },
  { id: 'critChance', name: 'Critical Eye', description: 'Increase critical hit chance by 5%.', icon: '👁️', rarity: 'RARE', value: 5 },
  { id: 'shieldStart', name: 'Shield Starter', description: 'Start each stage with +1 shield.', icon: '🛡️', rarity: 'EPIC', value: 1 },
  { id: 'magnetRange', name: 'Magnetism', description: 'Increase magnet range by 10%.', icon: '🧲', rarity: 'COMMON', value: 10 },
  { id: 'ghostBullets', name: 'Ghost Bullets', description: 'Bullets pierce through +1 enemies. Attack speed +5%.', icon: '👻', rarity: 'EPIC', value: 1 },
  { id: 'multiShot', name: 'Barrage', description: 'Fire +2 extra bullets per shot.', icon: '🔥', rarity: 'LEGENDARY', value: 2 },
  { id: 'damageUp', name: 'God Strength', description: 'Increase damage by 5%.', icon: '🔱', rarity: 'LEGENDARY', value: 5 },
  { id: 'feverDuration', name: 'Fever Master', description: 'Increase fever duration by 2 seconds.', icon: '🔥', rarity: 'RARE', value: 120 },
  { id: 'shieldDuration', name: 'Shield Master', description: 'Get +1 extra shield per pickup.', icon: '🛡️', rarity: 'RARE', value: 1 },
  { id: 'scoreMult', name: 'Gold Rush', description: 'Increase score gain by 10%.', icon: '💰', rarity: 'LEGENDARY', value: 10 },
  { id: 'vampiricBullets', name: 'Vampiric Bullets', description: 'Heal 1% of damage dealt.', icon: '🧛', rarity: 'EPIC', value: 1 },
  { id: 'explosiveBullets', name: 'Explosive Bullets', description: '5% chance to explode on hit.', icon: '🧨', rarity: 'EPIC', value: 5 },
  { id: 'speedySquad', name: 'Speedy Squad', description: 'Increase movement speed by 5%.', icon: '🏃', rarity: 'RARE', value: 1 },
];

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirementType: 'kills' | 'stage' | 'coins' | 'score';
  requirementValue: number;
  reward: number;
};

export type Stats = {
  totalKills: number;
  totalCoins: number;
  totalScore: number;
  maxStage: number;
  claimedAchievements: string[];
};

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'kills_100', title: '슬라임 사냥꾼', description: '적 100마리 처치', icon: '⚔️', requirementType: 'kills', requirementValue: 100, reward: 50 },
  { id: 'kills_500', title: '학살자', description: '적 500마리 처치', icon: '💀', requirementType: 'kills', requirementValue: 500, reward: 200 },
  { id: 'stage_5', title: '모험의 시작', description: '스테이지 5 도달', icon: '🗺️', requirementType: 'stage', requirementValue: 5, reward: 100 },
  { id: 'stage_10', title: '베테랑 모험가', description: '스테이지 10 도달', icon: '🏆', requirementType: 'stage', requirementValue: 10, reward: 300 },
  { id: 'coins_1000', title: '부자', description: '누적 코인 1000개 획득', icon: '💰', requirementType: 'coins', requirementValue: 1000, reward: 150 },
  { id: 'score_10000', title: '고득점자', description: '누적 점수 10,000점 달성', icon: '✨', requirementType: 'score', requirementValue: 10000, reward: 200 },
];

export type GameState = {
  status: 'START' | 'PLAYING' | 'GAME_OVER' | 'SKILL_SELECTION';
  score: number;
  coins: number;
  kills: number;
  statsUpdated: boolean;
  squadSkills: {
    pierce: number;
    multiShot: number;
    attackSpeed: number;
    damageUp: number;
    bulletSize: number;
    maxHp: number;
    critChance: number;
    shieldStart: number;
    magnetRange: number;
    feverDuration: number;
    shieldDuration: number;
    scoreMult: number;
    ghostBullets: number;
    vampiricBullets: number;
    explosiveBullets: number;
    speedySquad: number;
  };
  skillOptions: RogueliteSkill[];
  players: Array<{
    id: number;
    x: number;
    y: number;
    count: number;
    shield: number;
    bombCount: number;
    magnetTime: number;
    fireTimer: number;
    poisonTimer: number;
    playerFreezeTimer: number;
    critTimer: number;
    ammoType: 'NORMAL' | 'FIRE' | 'POISON' | 'ICE' | 'HOMING';
    ammoTimer: number;
    character: string;
    isDead: boolean;
  }>;
  playerCount: number;
  selectedCharacters: string[];
  bullets: Array<{ x: number; y: number; vx?: number; vy?: number; damage: number; id: number; type: 'NORMAL' | 'FIRE' | 'POISON' | 'ICE' | 'HOMING'; isCrit: boolean; rabbitPierce?: boolean; pierceCount: number; hitEnemies: number[]; hitGates?: number[]; size: number }>;
  enemyBullets: Array<{ x: number; y: number; vx: number; vy: number; id: number; isBoss?: boolean; type?: 'FIRE' | 'ICE' | 'POISON' | 'ELECTRIC' | 'NORMAL' | 'ARROW' | 'BOMB' | 'WATER' | 'WATERFALL' | 'ROCK' | 'LASER' | 'STORM' | 'THUNDER' }>;
  enemies: Array<{ x: number; y: number; hp: number; maxHp: number; size: number; id: number; speed: number; type: 'NORMAL' | 'FIRE' | 'WATER' | 'ICE' | 'POISON' | 'BOMB' | 'ARCHER' | 'BOSS' | 'SLIME'; bossType?: string; effectType?: 'FIRE' | 'ICE' | 'POISON' | 'ELECTRIC' | 'WATERFALL' | 'WIND' | 'THUNDER' | 'EARTHQUAKE' | 'LASER' | 'STORM' | 'ALL'; currentEffect?: 'FIRE' | 'ICE' | 'POISON' | 'ELECTRIC' | 'WATERFALL' | 'WIND' | 'THUNDER' | 'EARTHQUAKE' | 'LASER' | 'STORM'; effectTimer?: number; hitFlash?: number; fireTimer?: number; poisonTimer?: number; freezeTimer?: number; spawnFrame?: number; phase2Announced?: boolean; phase3Announced?: boolean }>;
  gates: Array<{ x: number; y: number; width: number; height: number; type: 'ADD' | 'MULT' | 'SUB' | 'DIV' | 'FREEZE' | 'FIRE' | 'SHIELD' | 'DRONE'; value: number; id: number; hits: number; hitFlash?: number }>;
  particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string; id: number }>;
  floatingTexts: Array<{ x: number; y: number; text: string; life: number; color: string; id: number; isWarning?: boolean }>;
  items: Array<{ x: number; y: number; id: number; speed: number; type: 'FEVER' | 'BOMB' | 'DRONE' | 'SHIELD' | 'MAGNET' | 'FREEZE' | 'CRIT' | 'FIRE' | 'POISON_AMMO' | 'ICE_AMMO' | 'HOMING_AMMO' | 'COIN' | 'HEART' }>;
  drones: Array<{ angle: number; id: number }>;
  spawnQueue: Array<{ x: number; y: number; hp: number; maxHp: number; size: number; id: number; speed: number; type: 'NORMAL' | 'FIRE' | 'WATER' | 'ICE' | 'POISON' | 'BOMB' | 'ARCHER' | 'SLIME'; spawnFrame: number }>;
  feverTime: number;
  freezeTime: number;
  combo: number;
  comboTimer: number;
  bossActive: boolean;
  bossDefeated: boolean;
  bossDefeatedTimer: number;
  gameCleared: boolean;
  creditsTimer: number;
  stage: number;
  stageStartFrame: number;
  frameCount: number;
  lastEnemySpawn: number;
  lastGateSpawn: number;
  screenShake: number;
  isPaused: boolean;
};

export type GameAssets = {
  animal: HTMLImageElement | HTMLCanvasElement | null;
  characters: Record<string, HTMLImageElement[] | HTMLCanvasElement[]>;
  boss: HTMLImageElement | HTMLCanvasElement | null;
  bossImages: Map<string, HTMLImageElement | HTMLCanvasElement>;
  victoryPose: HTMLImageElement | null;
  items: Record<string, HTMLImageElement | HTMLCanvasElement | null>;
  bullets: Record<string, HTMLImageElement | HTMLCanvasElement | null>;
  bossBullets: Record<string, HTMLImageElement | HTMLCanvasElement | null>;
  enemies: Record<string, HTMLImageElement | HTMLCanvasElement | null>;
  backgrounds: (HTMLImageElement | null)[];
  names: { animal: string; boss: string; item: string };
};

// --- Gate Health Constants (게이트 체력 관련 상수) ---
export const GATE_HEALTH_BASE = {
  MULT: 8,
  ADD: 3,
  SUB: 3,
  DIV: 5,
  SPECIAL: 20,
  DEFAULT: 10
};
export const GATE_HEALTH_STAGE_MULTIPLIER = 0.25; // 스테이지당 체력 증가 배율 (25%)

export const DIV_GATE_WIDTH_RATIO = 0.8; // ÷2 게이트 너비 비율
export const DIV_GATE_REDUCTION_RATIO = 0.5; // ÷2 게이트 체력 감소 비율
export const GATE_SPAWN_INTERVAL = 562; // 게이트 생성 간격 (프레임)
export const GIANT_BULLET_BASE_SIZE = 5; // 자이언트 불릿 기본 크기
export const GIANT_BULLET_UPGRADE_SCALING = 0.05; // 자이언트 불릿 업그레이드 배율
export const HOMING_BULLET_BASE_SIZE = 4; // 유도 탄환 기본 크기

// --- Helper Functions ---
export const getHitsNeeded = (type: string, value: number, playerCount: number, stage: number = 1) => {
  const stageMultiplier = 1 + (stage - 1) * GATE_HEALTH_STAGE_MULTIPLIER;
  let baseHits = GATE_HEALTH_BASE.DEFAULT;
  
  if (type === 'MULT') baseHits = Math.max(1, Math.floor(playerCount * GATE_HEALTH_BASE.MULT));
  else if (type === 'ADD') baseHits = Math.max(10, Math.floor(Math.pow(value, 2) * GATE_HEALTH_BASE.ADD));
  else if (type === 'SUB') baseHits = Math.max(10, Math.floor(Math.pow(value, 2) * GATE_HEALTH_BASE.SUB));
  else if (type === 'DIV') {
    if (value === 2) {
      baseHits = playerCount * 3;
    } else if (value === 1.5) {
      baseHits = playerCount * 2;
    } else {
      baseHits = playerCount * 5;
    }
  }
  else if (type === 'FREEZE' || type === 'FIRE' || type === 'SHIELD' || type === 'DRONE') {
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
    const row = Math.floor(i / cols);
    const col = i % cols;
    offsets.push({ x: startX + col * spacing, y: startY + row * spacing });
  }
  return offsets;
}

export const drawImageCircle = (ctx: CanvasRenderingContext2D, img: HTMLImageElement | HTMLCanvasElement, x: number, y: number, radius: number, hitFlash: number = 0, circleScale: number = 1, imageScale: number = 1, mode: 'contain' | 'cover' = 'contain', isFever: boolean = false) => {
  const circleRadius = radius * circleScale;
  const imageRadius = radius * imageScale;
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.arc(0, 0, circleRadius, 0, Math.PI * 2);
  ctx.clip();
  
  const aspect = img.width / img.height;
  let w = imageRadius * 2;
  let h = imageRadius * 2;
  
  if (mode === 'cover') {
    if (aspect > 1) {
      w = imageRadius * 2 * aspect;
      h = imageRadius * 2;
    } else {
      w = imageRadius * 2;
      h = (imageRadius * 2) / aspect;
    }
  } else {
    // "Contain" logic: ensure the whole image fits inside the circle with a tiny margin
    const margin = 0.95;
    if (aspect > 1) {
      h = (imageRadius * 2 * margin) / aspect;
      w = imageRadius * 2 * margin;
    } else {
      w = (imageRadius * 2 * margin) * aspect;
      h = imageRadius * 2 * margin;
    }
  }
  
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  
  if (isFever) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fill();
  }
  
  if (hitFlash > 0) {
    ctx.fillStyle = `rgba(255, 255, 255, ${hitFlash / 5})`;
    ctx.fill();
  }

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.8)';
  ctx.stroke();
  ctx.restore();
};

export const drawCat = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  ctx.save();
  ctx.translate(x, y);
  
  // 3D Gradient for body
  const bodyGradient = ctx.createRadialGradient(-size * 0.3, -size * 0.3, size * 0.1, 0, 0, size);
  bodyGradient.addColorStop(0, '#FFD580'); // lighter orange
  bodyGradient.addColorStop(0.7, '#FFA500'); // base orange
  bodyGradient.addColorStop(1, '#CC8400'); // darker orange

  ctx.fillStyle = bodyGradient;
  ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI * 2); ctx.fill();
  
  // Ears
  ctx.fillStyle = '#FFA500';
  ctx.beginPath(); ctx.moveTo(-size * 0.8, -size * 0.5); ctx.lineTo(-size * 0.2, -size * 0.9); ctx.lineTo(-size * 0.9, -size * 1.2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(size * 0.8, -size * 0.5); ctx.lineTo(size * 0.2, -size * 0.9); ctx.lineTo(size * 0.9, -size * 1.2); ctx.fill();
  
  // Eyes
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.arc(-size * 0.3, -size * 0.1, size * 0.15, 0, Math.PI * 2); ctx.arc(size * 0.3, -size * 0.1, size * 0.15, 0, Math.PI * 2); ctx.fill();
  
  // Eye highlights
  ctx.fillStyle = '#FFF';
  ctx.beginPath(); ctx.arc(-size * 0.35, -size * 0.15, size * 0.05, 0, Math.PI * 2); ctx.arc(size * 0.25, -size * 0.15, size * 0.05, 0, Math.PI * 2); ctx.fill();

  // Mouth
  ctx.strokeStyle = '#000'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(-size * 0.15, size * 0.2, size * 0.15, 0, Math.PI); ctx.arc(size * 0.15, size * 0.2, size * 0.15, 0, Math.PI); ctx.stroke();
  
  // Shadow under the cat
  ctx.shadowColor = 'rgba(0,0,0,0.3)';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 3;
  ctx.restore();
};

export const drawMonster = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, hp: number, maxHp: number, hitFlash: number = 0, type: string = 'NORMAL', assets?: GameAssets) => {
  ctx.save();
  ctx.translate(x, y);
  
  const enemyImg = assets?.enemies[type.toLowerCase()];
  
  let auraColor = 'rgba(255, 0, 0, 0.8)'; // More intense red aura
  if (type === 'FIRE') auraColor = '#FF4500';
  else if (type === 'POISON') auraColor = '#22c55e';
  else if (type === 'ICE') auraColor = '#00FFFF';
  else if (type === 'WATER') auraColor = '#0000FF';
  else if (type === 'BOSS') auraColor = '#FF0000';
  else if (type === 'BOMB') auraColor = '#FF0000';
  else if (type === 'ARCHER') auraColor = '#FFA500';
  else if (type === 'SLIME' || type === 'NORMAL') auraColor = 'rgba(255, 0, 0, 1.0)';
  
  // Draw aura
  const time = Date.now() * 0.008; // Increased speed for more noticeable pulse
  const pulse = Math.sin(time) * 0.2 + 0.9; // 0.7 to 1.1
  const auraRadius = size * 1.6 * pulse;
  
  ctx.save();
  ctx.shadowBlur = 15; 
  ctx.shadowColor = auraColor;
  ctx.fillStyle = auraColor;
  ctx.globalAlpha = 0.6; 
  ctx.beginPath();
  ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  
  ctx.shadowBlur = 0; // Reset shadow

  if (enemyImg) {
    drawImageCircle(ctx, enemyImg, 0, 0, size, hitFlash, 1.0, 1.2, 'cover');
  } else {
    // ... existing procedural drawing ...
    let color1 = '#FF9E9E', color2 = '#FF6B6B', color3 = '#CC5555';
    let shape = 0; // 0: Slime, 1: Square, 2: Triangle, 3: Ghost, 4: Demon
    
    if (type === 'WATER') {
      color1 = '#9E9EFF'; color2 = '#6B6BFF'; color3 = '#5555CC';
      shape = 0;
    } else if (type === 'POISON') {
      color1 = '#B39DDB'; color2 = '#7E57C2'; color3 = '#5535B1';
      shape = 0;
    } else if (type === 'ICE') {
      color1 = '#E0F7FA'; color2 = '#80DEEA'; color3 = '#00ACC1';
      shape = 1;
    } else if (type === 'FIRE') {
      color1 = '#FFCE9E'; color2 = '#FFAA6B'; color3 = '#CC8855';
      shape = 4;
    } else if (type === 'BOMB') {
      color1 = '#555555'; color2 = '#333333'; color3 = '#111111';
      shape = 4;
    } else if (type === 'ARCHER') {
      color1 = '#D2B48C'; color2 = '#8B4513'; color3 = '#A0522D';
      shape = 2;
    } else if (type === 'BOSS') {
      color1 = '#FF0000'; color2 = '#AA0000'; color3 = '#550000';
      shape = 4;
    } else if (type === 'SLIME') {
      color1 = '#00FF00'; color2 = '#00CC00'; color3 = '#009900';
      shape = 0;
    }

    const gradient = ctx.createRadialGradient(-size * 0.3, -size * 0.3, size * 0.1, 0, 0, size);
    if (hitFlash > 0) {
      gradient.addColorStop(0, '#FFFFFF');
      gradient.addColorStop(0.7, '#FFCCCC');
      gradient.addColorStop(1, '#FF9999');
    } else {
      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.7, color2);
      gradient.addColorStop(1, color3);
    }

    ctx.fillStyle = gradient;
    
    if (shape === 0) {
      // Slime/Water
      ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI, true); ctx.bezierCurveTo(size, size * 0.5, -size, size * 0.5, -size, 0); ctx.fill();
    } else if (shape === 1) {
      // Robot/Square/Ice
      ctx.fillRect(-size, -size, size * 2, size * 2);
    } else if (shape === 2) {
      // Alien/Triangle/Archer
      ctx.beginPath(); ctx.moveTo(0, -size); ctx.lineTo(size, size); ctx.lineTo(-size, size); ctx.closePath(); ctx.fill();
    } else if (shape === 3) {
      // Ghost/Poison
      ctx.beginPath(); ctx.arc(0, -size * 0.2, size, Math.PI, 0); 
      ctx.lineTo(size, size); ctx.lineTo(size * 0.5, size * 0.6); ctx.lineTo(0, size); ctx.lineTo(-size * 0.5, size * 0.6); ctx.lineTo(-size, size); ctx.closePath(); ctx.fill();
    } else if (shape === 4) {
      // Demon/Fire/Bomb/Boss
      ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(-size * 0.5, -size * 0.8); ctx.lineTo(-size * 0.8, -size * 1.5); ctx.lineTo(-size * 0.2, -size * 0.9); ctx.fill();
      ctx.beginPath(); ctx.moveTo(size * 0.5, -size * 0.8); ctx.lineTo(size * 0.8, -size * 1.5); ctx.lineTo(size * 0.2, -size * 0.9); ctx.fill();
      if (type === 'BOMB') {
        ctx.fillStyle = '#FF0000';
        ctx.beginPath(); ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2); ctx.fill();
      }
    }
    
    // Eyes
    ctx.fillStyle = '#fff';
    if (shape === 1) {
      // Visor
      ctx.fillRect(-size * 0.6, -size * 0.4, size * 1.2, size * 0.3);
      ctx.fillStyle = '#FF0000';
      ctx.fillRect(-size * 0.4 + (Math.sin(Date.now() / 200) * size * 0.2), -size * 0.3, size * 0.4, size * 0.1);
    } else if (shape === 2) {
      // Single eye
      ctx.beginPath(); ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2); ctx.fill();
    } else {
      // Normal eyes
      ctx.beginPath(); ctx.arc(-size * 0.3, -size * 0.2, size * 0.2, 0, Math.PI * 2); ctx.arc(size * 0.3, -size * 0.2, size * 0.2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(-size * 0.3, -size * 0.2, size * 0.1, 0, Math.PI * 2); ctx.arc(size * 0.3, -size * 0.2, size * 0.1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#FFF';
      ctx.beginPath(); ctx.arc(-size * 0.35, -size * 0.25, size * 0.05, 0, Math.PI * 2); ctx.arc(size * 0.25, -size * 0.25, size * 0.05, 0, Math.PI * 2); ctx.fill();
      
      if (shape === 0 || shape === 4) {
        // Angry eyebrows
        ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-size * 0.6, -size * 0.5); ctx.lineTo(-size * 0.1, -size * 0.3); ctx.moveTo(size * 0.6, -size * 0.5); ctx.lineTo(size * 0.1, -size * 0.3); ctx.stroke();
      }
    }
  }

  // HP Text
  ctx.fillStyle = '#fff'; ctx.font = 'bold 14px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 2;
  ctx.fillText(Math.ceil(hp).toString(), 0, -size - 10);
  ctx.restore();
};

// --- Components ---
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-8 text-center z-[9999]">
          <h2 className="text-red-500 text-2xl font-bold mb-4">Something went wrong</h2>
          <pre className="bg-slate-900 p-4 rounded text-xs text-slate-300 max-w-full overflow-auto mb-4">
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold"
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Sound System ---
let audioCtx: AudioContext | null = null;
let bgmAudio: HTMLAudioElement | null = null;
const audioBuffers: Record<string, AudioBuffer> = {};

const loadAudio = async (name: string, url: string) => {
  if (!audioCtx) return;
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioBuffers[name] = audioBuffer;
  } catch (e) {
    console.error(`Failed to load audio: ${name}`, e);
  }
};

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    loadAudio('boss_destruction', '/boss_destruction.mp3');
    loadAudio('shoot', '/shoot.mp3');
    loadAudio('item_pickup', '/item_pickup.mp3');
    loadAudio('enemy_hit', '/enemy_hit.mp3');
    loadAudio('fever_mode', '/fever_mode.mp3');
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playBGM = () => {
  // BGM file not found, skipping
  return;
};

export const playSound = (type: 'shoot' | 'hit' | 'explosion' | 'powerup' | 'boss' | 'fever') => {
  if (!audioCtx) return;
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;

  let bufferName: string | null = null;
  if (type === 'boss' || type === 'explosion') {
    bufferName = 'boss_destruction';
  } else if (type === 'shoot') {
    bufferName = 'shoot';
  } else if (type === 'hit') {
    bufferName = 'enemy_hit';
  } else if (type === 'powerup') {
    bufferName = 'item_pickup';
  } else if (type === 'fever') {
    bufferName = 'fever_mode';
  }

  if (bufferName && audioBuffers[bufferName]) {
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffers[bufferName];
    
    const gain = audioCtx.createGain();
    let targetGain = 0.3;
    if (type === 'shoot' || type === 'hit') targetGain = 0.2;
    else if (type === 'explosion') targetGain = 0.4;
    else if (type === 'boss') targetGain = 0.6;
    else if (type === 'fever') targetGain = 0.5;
    else if (type === 'powerup') targetGain = 0.3;

    gain.gain.value = targetGain;

    source.connect(gain);
    gain.connect(audioCtx.destination);
    source.start(0);
    return; // Successfully played buffer
  }
  
  // Fallback to oscillator sounds if buffer not loaded
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  if (type === 'shoot') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'hit') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'explosion') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(10, now + 0.3);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'powerup' || type === 'fever') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(type === 'fever' ? 600 : 400, now);
    osc.frequency.linearRampToValueAtTime(type === 'fever' ? 1200 : 800, now + 0.2);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
    osc.start(now);
    osc.stop(now + 0.2);
  } else if (type === 'boss') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.5);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  }
};
