import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, RotateCcw, Loader2, X, Gamepad2, Skull, Target, Info, Home, ShoppingCart, Trophy, Bomb as BombIcon } from 'lucide-react';

import {
  CANVAS_WIDTH, CANVAS_HEIGHT, CAT_SIZE, HITBOX_SCALE, PLAYER_CIRCLE_SCALE, PLAYER_IMAGE_SCALE, PLAYER_SPEED,
  FIRE_RATE, BULLET_SPEED, BULLET_SPAWN_OFFSET_Y, BULLET_MAX_SPREAD_RATIO, FIRING_CIRCLE_SCALE,
  PLAYER_MAX_HP, CHAR_UPGRADE_HP_1, CHAR_UPGRADE_HP_2, CHAR_UPGRADE_HP_3, CHAR_UPGRADE_HP_4,
  BOSS_HP_MULTIPLIER, BOSS_BULLET_COUNT_MULTIPLIER, BULLET_POWER_MULTIPLIER, FEVER_SPEED_MULTIPLIER, FEVER_COMBO_THRESHOLD,
  LEVEL_UP_ATTACK_SPEED_INCREASE, LEVEL_UP_BULLET_SIZE_INCREASE, FEVER_DAMAGE_MULTIPLIER,
  FEVER_ATTACK_SPEED_MULTIPLIER, BOSS_DAMAGE_MULTIPLIER, BULLET_COUNT_HP_THRESHOLD, MAX_DRONES,
  MAX_SHIELDS, MAX_BOMBS,
  BULLET_DAMAGE_HP_SCALING, CHAR_FIRE_DURATION, CHAR_FIRE_TICK_RATE, CHAR_FIRE_TICK_DAMAGE,
  DRONE_BASE_FIRE_RATE, DRONE_ATTACK_SPEED_MULTIPLIER, PLAYER_ATTACK_SPEED_MULTIPLIER, PLAYER_DAMAGE_MULTIPLIER, PLAYER_MIN_DAMAGE_HP_EQUIVALENT,
  PIERCE_BASE_PROBABILITY, PIERCE_PROBABILITY_PER_LEVEL,
  CHAR_POISON_DURATION, CHAR_POISON_TICK_RATE, CHAR_POISON_TICK_DAMAGE, CHAR_ICE_DURATION,
  SKILL_MODAL_BG, SKILL_BUTTON_BG, SKILL_BUTTON_BORDER, SKILL_BUTTON_HOVER, SKILL_TITLE_COLOR,
  SKILL_DESC_COLOR, ENEMY_FIRE_DURATION, ENEMY_FIRE_TICK_RATE, ENEMY_FIRE_TICK_DAMAGE,
  ENEMY_POISON_DURATION, ENEMY_POISON_TICK_RATE, ENEMY_POISON_TICK_DAMAGE, ENEMY_ICE_DURATION,
  ENEMY_STUN_DURATION, ENEMY_BOMB_DAMAGE, ENEMY_SPEED, SCROLL_SPEED, SLIME_SIZE,
  ITEM_CIRCLE_SCALE, ITEM_IMAGE_SCALE, BOSS_CIRCLE_SCALE, BOSS_IMAGE_SCALE,
  BOSS_REWARD_PROBABILITY, BOSS_MAX_REWARDS, BOSS_FIRING_CONFIG, BOSS_HEALTH_CONFIG,
  STAGE_BACKGROUNDS, CAT_PLACEHOLDER, DOG_PLACEHOLDER, RABBIT_PLACEHOLDER, RAT_PLACEHOLDER,
  bossGalleryPngSrc, getPlayerStage, ANIMALS, BOSSES, ITEMS, STAGES,
  SKILL_SELECTION_COUNT_DEFAULT, SKILL_RARITY_WEIGHTS, getStageSkillCount, SKILL_RARITY_COLORS,
  AVAILABLE_SKILLS, GATE_HEALTH_BASE, GATE_HEALTH_STAGE_MULTIPLIER, DIV_GATE_WIDTH_RATIO, DIV_GATE_REDUCTION_RATIO, GATE_SPAWN_INTERVAL, GIANT_BULLET_BASE_SIZE, GIANT_BULLET_UPGRADE_SCALING, HOMING_BULLET_BASE_SIZE, getHitsNeeded, UPGRADE_CONFIG,
  Stats, ACHIEVEMENTS,
  getFormationOffsets, drawImageCircle, drawCat, drawMonster, ErrorBoundary,
  initAudio, playBGM, playSound, INITIAL_GAME_STATE, createParticles, createFloatingText,
  vibrate, loadLocalImage, removeBackground,
  cat1, cat2, cat3, cat4, cat5,
  dog1, dog2, dog3, dog4, dog5,
  rabbit1, rabbit2, rabbit3, rabbit4, rabbit5,
  rat1, rat2, rat3, rat4, rat5,
  iceImg, fireImg, slimeImg, poisonImg, bombImg,
  fireBulletImg, iceBulletImg, poisonBulletImg, electricBulletImg, laserBulletImg,
  bossFireBulletImg, bossIceBulletImg, bossPoisonBulletImg, bossElectricBulletImg, bossLaserBulletImg,
  coinImg, blackBombImg, feverImg, heartImg, magnetImg, critImg, criticalBulletImg, shieldImg,
  droneImg, droneOldImg,
  fireAmmoImg, freezeImg, poisonAmmoImg, homingAmmoImg, iceAmmoImg,
  bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10, bg11, bg12, victoryPose
} from './constants';

import type { SkillRarity, RogueliteSkill, GameState, GameAssets } from './constants';

const characterImageMap: Record<string, string> = {
  cat: cat1,
  dog: dog1,
  rabbit: rabbit1,
  rat: rat1,
};

export default function App() {
  const [showManual, setShowManual] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reactStateStatus, setReactStateStatus] = useState<'START' | 'GENERATING' | 'PLAYING' | 'GAME_OVER' | 'SKILL_SELECTION'>('START');
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const parsed = parseInt(localStorage.getItem('nano_banana_highscore') || '0');
    return isNaN(parsed) ? 0 : parsed;
  });
  const highScoreRef = useRef(highScore);
  useEffect(() => { highScoreRef.current = highScore; }, [highScore]);
  const [skillChoices, setSkillChoices] = useState<RogueliteSkill[]>([]);
  const [showShop, setShowShop] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [randomUpgrades, setRandomUpgrades] = useState<string[]>([]);

  const useBomb = useCallback((playerIndex: number) => {
    const state = gameState.current;
    const p = state.players[playerIndex];
    if (p && !p.isDead && p.bombCount > 0) {
      p.bombCount--;
      vibrate(200);
      playSound('explosion');
      state.screenShake = 20;
      state.enemyBullets = [];
      
      // Explosion effect
      createParticles(state, p.x, p.y, '#ff4500', 50);
      createFloatingText(state, p.x, p.y - 50, "BOMB!", "#ff4500", true);

      // Damage enemies in range
      const explosionRange = 250;
      state.enemies.forEach(e => {
        const dist = Math.hypot(e.x - p.x, e.y - p.y);
        if (dist < explosionRange) {
          const damage = 500 * (1 + (upgradesRef.current.damageUp || 0) * 0.1);
          e.hp -= damage;
          e.hitFlash = 10;
        }
      });
    }
  }, []);

  const buyUpgrade = (skillId: string) => {
    const config = UPGRADE_CONFIG[skillId];
    if (!config) return;

    const currentLevel = (upgrades as any)[skillId] || 0;
    if (currentLevel >= config.maxLevel) return;

    const cost = Math.floor(config.baseCost * Math.pow(config.costScaling, currentLevel));
    if (coins >= cost) {
      const newCoins = coins - cost;
      const newUpgrades = { ...upgrades, [skillId]: currentLevel + 1 };
      setCoins(newCoins);
      setUpgrades(newUpgrades);
      saveProgress(newCoins, newUpgrades, highScore);
    }
  };

  const resetCoins = () => {
    setCoins(0);
    saveProgress(0, upgrades, highScore);
  };

  const resetSkills = () => {
    setUpgrades({});
    saveProgress(coins, {}, highScore);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'm') {
        setShowManual(prev => !prev);
      }
      if (e.key.toLowerCase() === 'p') {
        if (gameState.current.status === 'PLAYING') {
          gameState.current.isPaused = !gameState.current.isPaused;
          setShowPause(gameState.current.isPaused);
        }
      }
      if (e.key.toLowerCase() === 'b' || e.code === 'Space') {
        if (gameState.current.status === 'PLAYING' && !gameState.current.isPaused) {
          useBomb(0);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (showShop) {
      const keys = Object.keys(UPGRADE_CONFIG);
      const shuffled = [...keys].sort(() => 0.5 - Math.random());
      setRandomUpgrades(shuffled.slice(0, 3));
    }
  }, [showShop]);

  const UpgradeShop = () => (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-4 z-50 text-white">
      <h2 className="text-3xl font-bold text-yellow-400 mb-4">Upgrade Shop</h2>
      <div className="text-xl mb-6">Coins: {isNaN(Number(gameState.current.coins)) ? 0 : gameState.current.coins}</div>
      
      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        {randomUpgrades.map(id => {
          const config = UPGRADE_CONFIG[id];
          const currentLevel = gameState.current.squadSkills[id as keyof typeof gameState.current.squadSkills] || 0;
          const isMax = currentLevel >= config.maxLevel;
          const cost = isMax ? 0 : Math.floor(config.baseCost * Math.pow(config.costScaling, currentLevel));
          
          return (
            <button
              key={id}
              disabled={isMax || gameState.current.coins < cost}
              onClick={() => buyUpgrade(id)}
              className={`p-4 rounded-lg border flex items-center gap-4 ${
                isMax || gameState.current.coins < cost ? 'bg-slate-800 border-slate-700 opacity-50' : 'bg-slate-700 border-slate-500 hover:border-yellow-400'
              }`}
            >
              <div className="text-4xl">{config.icon}</div>
              <div className="flex-1 text-left">
                <div className="font-bold">{config.name}</div>
                <div className="text-sm text-slate-300">{config.description}</div>
                <div className="text-sm text-yellow-400">
                  {isMax ? 'MAX' : `Cost: ${isNaN(cost) ? 0 : cost}`} | {config.levelPerValue} per level
                </div>
              </div>
              <div className="text-sm">Lv.{currentLevel}/{config.maxLevel}</div>
            </button>
          );
        })}
      </div>

      <div className="w-full max-w-md mt-6 bg-slate-800 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Current Upgrades</h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {Object.entries(gameState.current.squadSkills).map(([id, level]) => (
            <div key={id} className="bg-slate-900 p-1 rounded">
              {UPGRADE_CONFIG[id]?.name || id}: {level}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button onClick={resetCoins} className="bg-red-600 px-4 py-2 rounded">Reset Coins</button>
        <button onClick={resetSkills} className="bg-red-600 px-4 py-2 rounded">Reset Skills</button>
        <button onClick={() => setShowShop(false)} className="bg-slate-600 px-4 py-2 rounded">Close</button>
      </div>
    </div>
  );
  const [loadingText, setLoadingText] = useState('');
  
  const [playerName, setPlayerName] = useState(() => localStorage.getItem('nano_banana_player_name') || '');
  const [records, setRecords] = useState<{name: string, score: number, stage: number, date: string, character: string}[]>(() => {
    const saved = localStorage.getItem('nano_banana_records');
    return saved ? JSON.parse(saved).slice(0, 10) : [];
  });
  const [showRecords, setShowRecords] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const resetRecords = () => {
    setRecords([]);
    localStorage.removeItem('nano_banana_records');
    setShowResetConfirm(false);
  };

  const saveRecord = (score: number, stage: number) => {
    const newRecord = {
      name: playerName || 'Player',
      score,
      stage,
      date: new Date().toISOString(),
      character: gameState.current.selectedCharacters[0] || 'cat'
    };
    setRecords(prev => {
      const updated = [...prev, newRecord].sort((a, b) => b.score - a.score).slice(0, 10);
      localStorage.setItem('nano_banana_records', JSON.stringify(updated));
      return updated;
    });
  };

  const [coins, setCoins] = useState(() => {
    const parsed = parseInt(localStorage.getItem('nano_banana_coins') || '0');
    return isNaN(parsed) ? 0 : parsed;
  });
  const coinsRef = useRef(coins);
  useEffect(() => { coinsRef.current = coins; }, [coins]);
  const [upgrades, setUpgrades] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('nano_banana_upgrades');
    return saved ? JSON.parse(saved) : {};
  });
  const upgradesRef = useRef(upgrades);
  useEffect(() => { upgradesRef.current = upgrades; }, [upgrades]);

  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem('nano_banana_stats');
    return saved ? JSON.parse(saved) : {
      totalKills: 0,
      totalCoins: 0,
      totalScore: 0,
      maxStage: 0,
      claimedAchievements: []
    };
  });
  const statsRef = useRef(stats);
  useEffect(() => { statsRef.current = stats; }, [stats]);

  const [showAchievements, setShowAchievements] = useState(false);

  const updateStatsAndSave = (sessionScore: number, sessionCoins: number, sessionKills: number, sessionStage: number, state?: any) => {
    if (state && state.statsUpdated) return;
    if (state) state.statsUpdated = true;
    
    setStats(prev => {
      const newStats = {
        ...prev,
        totalKills: (prev.totalKills || 0) + (sessionKills || 0),
        totalCoins: (prev.totalCoins || 0) + (sessionCoins || 0),
        totalScore: (prev.totalScore || 0) + (sessionScore || 0),
        maxStage: Math.max(prev.maxStage || 0, sessionStage || 0)
      };
      const newCoins = (coinsRef.current || 0) + (sessionCoins || 0);
      setCoins(newCoins);
      saveProgress(newCoins, upgradesRef.current, Math.max(sessionScore || 0, highScoreRef.current || 0), newStats);
      return newStats;
    });
  };

  const claimAchievement = (achievementId: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (!achievement) return;

    if (statsRef.current.claimedAchievements.includes(achievementId)) return;

    // Check if requirement is met
    let met = false;
    switch (achievement.requirementType) {
      case 'kills': met = statsRef.current.totalKills >= achievement.requirementValue; break;
      case 'stage': met = statsRef.current.maxStage >= achievement.requirementValue; break;
      case 'coins': met = statsRef.current.totalCoins >= achievement.requirementValue; break;
      case 'score': met = statsRef.current.totalScore >= achievement.requirementValue; break;
    }

    if (met) {
      const newCoins = coinsRef.current + achievement.reward;
      const newStats = {
        ...statsRef.current,
        claimedAchievements: [...statsRef.current.claimedAchievements, achievementId]
      };
      setCoins(newCoins);
      setStats(newStats);
      saveProgress(newCoins, upgradesRef.current, highScoreRef.current, newStats);
      vibrate(100);
      playSound('powerup');
    }
  };

  const AchievementModal = () => (
    <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-4 z-50 text-white">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-yellow-500/30 p-6 flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center gap-2">
            <Target size={24} /> ACHIEVEMENTS
          </h2>
          <button onClick={() => setShowAchievements(false)} className="p-2 hover:bg-white/10 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-800/50 p-4 rounded-xl border border-white/5">
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase font-bold">Total Kills</div>
            <div className="text-xl font-black text-red-400">{stats.totalKills.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-400 uppercase font-bold">Max Stage</div>
            <div className="text-xl font-black text-blue-400">{stats.maxStage}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
          {ACHIEVEMENTS.map(achievement => {
            const isClaimed = stats.claimedAchievements.includes(achievement.id);
            let progress = 0;
            let current = 0;
            switch (achievement.requirementType) {
              case 'kills': current = stats.totalKills; break;
              case 'stage': current = stats.maxStage; break;
              case 'coins': current = stats.totalCoins; break;
              case 'score': current = stats.totalScore; break;
            }
            progress = Math.min(1, current / achievement.requirementValue);
            const isCompleted = progress >= 1;

            return (
              <div key={achievement.id} className={`p-4 rounded-xl border transition-all ${isClaimed ? 'bg-slate-800/30 border-slate-700 opacity-60' : isCompleted ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-slate-800 border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-bold text-sm">{achievement.title}</div>
                    <div className="text-xs text-slate-400 mb-2">{achievement.description}</div>
                    
                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden mb-1">
                      <div className="h-full bg-yellow-500 transition-all duration-500" style={{ width: `${progress * 100}%` }} />
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-[10px] text-slate-500 font-mono">{current.toLocaleString()} / {achievement.requirementValue.toLocaleString()}</div>
                      <div className="text-[10px] font-bold text-yellow-500">+{achievement.reward} 💰</div>
                    </div>
                  </div>
                  
                  {isClaimed ? (
                    <div className="text-green-500 text-xs font-bold uppercase">Claimed</div>
                  ) : isCompleted ? (
                    <button 
                      onClick={() => claimAchievement(achievement.id)}
                      className="bg-yellow-500 hover:bg-yellow-400 text-black text-[10px] font-black px-3 py-1.5 rounded-lg uppercase shadow-lg shadow-yellow-500/20"
                    >
                      Claim
                    </button>
                  ) : (
                    <div className="text-slate-600 text-xs font-bold uppercase">Locked</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Sync state to LocalStorage
  const saveProgress = (newCoins: number, newUpgrades: any, newHighScore: number, newStats?: Stats) => {
    const currentStats = newStats || statsRef.current;
    
    // Ensure all numeric values are integers
    const safeCoins = Math.floor(newCoins || 0);
    const safeHighScore = Math.floor(newHighScore || 0);
    const safeStats = {
      totalKills: Math.floor(currentStats.totalKills || 0),
      totalCoins: Math.floor(currentStats.totalCoins || 0),
      totalScore: Math.floor(currentStats.totalScore || 0),
      maxStage: Math.floor(currentStats.maxStage || 0),
      claimedAchievements: currentStats.claimedAchievements || []
    };

    const safeUpgrades: Record<string, number> = {};
    if (newUpgrades) {
      Object.keys(newUpgrades).forEach(key => {
        safeUpgrades[key] = Math.floor(newUpgrades[key] || 0);
      });
    }

    localStorage.setItem('nano_banana_coins', safeCoins.toString());
    localStorage.setItem('nano_banana_upgrades', JSON.stringify(safeUpgrades));
    localStorage.setItem('nano_banana_highscore', safeHighScore.toString());
    localStorage.setItem('nano_banana_stats', JSON.stringify(safeStats));
  };

  useEffect(() => {
    // Load initial data from localStorage
    const savedCoins = parseInt(localStorage.getItem('nano_banana_coins') || '0');
    const savedHighScore = parseInt(localStorage.getItem('nano_banana_highscore') || '0');
    const savedUpgrades = JSON.parse(localStorage.getItem('nano_banana_upgrades') || '{}');
    const savedStats = JSON.parse(localStorage.getItem('nano_banana_stats') || 'null');

    if (savedCoins) setCoins(savedCoins);
    if (savedHighScore) setHighScore(savedHighScore);
    if (savedUpgrades) setUpgrades(savedUpgrades);
    if (savedStats) setStats(savedStats);
  }, []);
  
  
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(['cat']);
  
  const assetsRef = useRef<GameAssets | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setNeedsApiKey(!hasKey);
      }
    };
    checkKey();
  }, []);

  const gameState = useRef<GameState>(INITIAL_GAME_STATE);

  const handleSelectKey = async () => {
    if (window.aistudio && window.aistudio.openSelectKey) {
      await window.aistudio.openSelectKey();
      setNeedsApiKey(false);
    }
  };

  const handlePlayClick = async () => {
    vibrate(20);
    initAudio();
    playBGM();
    
    // Sync state to ref
    const finalPlayerCount = 1;
    gameState.current.playerCount = finalPlayerCount;
    gameState.current.selectedCharacters = selectedCharacters;
    
    // Force re-generation of assets for testing
    assetsRef.current = null;

    if (needsApiKey) {
      await handleSelectKey();
      return;
    }

    setReactStateStatus('GENERATING');
    setLoadingText('Loading base assets...');
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const [
        animalImg, bossImg, coinImgObj, blackBombImgObj, feverImgObj, heartImgObj, magnetImgObj, iceImgObj, fireImgObj, slimeImgObj, poisonImgObj, bombImgObj,
        droneImgObj, droneOldImgObj, shieldImgObj, freezeImgObj, critImgObj, fireAmmoImgObj, poisonAmmoImgObj, iceAmmoImgObj, homingAmmoImgObj, victoryPoseImg,
        fireBulletImgObj, iceBulletImgObj, poisonBulletImgObj, electricBulletImgObj, laserBulletImgObj, normalBulletImgObj, homingBulletImgObj, criticalBulletImgObj,
        bossFireBulletImgObj, bossIceBulletImgObj, bossPoisonBulletImgObj, bossElectricBulletImgObj, bossLaserBulletImgObj,
        ...backgrounds
      ] = await Promise.all([
        loadLocalImage(dog1),
        loadLocalImage(bossGalleryPngSrc),
        loadLocalImage(coinImg),
        loadLocalImage(blackBombImg),
        loadLocalImage(feverImg),
        loadLocalImage(heartImg),
        loadLocalImage(magnetImg),
        loadLocalImage(iceImg),
        loadLocalImage(fireImg),
        loadLocalImage(slimeImg),
        loadLocalImage(poisonImg),
        loadLocalImage(bombImg),
        loadLocalImage(droneImg),
        loadLocalImage(droneOldImg),
        loadLocalImage(shieldImg),
        loadLocalImage(freezeImg),
        loadLocalImage(critImg),
        loadLocalImage(fireAmmoImg),
        loadLocalImage(poisonAmmoImg),
        loadLocalImage(iceAmmoImg),
        loadLocalImage(homingAmmoImg),
        loadLocalImage(victoryPose).catch(() => null),
        loadLocalImage('/bullet/fire.png'),
        loadLocalImage('/bullet/ice.png'),
        loadLocalImage('/bullet/poison.png'),
        loadLocalImage('/bullet/electric.png'),
        loadLocalImage('/bullet/laser.png'),
        loadLocalImage('/bullet/normal.png'),
        loadLocalImage('/bullet/homing.png'),
        loadLocalImage(criticalBulletImg),
        loadLocalImage(bossFireBulletImg),
        loadLocalImage(bossIceBulletImg),
        loadLocalImage(bossPoisonBulletImg),
        loadLocalImage(bossElectricBulletImg),
        loadLocalImage(bossLaserBulletImg),
        ...STAGE_BACKGROUNDS.map(url => loadLocalImage(url).catch(() => null))
      ]);

      const processImage = (img: HTMLImageElement) => {
        return img;
      };

      const processedIce = processImage(iceImgObj);
      const processedFire = processImage(fireImgObj);
      const processedSlime = processImage(slimeImgObj);
      const processedPoison = processImage(poisonImgObj);
      console.log('poisonImgObj:', poisonImgObj);
      console.log('processedPoison:', processedPoison);
      const processedBomb = processImage(bombImgObj);

      const catImgs = await Promise.all([
        loadLocalImage(cat1).catch(() => animalImg),
        loadLocalImage(cat2).catch(() => animalImg),
        loadLocalImage(cat3).catch(() => animalImg),
        loadLocalImage(cat4).catch(() => animalImg),
        loadLocalImage(cat5).catch(() => animalImg)
      ]);

      const dogImgs = await Promise.all([
        loadLocalImage(dog1).catch(() => animalImg),
        loadLocalImage(dog2).catch(() => animalImg),
        loadLocalImage(dog3).catch(() => animalImg),
        loadLocalImage(dog4).catch(() => animalImg),
        loadLocalImage(dog5).catch(() => animalImg)
      ]);

      const rabbitImgs = await Promise.all([
        loadLocalImage(rabbit1).catch(() => animalImg),
        loadLocalImage(rabbit2).catch(() => animalImg),
        loadLocalImage(rabbit3).catch(() => animalImg),
        loadLocalImage(rabbit4).catch(() => animalImg),
        loadLocalImage(rabbit5).catch(() => animalImg)
      ]);

      const ratImgs = await Promise.all([
        loadLocalImage(rat1).catch(() => animalImg),
        loadLocalImage(rat2).catch(() => animalImg),
        loadLocalImage(rat3).catch(() => animalImg),
        loadLocalImage(rat4).catch(() => animalImg),
        loadLocalImage(rat5).catch(() => animalImg)
      ]);

      const bossImages = new Map<string, HTMLImageElement | HTMLCanvasElement>();
      
      // Load specific assets for each boss
      await Promise.all(BOSSES.map(async (b) => {
        if (b.image) {
          try {
            const img = await loadLocalImage(b.image);
            
            bossImages.set(b.name, img);
          } catch (e) {
            console.error(`Failed to load image for ${b.name}: ${b.image}`, e);
            bossImages.set(b.name, bossImg);
          }
        } else {
          bossImages.set(b.name, bossImg);
        }
      }));

      assetsRef.current = {
        animal: animalImg,
        boss: bossImg, // Default fallback
        bossImages,
        victoryPose: victoryPoseImg,
        items: {
          coin: processImage(coinImgObj),
          bomb: processImage(blackBombImgObj),
          fever: processImage(feverImgObj),
          heart: processImage(heartImgObj),
          magnet: processImage(magnetImgObj),
          drone: processImage(droneOldImgObj),
          drone_equipped: processImage(droneImgObj),
          shield: processImage(shieldImgObj),
          freeze: processImage(freezeImgObj),
          crit: processImage(critImgObj),
          fire: processImage(fireAmmoImgObj),
          fire_ammo: processImage(fireAmmoImgObj),
          poison: processImage(poisonAmmoImgObj),
          poison_ammo: processImage(poisonAmmoImgObj),
          ice: processImage(iceAmmoImgObj),
          ice_ammo: processImage(iceAmmoImgObj),
          homing: processImage(homingAmmoImgObj),
          homing_ammo: processImage(homingAmmoImgObj),
        },
        bullets: {
          fire: processImage(fireBulletImgObj),
          ice: processImage(iceBulletImgObj),
          poison: processImage(poisonBulletImgObj),
          electric: processImage(electricBulletImgObj),
          laser: processImage(laserBulletImgObj),
          normal: processImage(normalBulletImgObj),
          homing: processImage(homingBulletImgObj),
          crit: processImage(criticalBulletImgObj),
        },
        bossBullets: {
          fire: processImage(bossFireBulletImgObj),
          ice: processImage(bossIceBulletImgObj),
          poison: processImage(bossPoisonBulletImgObj),
          electric: processImage(bossElectricBulletImgObj),
          laser: processImage(bossLaserBulletImgObj),
        },
        enemies: { 
          normal: processedSlime,
          ice: processedIce, 
          fire: processedFire, 
          slime: processedSlime, 
          poison: processedPoison, 
          bomb: processedBomb 
        },
        characters: { cat: catImgs, dog: dogImgs, rabbit: rabbitImgs, rat: ratImgs },
        backgrounds: backgrounds as (HTMLImageElement | null)[],
        names: { animal: 'Puppy', boss: 'Inferno King', item: 'coin' }
      };
    } catch (e) {
      console.error("Failed to load local assets", e);
    }

    startGame();
  };

  const triggerSkillSelection = () => {
    const state = gameState.current;
    const skillCount = getStageSkillCount(state.stage);
    const selected: RogueliteSkill[] = [];
    
    for (let i = 0; i < skillCount; i++) {
      const totalWeight = SKILL_RARITY_WEIGHTS.COMMON + SKILL_RARITY_WEIGHTS.RARE + SKILL_RARITY_WEIGHTS.EPIC + SKILL_RARITY_WEIGHTS.LEGENDARY;
      let rand = Math.random() * totalWeight;
      let chosenRarity: SkillRarity = 'COMMON';
      
      if (rand < SKILL_RARITY_WEIGHTS.LEGENDARY) chosenRarity = 'LEGENDARY';
      else if (rand < SKILL_RARITY_WEIGHTS.LEGENDARY + SKILL_RARITY_WEIGHTS.EPIC) chosenRarity = 'EPIC';
      else if (rand < SKILL_RARITY_WEIGHTS.LEGENDARY + SKILL_RARITY_WEIGHTS.EPIC + SKILL_RARITY_WEIGHTS.RARE) chosenRarity = 'RARE';
      else chosenRarity = 'COMMON';
      
      let pool = AVAILABLE_SKILLS.filter(s => s.rarity === chosenRarity && !selected.includes(s));
      if (pool.length === 0) pool = AVAILABLE_SKILLS.filter(s => !selected.includes(s));
      
      if (pool.length > 0) {
        const skill = pool[Math.floor(Math.random() * pool.length)];
        selected.push(skill);
      }
    }
    
    state.skillOptions = selected;
    setSkillChoices(selected);
    state.status = 'SKILL_SELECTION';
    setReactStateStatus('SKILL_SELECTION');
  };

  const handleSkillSelect = (skill: RogueliteSkill) => {
    vibrate(50);
    const state = gameState.current;
    if (skill.id === 'heal') {
      state.players.forEach(p => {
        p.count = Math.min(PLAYER_MAX_HP + state.squadSkills.maxHp, p.count + skill.value);
      });
    } else {
      const increment = skill.value;

      const skillId = skill.id as keyof typeof state.squadSkills;
      state.squadSkills[skillId] += increment;
      if (skill.id === 'maxHp') {
        state.players.forEach(p => {
          p.count += increment; // Heal by the amount of max HP increased
        });
      }
    }
    state.status = 'PLAYING';
    setReactStateStatus('PLAYING');
    
    // Apply stage start skills
    state.players.forEach(p => {
      if (!p.isDead) {
        p.shield = Math.max(p.shield, state.squadSkills.shieldStart);
      }
    });
  };

  const startGame = () => {
    gameState.current = {
      status: 'PLAYING',
      score: 0,
      coins: 0,
      kills: 0,
      statsUpdated: false,
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
      players: Array.from({ length: gameState.current.playerCount }).map((_, i) => ({
        id: i,
        x: CANVAS_WIDTH / 2 + (i - (gameState.current.playerCount - 1) / 2) * 50,
        y: CANVAS_HEIGHT - 150,
        count: 1,
        shield: 0,
        bombCount: 1, // Start with 1 bomb
        magnetTime: 0,
        fireTimer: 0,
        poisonTimer: 0,
        playerFreezeTimer: 0,
        critTimer: 0,
        ammoType: 'NORMAL',
        ammoTimer: 0,
        character: gameState.current.selectedCharacters[i] || 'cat',
        isDead: false
      })),
      playerCount: gameState.current.playerCount,
      selectedCharacters: gameState.current.selectedCharacters,
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
    };
    setReactStateStatus('PLAYING');
  };

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      const state = gameState.current;
      if (state.status !== 'PLAYING' || state.isPaused) return;
      
      // Keyboard Movement
      const baseSpeed = PLAYER_SPEED;
      const speed = state.feverTime > 0 ? baseSpeed * FEVER_SPEED_MULTIPLIER : baseSpeed;
      const keys = keysRef.current;
      state.players.forEach((p, index) => {
        if (p.isDead || p.playerFreezeTimer > 0) return;
        
        // Base speed
        let currentSpeed = speed * (1 + state.squadSkills.speedySquad * 0.05);
        // Rabbit passive: +10% speed removed
        
        // Slow effect from Earthquake or other sources
        if (state.screenShake > 10) {
          currentSpeed *= 0.6; // Slow down during heavy earthquake
        }

        let dx = 0;
        let dy = 0;
        if (index === 0) {
          if (keys['KeyW']) dy -= currentSpeed;
          if (keys['KeyS']) dy += currentSpeed;
          if (keys['KeyA']) dx -= currentSpeed;
          if (keys['KeyD']) dx += currentSpeed;
        } else if (index === 1) {
          if (keys['ArrowUp']) dy -= currentSpeed;
          if (keys['ArrowDown']) dy += currentSpeed;
          if (keys['ArrowLeft']) dx -= currentSpeed;
          if (keys['ArrowRight']) dx += currentSpeed;
        }
        p.x = Math.max(20, Math.min(CANVAS_WIDTH - 20, p.x + dx));
        p.y = Math.max(20, Math.min(CANVAS_HEIGHT - 20, p.y + dy));
      });

      state.frameCount++;

      // Boss Defeated Timer
      if (state.bossDefeated) {
        state.bossDefeatedTimer--;
        if (state.bossDefeatedTimer <= 0) {
          state.bossDefeated = false;
          // Advance to next stage
          if (state.stage < STAGES.length) {
            state.stage++;
          }
          state.stageStartFrame = state.frameCount;
          state.enemies = [];
          state.enemyBullets = [];
          state.items = [];
          state.gates = [];
          state.spawnQueue = [];
          
          // Trigger Skill Selection after 1 second delay
          triggerSkillSelection();
        }
      }

      // Process Spawn Queue
      state.spawnQueue = state.spawnQueue.filter(sq => {
        if (state.frameCount >= sq.spawnFrame) {
          state.enemies.push({
            id: sq.id,
            x: sq.x,
            y: sq.y,
            hp: sq.hp,
            maxHp: sq.maxHp,
            size: sq.size,
            speed: sq.speed,
            type: sq.type
          });
          return false;
        }
        return true;
      });

      // Status Effects
      state.players.forEach(p => {
        if (p.isDead) return;
        if (p.playerFreezeTimer > 0) p.playerFreezeTimer--;
        if (p.fireTimer > 0) {
          p.fireTimer--;
          if (p.fireTimer % ENEMY_FIRE_TICK_RATE === 0) {
            p.count = Math.max(1, p.count - ENEMY_FIRE_TICK_DAMAGE);
            vibrate(20);
            state.screenShake = 5;
            createParticles(state, p.x, p.y, '#ef4444', 10);
          }
        }
        if (p.poisonTimer > 0) {
          p.poisonTimer--;
          if (p.poisonTimer % ENEMY_POISON_TICK_RATE === 0) {
            p.count = Math.max(1, p.count - ENEMY_POISON_TICK_DAMAGE);
            vibrate(20);
            state.screenShake = 5;
            createParticles(state, p.x, p.y, '#22c55e', 10);
          }
        }
      });

      const stageIndex = Math.min(STAGES.length - 1, state.stage - 1);
      const currentStage = STAGES[stageIndex];
      const stage = state.stage; // For backward compatibility in other parts
      
      const totalCount = state.players.reduce((sum, p) => sum + (p.isDead ? 0 : p.count), 0);
      const countMultiplier = Math.max(1, Math.pow(totalCount, 2) * 0.005);
      const hpMultiplier = countMultiplier * Math.pow(1.15, stage - 1);
      
      // Spawn rate based on stage config
      const spawnRate = Math.max(60, currentStage.spawnRateBase - Math.floor((state.frameCount - state.stageStartFrame) / 60));

      // 1. Spawn Boss or Enemies
      // Boss spawns every 1800 frames (30 seconds) within the stage
      if (!state.bossActive && !state.bossDefeated && state.frameCount - state.stageStartFrame >= 1800) {
        state.bossActive = true;
        
        const bossData = currentStage.boss;
        
        // Use boss health from constants
        const bossHp = bossData.hp; 
        state.enemies.push({
          id: Math.random(),
          x: CANVAS_WIDTH / 2,
          y: -50,
          hp: bossHp,
          maxHp: bossHp,
          size: 45,
          speed: ENEMY_SPEED * (0.5 + stage * 0.05), // 단계별 속도 증가
          type: 'BOSS',
          bossType: bossData.name,
          effectType: bossData.effect as any,
          // Add effect type
          fireTimer: 0,
          poisonTimer: 0,
          freezeTimer: 0
        });
      } else if (!state.bossActive && !state.bossDefeated && state.frameCount - state.lastEnemySpawn > spawnRate) {
        const y = -50;
        
        let numEnemies = Math.min(2 + (stage - 1) * 2, 20);
        const spacing = CANVAS_WIDTH / (numEnemies + 1);
        
        const enemyTypes = currentStage.enemyTypes;
        
        for (let i = 0; i < numEnemies; i++) {
          const baseHp = Math.floor(Math.random() * 10) + 1; // 1 to 10
          const hp = Math.min(baseHp * hpMultiplier, 20);
          const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)] as 'NORMAL' | 'FIRE' | 'WATER' | 'ICE' | 'POISON' | 'BOMB' | 'ARCHER';
          
          // Use full width for enemy spawn
          const x = Math.random() * (CANVAS_WIDTH - 60) + 30;
          
          // Staggered spawn: 0 to 10 seconds (600 frames)
          const spawnDelay = Math.floor(Math.random() * 600);
          
          state.spawnQueue.push({
            id: Math.random(), 
            x: x, 
            y,
            hp: hp, 
            maxHp: hp,
            size: SLIME_SIZE * (1 + Math.random() * 0.5), 
            speed: ENEMY_SPEED * (0.5 + Math.random() * 0.3), 
            type: type,
            spawnFrame: state.frameCount + spawnDelay
          });
        }
        state.lastEnemySpawn = state.frameCount;
      }

      // 2. Spawn Gates
      if (state.frameCount - state.lastGateSpawn > GATE_SPAWN_INTERVAL) {
        const y = -50;
        // Reduce SUB frequency, increase ADD frequency
        const types = ['ADD', 'ADD', 'ADD', 'ADD', 'ADD', 'ADD', 'ADD', 'ADD', 'ADD', 'ADD', 'SUB', 'DIV', 'DIV', 'MULT', 'FREEZE', 'FIRE', 'SHIELD', 'DRONE'];
        const type = types[Math.floor(Math.random() * types.length)] as 'ADD' | 'MULT' | 'SUB' | 'DIV' | 'FREEZE' | 'FIRE' | 'SHIELD' | 'DRONE';
        let value = 0;
        
        const stage = state.stage;
        
        if (type === 'ADD') {
           value = Math.floor(Math.random() * stage) + 1; // Starts at +1
        } else if (type === 'MULT') {
           value = 1; // Always starts at x1 (will change to x2 after hits)
        } else if (type === 'DIV') {
           value = 2; // Always starts at ÷2
        } else if (type === 'SUB') {
           // Value increases over time, HP cubed
           const maxVal = Math.min(10, stage * 2);
           value = Math.floor(Math.random() * maxVal) + 1;
        } else if (type === 'FREEZE') {
           value = 300; // 5 seconds slow
        } else if (type === 'FIRE') {
           value = 600; // 10 seconds infusion
        } else if (type === 'SHIELD') {
           value = 180; // 3 seconds shield
        } else if (type === 'DRONE') {
           value = 0;
        }
        
        let width = CANVAS_WIDTH * 0.3; // 1/2 size
        if (type === 'DIV') {
          width = CANVAS_WIDTH * DIV_GATE_WIDTH_RATIO;
        }
        const x = Math.random() * (CANVAS_WIDTH - width);
        
        state.gates.push({ id: Math.random(), x, y, width, height: 60, type, value, hits: 0 });
        state.lastGateSpawn = state.frameCount;
      }

      // 3. Spawn Items
      const itemSpawnRate = state.bossActive ? 400 : 560;
      if (state.frameCount % itemSpawnRate === 0) {
        const rand = Math.random();
        let type: 'FEVER' | 'BOMB' | 'DRONE' | 'SHIELD' | 'MAGNET' | 'FREEZE' | 'CRIT' | 'FIRE' | 'POISON_AMMO' | 'ICE_AMMO' | 'HOMING_AMMO' | 'COIN' | 'HEART' = 'FEVER';
        
        if (rand > 0.9625) type = 'BOMB'; // 3.75%
        else if (rand > 0.925) type = 'DRONE'; // 3.75%
        else if (rand > 0.85) type = 'COIN'; // 7.5% for coins
        else if (rand > 0.8) type = 'HEART'; // 5% for hearts
        else if (rand > 0.7) type = 'SHIELD';
        else if (rand > 0.6) type = 'MAGNET';
        else if (rand > 0.5) type = 'FREEZE';
        else if (rand > 0.4) type = 'CRIT';
        else if (rand > 0.32) type = 'FIRE';
        else if (rand > 0.24) type = 'POISON_AMMO';
        else if (rand > 0.16) type = 'ICE_AMMO';
        else if (rand > 0.08) type = 'HOMING_AMMO';
        else type = 'FEVER';
        
        state.items.push({ id: Math.random(), x: Math.random() * (CANVAS_WIDTH - 60) + 30, y: -20, type, speed: Math.random() * 2 + 1 });
      }

      // 4. Move Entities
      if (state.comboTimer > 0) {
        state.comboTimer--;
        if (state.comboTimer <= 0) state.combo = 0;
      }

      state.bullets.forEach(b => {
        if (b.type === 'HOMING' && state.enemies.length > 0) {
          // Find nearest enemy
          let nearestEnemy = state.enemies[0];
          let minDist = Infinity;
          state.enemies.forEach(e => {
            const dist = Math.hypot(e.x - b.x, e.y - b.y);
            if (dist < minDist) {
              minDist = dist;
              nearestEnemy = e;
            }
          });
          
          if (minDist < 400) { // Homing range
            const dx = nearestEnemy.x - b.x;
            const dy = nearestEnemy.y - b.y;
            const dist = Math.hypot(dx, dy);
            
            // Initialize vx and vy if not present
            if (b.vx === undefined) b.vx = 0;
            if (b.vy === undefined) b.vy = -BULLET_SPEED;
            
            // Steer towards target
            b.vx += (dx / dist) * 1.5;
            b.vy += (dy / dist) * 1.5;
            
            // Limit speed
            const currentSpeed = Math.hypot(b.vx, b.vy);
            if (currentSpeed > BULLET_SPEED) {
              b.vx = (b.vx / currentSpeed) * BULLET_SPEED;
              b.vy = (b.vy / currentSpeed) * BULLET_SPEED;
            }
            
            b.x += b.vx;
            b.y += b.vy;
          } else {
            b.y -= BULLET_SPEED;
          }
        } else {
          if (b.vx !== undefined && b.vy !== undefined) {
             b.x += b.vx;
             b.y += b.vy;
          } else {
             b.y -= BULLET_SPEED;
          }
        }
      });
      state.bullets = state.bullets.filter(b => b.y > -50 && b.x > -50 && b.x < CANVAS_WIDTH + 50);

      state.enemyBullets.forEach(b => { 
        if (b.type === 'POISON' && b.vx < 1 && b.vy < 1) { // Homing poison logic
          const alivePlayers = state.players.filter(p => !p.isDead);
          if (alivePlayers.length > 0) {
            const target = alivePlayers[0];
            const dx = target.x - b.x;
            const dy = target.y - b.y;
            const dist = Math.hypot(dx, dy) || 1;
            b.vx += (dx / dist) * 0.05;
            b.vy += (dy / dist) * 0.05;
            
            // Limit speed
            const speed = Math.hypot(b.vx, b.vy);
            if (speed > 3) {
              b.vx = (b.vx / speed) * 3;
              b.vy = (b.vy / speed) * 3;
            }
          }
        }

        b.x += b.vx; 
        b.y += b.vy; 
        if (b.type === 'POISON') {
          b.x += Math.sin(state.frameCount * 0.1 + b.id) * 2;
        }
        if (b.type === 'STORM') {
          state.players.forEach(p => {
            if (p.isDead) return;
            const dx = b.x - p.x;
            const dy = b.y - p.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 200) {
              p.x += dx * 0.005;
              p.y += dy * 0.005;
            }
          });
        }
        if (b.type === 'WATERFALL') {
          state.players.forEach(p => {
            if (p.isDead) return;
            const dx = b.x - p.x;
            const dist = Math.abs(dx);
            if (dist < 40) {
              p.y += 0.5; // Push down (reduced strength)
            }
          });
        }
      });
      state.enemyBullets = state.enemyBullets.filter(b => b.y < CANVAS_HEIGHT + 50);

      state.enemies.forEach(e => {
        if (e.hitFlash && e.hitFlash > 0) e.hitFlash--;
        
        if (e.fireTimer && e.fireTimer > 0) {
          e.fireTimer--;
          if (e.fireTimer % CHAR_FIRE_TICK_RATE === 0) {
            e.hp -= CHAR_FIRE_TICK_DAMAGE;
            createParticles(state, e.x, e.y, '#FF4500', 5);
          }
        }
        if (e.poisonTimer && e.poisonTimer > 0) {
          e.poisonTimer--;
          if (e.poisonTimer % CHAR_POISON_TICK_RATE === 0) {
            e.hp -= CHAR_POISON_TICK_DAMAGE;
            createParticles(state, e.x, e.y, '#22c55e', 5);
          }
        }
        if (e.freezeTimer && e.freezeTimer > 0) {
          e.freezeTimer--;
        }

        if (e.hp <= 0) {
          state.kills++;
          state.combo++;
          state.comboTimer = 120; // 2 seconds
          if (state.combo > 0 && state.combo % FEVER_COMBO_THRESHOLD === 0) {
             state.feverTime = 300 + state.squadSkills.feverDuration;
             createFloatingText(state, e.x, e.y - 40, "FEVER MODE!", "#FFFF00");
             playSound('fever');
             createParticles(state, e.x, e.y, '#FFFF00', 30);
          }
          const scoreGained = Math.ceil(Math.ceil(e.maxHp) * state.combo * (1 + state.squadSkills.scoreMult * 0.5));
          state.score += scoreGained;
          const coinsGained = e.type === 'BOSS' ? 10 : 1;
          state.coins += coinsGained;
          createFloatingText(state, e.x, e.y, `+${scoreGained} (x${state.combo})`, "#FFD700");
          createFloatingText(state, e.x, e.y - 40, `+${coinsGained} 💰`, "#FFD700");
          createParticles(state, e.x, e.y, '#FF6B6B', e.type === 'BOSS' ? 50 : 15);

          if (e.type === 'BOSS') {
            state.bossActive = false;
            state.bossDefeated = true;
            state.bossDefeatedTimer = 120; // 2 seconds destruction effect
            state.score += (1000 * state.combo) * (1 + state.squadSkills.scoreMult * 0.5);
            state.screenShake = 30; // Stronger shake
            createFloatingText(state, e.x, e.y - 30, "BOSS DEFEATED!", "#FFD700");
            createParticles(state, e.x, e.y, '#FF4500', 100); // Massive explosion
            playSound('explosion');

            // Clear other enemies immediately to prevent Game Over during boss explosion
            state.enemies = state.enemies.filter(enemy => enemy.id === e.id);
            state.enemyBullets = [];
            state.spawnQueue = [];
            state.gates = [];
            state.items = [];

            if (state.stage === 13) {
              state.gameCleared = true;
              state.creditsTimer = 1800; // 30 seconds of credits
              updateStatsAndSave(state.score, state.coins, state.kills, state.stage, state);
            }
          }
          return; // It will be filtered out later
        }

        if (state.freezeTime > 0 || (e.freezeTimer && e.freezeTimer > 0)) return; // Skip movement and shooting if frozen
        
        if (e.type === 'BOSS') {
          const stage = state.stage;
          if (e.y < 150) {
            e.y += e.speed;
          } else {
            // Boss movement: dynamic and within screen
            const bossSpeed = (2 + stage * 0.5);
            // 더 복잡한 움직임: 사인파 + 코사인파 조합
            e.x += Math.sin(state.frameCount / 20) * bossSpeed + Math.cos(state.frameCount / 50) * (bossSpeed * 0.5);
            e.x = Math.max(e.size, Math.min(CANVAS_WIDTH - e.size, e.x));
            
            // 보스 공격 시 화면 흔들림 추가
            const hpPercent = e.hp / e.maxHp;
            const isPhase2 = hpPercent < 0.5;
            const isPhase3 = hpPercent < 0.2;

            if (isPhase2 && !e.phase2Announced) {
              e.phase2Announced = true;
              createFloatingText(state, e.x, e.y, "PHASE 2: ENRAGED!", "#FFFF00", true);
              state.screenShake = 30;
              playSound('fever');
            }
            if (isPhase3 && !e.phase3Announced) {
              e.phase3Announced = true;
              createFloatingText(state, e.x, e.y, "FINAL PHASE: DESPERATION!", "#FF0000", true);
              state.screenShake = 50;
              playSound('fever');
            }

            const attackRate = Math.max(isPhase2 ? 60 : 120, (400 - stage * 40) * (isPhase2 ? 0.7 : 1.0)); 
            
            if (state.frameCount % Math.floor(attackRate) === 0) {
              state.screenShake = isPhase2 ? 15 : 10; // 공격 시 화면 흔들림
              
              const patternCount = 6;
              const patternType = Math.floor(state.frameCount / attackRate) % patternCount;
              
              // Boss fight: spawn normal enemies
              if (state.frameCount % (isPhase2 ? 180 : 240) === 0) {
                const stageIndex = Math.min(STAGES.length - 1, state.stage - 1);
                const currentStage = STAGES[stageIndex];
                const enemyTypes = currentStage.enemyTypes;
                const spawnCount = 1 + stage; 
                for (let i = 0; i < spawnCount; i++) {
                  const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)] as 'NORMAL' | 'FIRE' | 'WATER' | 'ICE' | 'POISON' | 'BOMB' | 'ARCHER';
                  const spawnDelay = Math.floor(Math.random() * 300); // 0-5 seconds delay (60fps)
                  state.spawnQueue.push({
                    id: Math.random(),
                    x: e.x + (Math.random() - 0.5) * 150, // Spawn near boss
                    y: e.y + (Math.random() - 0.5) * 50 + 50, // Spawn near boss
                    hp: 5 * stage,
                    maxHp: 5 * stage,
                    size: 20,
                    speed: ENEMY_SPEED * 0.8,
                    type: type,
                    spawnFrame: state.frameCount + spawnDelay
                  });
                }
              }
              
              const bossIndex = Math.max(0, BOSSES.findIndex(b => b.name === e.bossType));
              const bossConfig = BOSSES[bossIndex];
              const bulletCountMult = (bossConfig?.bulletCount || 1.0) * (isPhase2 ? 1.2 : 1.0) * BOSS_BULLET_COUNT_MULTIPLIER; // Use constant for bullet count
              const bulletSpeedMult = (bossConfig?.bulletSpeed || 1.0) * (isPhase2 ? 1.2 : 1.0);
              
              if (e.effectType === 'ALL') {
                if (!e.currentEffect || (e.effectTimer && e.effectTimer <= 0)) {
                  const allEffects = ['FIRE', 'ICE', 'POISON', 'ELECTRIC', 'WATERFALL', 'WIND', 'THUNDER', 'EARTHQUAKE', 'LASER', 'STORM'];
                  e.currentEffect = allEffects[Math.floor(Math.random() * allEffects.length)] as any;
                  e.effectTimer = 240; // 4 seconds
                  createFloatingText(state, CANVAS_WIDTH/2, CANVAS_HEIGHT/2, `VOID: ${e.currentEffect}!`, "#FFF", true);
                }
              }

              let element: any = e.effectType === 'ALL' ? e.currentEffect : e.effectType;
              if (!element) element = 'FIRE';
              
              if (e.effectTimer && e.effectTimer > 0) e.effectTimer--;

              const style = Math.floor(bossIndex / 5);
              const baseSpeed = ((4 + stage * 0.5) / 6) * bulletSpeedMult;

              // Boss Phase Logic based on HP
              let phase = 0;
              if (hpPercent < 0.2) phase = 2; // Minion spawn
              else if (hpPercent < 0.5) phase = 1; // Laser beam
              else phase = 0; // Spread shot

              if (element === 'FIRE') {
                createFloatingText(state, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "FIRE ATTACK!", "#FF4500", true);
                if (patternType === 0 || patternType === 3) { // Spread shot
                  const spread = Math.ceil(((2 + Math.floor(stage / 2) + style) / 2) * bulletCountMult);
                  for(let i=-spread; i<=spread; i++) {
                    state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: (i * 1.5) / 6, vy: baseSpeed, type: 'FIRE' });
                  }
                } else if (patternType === 1 || patternType === 4) { // Laser beam
                  const streamCount = Math.ceil(((3 + style) / 2) * bulletCountMult);
                  for(let i=0; i<streamCount; i++) {
                    setTimeout(() => {
                      if (state.status === 'PLAYING') {
                        state.enemyBullets.push({ id: Math.random(), x: e.x + (Math.random()-0.5)*10, y: e.y + e.size, vx: (Math.random()-0.5)/2, vy: baseSpeed * 1.5, type: 'FIRE' });
                      }
                    }, i * 150);
                  }
                } else if (patternType === 2) { // Fire Ring
                  const bullets = Math.ceil((12 + stage * 2) * bulletCountMult);
                  for(let i=0; i<bullets; i++) {
                    const angle = (i / bullets) * Math.PI * 2;
                    state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: Math.cos(angle) * baseSpeed * 0.8, vy: Math.sin(angle) * baseSpeed * 0.8, type: 'FIRE' });
                  }
                } else { // Fire Rain
                  const rainCount = Math.ceil((8 + stage) * bulletCountMult * 0.8);
                  for(let i=0; i<rainCount; i++) {
                    state.enemyBullets.push({ id: Math.random(), x: Math.random() * CANVAS_WIDTH, y: -20, vx: 0, vy: baseSpeed * 1.2, type: 'FIRE' });
                  }
                }
              } else if (element === 'ELECTRIC') {
                createFloatingText(state, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "ELECTRIC ATTACK!", "#FFFF00", true);
                if (patternType === 0 || patternType === 3) {
                  const alivePlayers = state.players.filter(p => !p.isDead);
                  const target = alivePlayers.length > 0 ? alivePlayers[Math.floor(Math.random() * alivePlayers.length)] : { x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT };
                  const dx = target.x - e.x;
                  const dy = target.y - e.y;
                  const dist = Math.hypot(dx, dy) || 1;
                  const speed = ((5 + stage) / 6) * bulletSpeedMult;
                  state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: (dx/dist) * speed, vy: (dy/dist) * speed, type: 'ELECTRIC' });
                  const styleCount = Math.ceil((style / 2) * bulletCountMult);
                  for(let i=1; i<=styleCount; i++) {
                     state.enemyBullets.push({ id: Math.random(), x: e.x - 20*i, y: e.y + e.size, vx: (dx/dist) * speed, vy: (dy/dist) * speed, type: 'ELECTRIC' });
                     state.enemyBullets.push({ id: Math.random(), x: e.x + 20*i, y: e.y + e.size, vx: (dx/dist) * speed, vy: (dy/dist) * speed, type: 'ELECTRIC' });
                  }
                } else if (patternType === 1 || patternType === 4) {
                  const laserCount = Math.ceil(((2 + style) / 2) * bulletCountMult);
                  for(let i=-laserCount; i<=laserCount; i++) {
                    state.enemyBullets.push({ id: Math.random(), x: e.x + i * 15, y: e.y + e.size, vx: 0, vy: (8 + stage) / 6 * bulletSpeedMult, type: 'ELECTRIC' });
                  }
                } else if (patternType === 2) { // Electric Field
                   const fieldCount = Math.ceil((10 + stage) * bulletCountMult);
                   for(let i=0; i<fieldCount; i++) {
                     const angle = (i / fieldCount) * Math.PI * 2;
                     state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: Math.cos(angle) * 1.5, vy: Math.sin(angle) * 1.5, type: 'ELECTRIC' });
                   }
                } else { // Chain Lightning (Multiple targeted shots)
                  const alivePlayers = state.players.filter(p => !p.isDead);
                  const chainCount = Math.ceil(3 * bulletCountMult);
                  for(let i=0; i<chainCount; i++) {
                    setTimeout(() => {
                      if (state.status === 'PLAYING' && alivePlayers.length > 0) {
                        const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
                        const dx = target.x - e.x;
                        const dy = target.y - e.y;
                        const dist = Math.hypot(dx, dy) || 1;
                        state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: (dx/dist) * baseSpeed * 2, vy: (dy/dist) * baseSpeed * 2, type: 'ELECTRIC' });
                      }
                    }, i * 200);
                  }
                }
              } else if (element === 'POISON') {
                createFloatingText(state, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "POISON ATTACK!", "#22c55e", true);
                if (patternType === 0 || patternType === 3) {
                  const bullets = Math.ceil(((8 + stage * 2 + style * 2) / 2) * bulletCountMult);
                  for(let i=0; i<bullets; i++) {
                    const angle = (i / bullets) * Math.PI * 2 + (state.frameCount * 0.1);
                    state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: Math.cos(angle) * baseSpeed, vy: Math.sin(angle) * baseSpeed, type: 'POISON' });
                  }
                } else if (patternType === 1 || patternType === 4) {
                  const bullets = Math.ceil(((5 + stage + style) / 2) * bulletCountMult);
                  for(let i=0; i<bullets; i++) {
                    const angle = (state.frameCount * 0.05) + (i * (0.5 - style * 0.05));
                    state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: Math.cos(angle) * baseSpeed * 1.2, vy: Math.sin(angle) * baseSpeed * 1.2, type: 'POISON' });
                  }
                } else if (patternType === 2) { // Poison Rain
                   const rainCount = Math.ceil((15 + stage * 2) * bulletCountMult);
                   for(let i=0; i<rainCount; i++) {
                     state.enemyBullets.push({ id: Math.random(), x: Math.random() * CANVAS_WIDTH, y: -50, vx: (Math.random()-0.5), vy: baseSpeed * 0.7, type: 'POISON' });
                   }
                } else { // Homing Poison
                   const alivePlayers = state.players.filter(p => !p.isDead);
                   if (alivePlayers.length > 0) {
                     const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
                     state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: (target.x - e.x) * 0.01, vy: (target.y - e.y) * 0.01, type: 'POISON' });
                   }
                }
              } else if (element === 'ICE') {
                createFloatingText(state, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "ICE ATTACK!", "#00FFFF", true);
                if (patternType === 0 || patternType === 3) {
                  const waveWidth = Math.ceil(((3 + Math.floor(stage / 2) + style) / 4) * bulletCountMult);
                  for(let i=-waveWidth; i<=waveWidth; i++) {
                     state.enemyBullets.push({ id: Math.random(), x: e.x + i * 20, y: e.y + e.size, vx: 0, vy: ((3 + Math.abs(i) * 0.5 + stage * 0.2) / 6) * bulletSpeedMult, type: 'ICE' });
                  }
                } else if (patternType === 1 || patternType === 4) {
                  const rainCount = Math.ceil(((5 + stage + style * 2) / 4) * bulletCountMult);
                  for(let i=0; i<rainCount; i++) {
                    state.enemyBullets.push({ id: Math.random(), x: e.x + (Math.random() - 0.5) * 150, y: e.y + e.size, vx: (((Math.random() - 0.5) * 2) / 6) * bulletSpeedMult, vy: ((3 + Math.random() * 3) / 6) * bulletSpeedMult, type: 'ICE' });
                  }
                } else if (patternType === 2) { // Ice Spikes
                   const spikeCount = Math.ceil((6 + stage) * bulletCountMult * 0.6);
                   for(let i=0; i<spikeCount; i++) {
                     state.enemyBullets.push({ id: Math.random(), x: (CANVAS_WIDTH / spikeCount) * i + 20, y: CANVAS_HEIGHT + 50, vx: 0, vy: -baseSpeed * 2, type: 'ICE' });
                   }
                } else { // Freezing Blast
                   const blastCount = Math.ceil((20 + stage * 5) * bulletCountMult);
                   const startAngle = Math.random() * Math.PI * 2;
                   for(let i=0; i<blastCount; i++) {
                     const angle = startAngle + (i / blastCount) * Math.PI * 2;
                     state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: Math.cos(angle) * baseSpeed * 1.5, vy: Math.sin(angle) * baseSpeed * 1.5, type: 'ICE' });
                   }
                }
              } else if (element === 'WATERFALL') {
                createFloatingText(state, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "WATERFALL!", "#1E90FF", true);
                if (patternType % 2 === 0) {
                  const waterfallCount = Math.ceil(15 * bulletCountMult);
                  for (let i = 0; i < waterfallCount; i++) {
                    state.enemyBullets.push({ id: Math.random(), x: Math.random() * CANVAS_WIDTH, y: -20, vx: 0, vy: (5 + Math.random() * 5) * bulletSpeedMult, type: 'WATERFALL' });
                  }
                } else { // Tidal Wave
                  const waveCount = Math.ceil(20 * bulletCountMult);
                  for(let i=0; i<waveCount; i++) {
                    state.enemyBullets.push({ id: Math.random(), x: (CANVAS_WIDTH / waveCount) * i, y: -50, vx: 0, vy: baseSpeed * 1.2, type: 'WATERFALL' });
                  }
                }
              } else if (element === 'WIND') {
                createFloatingText(state, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "STRONG WIND!", "#F5F5F5", true);
                const pushDir = Math.random() > 0.5 ? 1 : -1;
                state.players.forEach(p => { if (!p.isDead) p.x += pushDir * (isPhase2 ? 80 : 50); });
                state.screenShake = isPhase2 ? 20 : 10;
                // Add some wind bullets
                const windBullets = Math.ceil(10 * bulletCountMult);
                for(let i=0; i<windBullets; i++) {
                  state.enemyBullets.push({ id: Math.random(), x: pushDir > 0 ? -20 : CANVAS_WIDTH + 20, y: Math.random() * CANVAS_HEIGHT, vx: pushDir * 5, vy: 0, type: 'NORMAL' });
                }
              } else if (element === 'THUNDER') {
                createFloatingText(state, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "THUNDERSTORM!", "#FFFF00", true);
                const thunderCount = Math.ceil((isPhase2 ? 10 : 5) * bulletCountMult);
                for (let i = 0; i < thunderCount; i++) {
                  state.enemyBullets.push({ id: Math.random(), x: Math.random() * CANVAS_WIDTH, y: -50, vx: 0, vy: 12 * bulletSpeedMult, type: 'THUNDER' });
                }
              } else if (element === 'EARTHQUAKE') {
                createFloatingText(state, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "EARTHQUAKE!", "#8B4513", true);
                state.screenShake = isPhase2 ? 30 : 20;
                const rockCount = Math.ceil((isPhase2 ? 15 : 8) * bulletCountMult);
                for (let i = 0; i < rockCount; i++) {
                  state.enemyBullets.push({ id: Math.random(), x: Math.random() * CANVAS_WIDTH, y: -20, vx: (Math.random() - 0.5) * 4 * bulletSpeedMult, vy: (4 + Math.random() * 6) * bulletSpeedMult, type: 'ROCK' });
                }
              } else if (element === 'LASER') {
                createFloatingText(state, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "LASER BEAM!", "#FF00FF", true);
                if (patternType % 2 === 0) {
                  const laserCount = Math.ceil(3 * bulletCountMult);
                  for(let i=0; i<laserCount; i++) {
                    const vx = (i - (laserCount-1)/2) * 0.5 * bulletSpeedMult;
                    state.enemyBullets.push({ id: Math.random(), x: e.x + (i - (laserCount-1)/2) * 20, y: e.y + e.size, vx: vx, vy: 15 * bulletSpeedMult, type: 'LASER' });
                  }
                } else { // Rotating Lasers
                  const laserCount = Math.ceil((isPhase2 ? 8 : 4) * bulletCountMult);
                  for(let i=0; i<laserCount; i++) {
                    const angle = (i / laserCount) * Math.PI * 2 + (state.frameCount * 0.05);
                    state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: Math.cos(angle) * 10 * bulletSpeedMult, vy: Math.sin(angle) * 10 * bulletSpeedMult, type: 'LASER' });
                  }
                }
              } else if (element === 'STORM') {
                createFloatingText(state, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, "STORM VORTEX!", "#90A4AE", true);
                const stormCount = Math.ceil((isPhase2 ? 3 : 1) * bulletCountMult);
                for(let i=0; i<stormCount; i++) {
                  state.enemyBullets.push({ id: Math.random(), x: e.x + (i - (stormCount-1)/2) * 100, y: e.y + e.size, vx: 0, vy: 2 * bulletSpeedMult, type: 'STORM' });
                }
              } else {
                if (patternType === 0 || patternType === 3) {
                  const ways = Math.ceil(((1 + style) / 2) * bulletCountMult);
                  for(let i=-ways; i<=ways; i++) {
                    state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: (i * (1.5 - style * 0.1)) / 6 * bulletSpeedMult, vy: baseSpeed, type: 'NORMAL' });
                  }
                } else if (patternType === 1 || patternType === 4) {
                  const burstCount = Math.ceil(((4 + style * 2) / 2) * bulletCountMult);
                  for(let i=0; i<burstCount; i++) {
                    const angle = Math.PI/2 + (Math.random() - 0.5) * Math.PI;
                    const speed = baseSpeed * (0.8 + Math.random() * 0.4);
                    state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, type: 'NORMAL' });
                  }
                } else { // Spiral
                   const spiralCount = Math.ceil((10 + stage) * bulletCountMult);
                   for(let i=0; i<spiralCount; i++) {
                     const angle = (i / spiralCount) * Math.PI * 2 + (state.frameCount * 0.1);
                     state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y + e.size, vx: Math.cos(angle) * baseSpeed, vy: Math.sin(angle) * baseSpeed, type: 'NORMAL' });
                   }
                }
              }
            }
          }
        } else {
          if (e.type === 'SLIME') {
            e.y += e.speed * 1.5;
          } else {
            e.y += e.speed;
          }

          // Clamp enemy within screen boundaries (X only to prevent disappearing sideways)
          e.x = Math.max(e.size, Math.min(CANVAS_WIDTH - e.size, e.x));
          
          if (e.type === 'WATER') {
            e.x += Math.sin(state.frameCount / 20) * 2;
            if (state.frameCount % 400 === 0) {
              state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y, vx: 0, vy: 1.75, type: 'WATER' });
            }
          } else if (e.type === 'ARCHER') {
             if (e.y > 50 && e.y < CANVAS_HEIGHT / 2 && state.frameCount % 480 === 0) {
                const alivePlayers = state.players.filter(p => !p.isDead);
                const target = alivePlayers.length > 0 ? alivePlayers[Math.floor(Math.random() * alivePlayers.length)] : { x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT };
                const dx = target.x - e.x;
                const dy = target.y - e.y;
                const dist = Math.hypot(dx, dy) || 1;
                state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y, vx: (dx/dist) * 3, vy: (dy/dist) * 3, type: 'ARROW' });
             }
          } else if (e.type === 'FIRE') {
             if (state.frameCount % 360 === 0) {
                state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y, vx: 0, vy: 2, type: 'FIRE' });
             }
          } else if (e.type === 'ICE') {
             if (state.frameCount % 600 === 0) {
                state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y, vx: Math.random() - 0.5, vy: 1.5, type: 'ICE' });
             }
          } else if (e.type === 'POISON') {
             if (state.frameCount % 480 === 0) {
                state.enemyBullets.push({ id: Math.random(), x: e.x, y: e.y, vx: 0, vy: 1, type: 'POISON' });
             }
          } else if (e.type === 'BOMB') {
             e.speed = ENEMY_SPEED * 0.75;
          }
        }
      });
      
      if (state.freezeTime > 0) state.freezeTime--;
      state.players.forEach(p => {
        if (p.isDead) return;
        
        let magnetRange = state.squadSkills.magnetRange;
        let magnetSpeed = state.squadSkills.magnetRange > 0 ? 5 : 0;
        
        if (p.magnetTime > 0) {
           p.magnetTime--;
           magnetRange = Math.max(magnetRange, 600);
           magnetSpeed = Math.max(magnetSpeed, 12);
        } else if (p.character === 'rat') {
           magnetRange = Math.max(magnetRange, 150);
           magnetSpeed = Math.max(magnetSpeed, 5);
        }
        
        if (magnetRange > 0) {
           state.items.forEach(item => {
              const dx = p.x - item.x;
              const dy = p.y - item.y;
              const dist = Math.hypot(dx, dy);
              if (dist < magnetRange) {
                 item.x += (dx / dist) * magnetSpeed;
                 item.y += (dy / dist) * magnetSpeed;
              }
           });
        }
      });
      
      state.gates.forEach(g => {
        g.y += SCROLL_SPEED;
        if (g.hitFlash && g.hitFlash > 0) g.hitFlash--;
      });
      state.items.forEach(i => i.y += i.speed);

      state.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.05; });
      state.particles = state.particles.filter(p => p.life > 0);

      state.players.forEach(p => {
        if (p.isDead) return;
        if (p.ammoTimer > 0) {
          p.ammoTimer--;
          if (p.ammoTimer <= 0) p.ammoType = 'NORMAL';
        }
        if (p.critTimer > 0) {
          p.critTimer--;
        }
      });

      // 5. Fire Bullets
      if (state.feverTime > 0) state.feverTime--;
      
      state.players.forEach(p => {
        if (p.isDead || p.count <= 0 || p.playerFreezeTimer > 0) return;
        let calculatedFireRate = Math.max(5, FIRE_RATE - Math.floor(p.count / 20));
        if (p.character === 'cat') calculatedFireRate = Math.max(3, Math.floor(calculatedFireRate * 0.9)); // Cat passive: +10% attack speed
        calculatedFireRate = Math.max(4, Math.floor(calculatedFireRate * Math.pow(1 - LEVEL_UP_ATTACK_SPEED_INCREASE, (upgradesRef.current.attackSpeed || 0) + state.squadSkills.attackSpeed + state.squadSkills.ghostBullets))); // 5% faster per level
        calculatedFireRate = Math.max(2, Math.floor(calculatedFireRate / PLAYER_ATTACK_SPEED_MULTIPLIER)); // Apply global multiplier
        const currentFireRate = state.feverTime > 0 ? Math.max(2, Math.floor(calculatedFireRate / FEVER_ATTACK_SPEED_MULTIPLIER)) : calculatedFireRate;
        
        if (state.frameCount % currentFireRate === 0) {
          playSound('shoot');
          // Stage logic based on user request:
          const playerStage = getPlayerStage(p.count);

          const scale = 1 + playerStage * 0.1; 
          const currentCatSize = CAT_SIZE * scale;

          // Bullet count increases with count, but they come from the single character
          const bulletCount = Math.max(1, Math.min(Math.floor(p.count / BULLET_COUNT_HP_THRESHOLD) + 1, 12)) + state.squadSkills.multiShot + (upgradesRef.current.multiShot || 0);
          const effectiveHpForDamage = Math.max(PLAYER_MIN_DAMAGE_HP_EQUIVALENT, p.count);
          const damageMultiplier = Math.max(1, (effectiveHpForDamage / bulletCount) * BULLET_DAMAGE_HP_SCALING) * (1 + (upgradesRef.current.damageUp || 0) * 0.05) * Math.pow(1.2, state.squadSkills.damageUp) * PLAYER_DAMAGE_MULTIPLIER;
          const baseCritChance = (state.squadSkills.critChance + (upgradesRef.current.critChance || 0)) / 100;
          const isCritItemActive = p.critTimer > 0;
          const totalCritChance = isCritItemActive ? 0.5 + baseCritChance : baseCritChance;
          
          const isCrit = Math.random() < totalCritChance;
          let critMultiplier = isCrit ? 2 : 1;
          if (isCrit && p.character === 'rat') critMultiplier *= 1.05; // Mouse(Rat) passive: +5% critical damage

          // Spread bullets in a circular arc
          const maxSpreadWidth = CANVAS_WIDTH * BULLET_MAX_SPREAD_RATIO;
          const arcAngle = Math.min(Math.PI / 2, (bulletCount - 1) * 0.15); // Max 90 degree arc
          
          const circleRadius = currentCatSize * PLAYER_CIRCLE_SCALE;
          for (let i = 0; i < bulletCount; i++) {
            let offsetX = 0;
            let offsetY = 0;
            
            if (bulletCount > 1) {
              const angle = -Math.PI / 2 + (i - (bulletCount - 1) / 2) * (arcAngle / (bulletCount - 1));
              const radius = circleRadius;
              offsetX = Math.cos(angle) * radius;
              offsetY = Math.sin(angle) * radius + radius; // Adjust so it's relative to top
            }

            // Clamp horizontal spread
            const finalX = Math.max(p.x - maxSpreadWidth / 2, Math.min(p.x + maxSpreadWidth / 2, p.x + offsetX));

            state.bullets.push({
              id: Math.random(),
              x: finalX,
              y: p.y - circleRadius + offsetY + BULLET_SPAWN_OFFSET_Y,
              damage: (state.feverTime > 0 ? FEVER_DAMAGE_MULTIPLIER : 1) * damageMultiplier * critMultiplier * 1.5 * BULLET_POWER_MULTIPLIER * (p.character === 'dog' ? 1.1 : 1),
              type: p.ammoType,
              isCrit: isCrit,
              rabbitPierce: p.character === 'rabbit',
              pierceCount: state.squadSkills.pierce + state.squadSkills.ghostBullets + (upgradesRef.current.pierce || 0),
              hitEnemies: [],
              size: GIANT_BULLET_BASE_SIZE * (1 + state.squadSkills.bulletSize * LEVEL_UP_BULLET_SIZE_INCREASE + (upgradesRef.current.bulletSize || 0) * GIANT_BULLET_UPGRADE_SCALING)
            });
          }
        }
      });

      // 5.5 Update and Fire Drones
      state.players.forEach(p => {
        if (p.isDead) return;
        state.drones.forEach((d, index) => {
          const targetAngle = (state.frameCount * 0.05) + (index * (Math.PI * 2 / Math.max(1, state.drones.length)));
          d.angle = targetAngle;
          const droneX = p.x + Math.cos(d.angle) * 45;
          const droneY = p.y + Math.sin(d.angle) * 45;

          const currentDroneFireRate = Math.max(1, Math.floor(DRONE_BASE_FIRE_RATE / DRONE_ATTACK_SPEED_MULTIPLIER));
          if (state.frameCount % currentDroneFireRate === 0 && state.enemies.length > 0) {
            state.bullets.push({ 
              x: droneX, 
              y: droneY, 
              damage: 2 * (1 + (upgradesRef.current.damageUp || 0) * 0.05) * Math.pow(1.2, state.squadSkills.damageUp) * (p.critTimer > 0 ? 2 : 1) * BULLET_POWER_MULTIPLIER * (p.character === 'dog' ? 1.1 : 1),
              id: Math.random(),
              type: p.ammoType,
              isCrit: p.critTimer > 0,
              rabbitPierce: p.character === 'rabbit',
              pierceCount: state.squadSkills.pierce + state.squadSkills.ghostBullets + (upgradesRef.current.pierce || 0),
              hitEnemies: [],
              size: HOMING_BULLET_BASE_SIZE * (1 + state.squadSkills.bulletSize * LEVEL_UP_BULLET_SIZE_INCREASE + (upgradesRef.current.bulletSize || 0) * 0.1)
            });
          }
        });
      });

      // 6. Collisions

      // Bullet vs Enemy
      for (let i = state.bullets.length - 1; i >= 0; i--) {
        const b = state.bullets[i];
        let bulletDestroyed = false;

        // Check Gates first
        for (let k = state.gates.length - 1; k >= 0; k--) {
          const g = state.gates[k];
          if (b.hitGates && b.hitGates.includes(g.id)) continue;
          if (b.x > g.x && b.x < g.x + g.width && b.y > g.y && b.y < g.y + g.height) {
            g.hits += b.damage;
            g.hitFlash = 5;
            playSound('hit');
            
            if (!b.hitGates) b.hitGates = [];
            b.hitGates.push(g.id);

            const pierceProb = b.pierceCount > 0 ? PIERCE_BASE_PROBABILITY + (b.pierceCount - 1) * PIERCE_PROBABILITY_PER_LEVEL : (b.rabbitPierce ? 0.1 : 0);
            const doesPierce = Math.random() < (b.rabbitPierce && b.pierceCount > 0 ? pierceProb + 0.1 : pierceProb);

            if (!doesPierce) {
              state.bullets.splice(i, 1);
              bulletDestroyed = true;
            }
            createParticles(state, b.x, b.y, '#FFF', 3);
            
            // Improve gate based on hits
            const hitsNeeded = getHitsNeeded(g.type, g.value, totalCount, state.stage);
            if (g.hits >= hitsNeeded) {
              if (g.type === 'DIV') {
                if (g.value === 2) {
                  g.value = 1.5;
                  g.hits = 0;
                  createParticles(state, g.x + g.width/2, g.y + g.height/2, '#FF6B6B', 30);
                } else {
                  state.gates.splice(k, 1);
                  createParticles(state, g.x + g.width/2, g.y + g.height/2, '#FF6B6B', 50);
                }
              } else if (g.type === 'FREEZE' || g.type === 'FIRE' || g.type === 'SHIELD' || g.type === 'DRONE') {
                // Spawn corresponding item
                const itemType = g.type;
                
                state.items.push({ id: Math.random(), x: g.x + g.width/2, y: g.y + g.height/2, type: itemType, speed: 2 });
                state.gates.splice(k, 1);
                createParticles(state, g.x + g.width/2, g.y + g.height/2, '#FFFF00', 50);
                playSound('powerup');
              } else {
                const improvements = Math.floor(g.hits / hitsNeeded);
                g.hits = g.hits % hitsNeeded;
                for (let imp = 0; imp < improvements; imp++) {
                  if (g.type === 'SUB') {
                     g.value -= 1;
                     if (g.value <= 0) {
                       g.type = 'ADD';
                       g.value = 1;
                       createParticles(state, g.x + g.width/2, g.y + g.height/2, '#4ECDC4', 30);
                     }
                  } else if (g.type === 'ADD') {
                     g.value += 1;
                     createParticles(state, g.x + g.width/2, g.y + g.height/2, '#4ECDC4', 15);
                     createFloatingText(state, g.x + g.width/2, g.y, "UP!", "#4ECDC4");
                  } else if (g.type === 'MULT') {
                     if (g.value < 2) {
                       g.value += 1;
                       createParticles(state, g.x + g.width/2, g.y + g.height/2, '#FFD700', 25);
                       createFloatingText(state, g.x + g.width/2, g.y, `x${g.value}!`, "#FFD700");
                     } else {
                       g.hits = hitsNeeded;
                     }
                  }
                }
              }
            }
            break;
          }
        }

        if (bulletDestroyed) continue;

        for (let j = state.enemies.length - 1; j >= 0; j--) {
          const e = state.enemies[j];
          if (b.hitEnemies.includes(e.id)) continue;
          
          const dist = Math.hypot(b.x - e.x, b.y - e.y);
          if (dist < e.size + b.size) {
            e.hp -= b.damage;
            e.hitFlash = 5;
            
            // Vampiric Bullets
            if (state.squadSkills.vampiricBullets > 0) {
              const healAmount = b.damage * 0.01 * state.squadSkills.vampiricBullets;
              state.players.forEach(p => {
                if (!p.isDead) {
                  p.count = Math.min(PLAYER_MAX_HP + state.squadSkills.maxHp, p.count + healAmount);
                }
              });
            }

            if (b.type === 'FIRE') e.fireTimer = CHAR_FIRE_DURATION;
            if (b.type === 'POISON') e.poisonTimer = CHAR_POISON_DURATION;
            if (b.type === 'ICE') e.freezeTimer = CHAR_ICE_DURATION;
            
            playSound('hit');
            b.hitEnemies.push(e.id);
            
            // Explosive Bullets
            if (state.squadSkills.explosiveBullets > 0 && Math.random() < 0.05 * state.squadSkills.explosiveBullets) {
              createParticles(state, e.x, e.y, '#FF4500', 20);
              state.enemies.forEach(enemy => {
                if (Math.hypot(enemy.x - e.x, enemy.y - e.y) < 100) {
                  enemy.hp -= b.damage * 0.5;
                }
              });
            }

            const pierceProb = b.pierceCount > 0 ? PIERCE_BASE_PROBABILITY + (b.pierceCount - 1) * PIERCE_PROBABILITY_PER_LEVEL : (b.rabbitPierce ? 0.1 : 0);
            const doesPierce = Math.random() < (b.rabbitPierce && b.pierceCount > 0 ? pierceProb + 0.1 : pierceProb);

            if (!doesPierce) {
              state.bullets.splice(i, 1);
              bulletDestroyed = true;
            }
            createParticles(state, b.x, b.y, b.type === 'FIRE' ? '#FF4500' : b.type === 'POISON' ? '#22c55e' : b.type === 'ICE' ? '#00FFFF' : b.type === 'HOMING' ? '#FF00FF' : '#FFF', 3);
            if (b.isCrit) createFloatingText(state, b.x, b.y, "CRIT!", "#FFD700");
            
            if (e.hp <= 0) {
              playSound('explosion');
              state.kills++;
              state.combo++;
              state.comboTimer = 120; // 2 seconds
              if (state.combo > 0 && state.combo % FEVER_COMBO_THRESHOLD === 0) {
                 state.feverTime = 300;
                 createFloatingText(state, e.x, e.y - 40, "FEVER MODE!", "#FFFF00");
                 playSound('fever');
                 createParticles(state, e.x, e.y, '#FFFF00', 30);
              }
              const scoreGained = Math.ceil(e.maxHp) * state.combo;
              state.score += scoreGained;
              const coinsGained = e.type === 'BOSS' ? 10 : 1;
              state.coins += coinsGained;
              createFloatingText(state, e.x, e.y, `+${scoreGained} (x${state.combo})`, "#FFD700");
              createParticles(state, e.x, e.y, '#FF6B6B', e.type === 'BOSS' ? 50 : 15);
              
              if (e.type === 'BOMB') {
                 createParticles(state, e.x, e.y, '#FF0000', 50);
                 playSound('explosion');
                 // Bomb damages player if too close
                 let droneAbsorbed = false;
                 state.players.forEach(p => {
                    if (p.isDead) return;
                    const playerStage = getPlayerStage(p.count);
                    const scale = 1 + playerStage * 0.1;
                    const currentCatSize = CAT_SIZE * scale;
                    const playerRadius = currentCatSize * HITBOX_SCALE; // Hitbox set to HITBOX_SCALE of visual size
                    if (Math.hypot(p.x - e.x, p.y - e.y) < playerRadius + 80) {
                      if (p.shield > 0) {
                         p.shield--;
                      } else {
                         let damage = ENEMY_BOMB_DAMAGE;
                         if (state.drones.length > 0 && !droneAbsorbed) {
                           state.drones.pop();
                           droneAbsorbed = true;
                           damage = Math.max(0, damage - 5);
                           createFloatingText(state, p.x, p.y, "DRONE ABSORBED!", "#00FFFF");
                           createParticles(state, p.x, p.y, "#00FFFF", 20);
                         } else if (droneAbsorbed) {
                           damage = Math.max(0, damage - 5);
                         }
                         p.count -= damage;
                         playSound('hit');
                         if (damage > 0) createFloatingText(state, p.x, p.y, `-${damage} (BOMB)`, "#FF0000");
                      }
                    }
                 });
              }
              
              if (e.type === 'BOSS') {
                state.bossActive = false;
                state.bossDefeated = true;
                state.bossDefeatedTimer = 120; // 2 seconds destruction effect
                state.score += (1000 * state.combo) * (1 + state.squadSkills.scoreMult * 0.5);
                state.screenShake = 30; // Stronger shake
                createFloatingText(state, e.x, e.y - 30, "BOSS DEFEATED!", "#FFD700");
                createParticles(state, e.x, e.y, '#FF4500', 100); // Massive explosion
                playSound('explosion');
                playSound('boss');
                vibrate([100, 100, 100]);

                // Clear other enemies immediately to prevent Game Over during boss explosion
                state.enemies = state.enemies.filter(enemy => enemy.id === e.id);
                state.enemyBullets = [];
                state.spawnQueue = [];
                
                // Boss drops items based on constants
                const itemTypes: Array<'FEVER' | 'BOMB' | 'DRONE' | 'SHIELD' | 'MAGNET' | 'FREEZE' | 'CRIT' | 'FIRE' | 'POISON_AMMO' | 'ICE_AMMO' | 'HOMING_AMMO' | 'COIN' | 'HEART'> = 
                  ['FEVER', 'BOMB', 'DRONE', 'SHIELD', 'MAGNET', 'FREEZE', 'CRIT', 'FIRE', 'POISON_AMMO', 'ICE_AMMO', 'HOMING_AMMO', 'COIN', 'HEART'];
                
                for (let k = 0; k < BOSS_MAX_REWARDS; k++) {
                  if (Math.random() < BOSS_REWARD_PROBABILITY) {
                    const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
                    state.items.push({ 
                      id: Math.random(), 
                      x: e.x + (Math.random() - 0.5) * 100, 
                      y: e.y + (Math.random() - 0.5) * 100, 
                      type: randomType,
                      speed: 2
                    });
                  }
                }
              }
              state.enemies.splice(j, 1);
            }
            if (bulletDestroyed) break;
          }
        }
      }

      // Player vs Enemy
      for (let j = state.enemies.length - 1; j >= 0; j--) {
        const e = state.enemies[j];
        let enemyRemoved = false;
        let droneAbsorbedThisEnemy = false;
        state.players.forEach(p => {
          if (p.isDead || enemyRemoved) return;
          const playerStage = getPlayerStage(p.count);
          const scale = 1 + playerStage * 0.1;
          const currentCatSize = CAT_SIZE * scale;
          const playerRadius = currentCatSize * HITBOX_SCALE; // Hitbox set to HITBOX_SCALE of visual size
          
          const dist = Math.hypot(p.x - e.x, p.y - e.y);
          if (dist < playerRadius + e.size) {
            if (e.type === 'BOSS') {
              if (state.frameCount % 10 === 0) {
                let damage = 10;
                if (state.drones.length > 0 && !droneAbsorbedThisEnemy) {
                  state.drones.pop();
                  droneAbsorbedThisEnemy = true;
                  damage = Math.max(0, damage - 5);
                  createFloatingText(state, p.x, p.y, "DRONE ABSORBED!", "#00FFFF");
                  createParticles(state, p.x, p.y, "#00FFFF", 20);
                } else if (droneAbsorbedThisEnemy) {
                  damage = Math.max(0, damage - 5);
                }
                p.count -= damage;
                vibrate(50);
                playSound('hit');
                createParticles(state, p.x, p.y, '#FFA500', 10);
                if (damage > 0) createFloatingText(state, p.x, p.y, `-${damage}`, "#FF0000");
                state.screenShake = 5;
              }
            } else {
              const damage = Math.ceil(e.hp);
              if (p.shield > 0) {
                p.shield--;
                e.hp -= damage;
                createParticles(state, p.x, p.y, '#0000FF', 10);
                createFloatingText(state, p.x, p.y, "BLOCKED!", "#0000FF");
              } else {
                if (e.type === 'FIRE') {
                  p.fireTimer = ENEMY_FIRE_DURATION; // 6 seconds
                } else if (e.type === 'POISON') {
                  p.poisonTimer = ENEMY_POISON_DURATION; // 15 seconds
                } else if (e.type === 'ICE') {
                  p.playerFreezeTimer = ENEMY_ICE_DURATION; // 2 seconds
                }
                
                let finalDamage = damage;
                if (state.drones.length > 0 && !droneAbsorbedThisEnemy) {
                  state.drones.pop();
                  droneAbsorbedThisEnemy = true;
                  finalDamage = Math.max(0, damage - 5);
                  createFloatingText(state, p.x, p.y, "DRONE ABSORBED!", "#00FFFF");
                  createParticles(state, p.x, p.y, "#00FFFF", 20);
                } else if (droneAbsorbedThisEnemy) {
                  finalDamage = Math.max(0, damage - 5);
                }
                
                p.count -= finalDamage;
                vibrate(50);
                playSound('hit');
                e.hp -= damage;
                createParticles(state, p.x, p.y, '#FFA500', 10);
                if (finalDamage > 0) createFloatingText(state, p.x, p.y, `-${finalDamage}`, "#FF0000");
                state.screenShake = 3;
              }
              if (e.hp <= 0) {
                state.kills++;
                if (e.type === 'BOMB') {
                   createParticles(state, e.x, e.y, '#FF0000', 50);
                   playSound('explosion');
                   // Bomb damages all nearby players
                   let droneAbsorbed = false;
                   state.players.forEach(p_inner => {
                      if (p_inner.isDead) return;
                      const playerStage_inner = getPlayerStage(p_inner.count);
                      const scale_inner = 1 + playerStage_inner * 0.1;
                      const currentCatSize_inner = CAT_SIZE * scale_inner;
                      const playerRadius_inner = currentCatSize_inner * HITBOX_SCALE;
                      
                      if (Math.hypot(p_inner.x - e.x, p_inner.y - e.y) < playerRadius_inner + 80) {
                         if (p_inner.shield > 0) {
                            p_inner.shield--;
                         } else {
                            let damage = ENEMY_BOMB_DAMAGE;
                            if (state.drones.length > 0 && !droneAbsorbed) {
                              state.drones.pop();
                              droneAbsorbed = true;
                              damage = Math.max(0, damage - 5);
                              createFloatingText(state, p_inner.x, p_inner.y, "DRONE ABSORBED!", "#00FFFF");
                              createParticles(state, p_inner.x, p_inner.y, "#00FFFF", 20);
                            } else if (droneAbsorbed) {
                              damage = Math.max(0, damage - 5);
                            }
                            p_inner.count -= damage;
                            vibrate(50);
                            playSound('hit');
                            if (damage > 0) createFloatingText(state, p_inner.x, p_inner.y, `-${damage} (BOMB)`, "#FF0000");
                         }
                      }
                   });
                }
                enemyRemoved = true;
              }
            }
          }
        });
        if (enemyRemoved) state.enemies.splice(j, 1);
      }

      // Player vs Enemy Bullets
      for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
        const b = state.enemyBullets[i];
        let hit = false;
        let droneAbsorbed = false;
        state.players.forEach(p => {
          if (p.isDead || hit) return;
          const playerStage = getPlayerStage(p.count);
          const scale = 1 + playerStage * 0.1;
          const currentCatSize = CAT_SIZE * scale;
          const playerRadius = currentCatSize * HITBOX_SCALE; // Hitbox set to HITBOX_SCALE of visual size
          
          const dist = Math.hypot(p.x - b.x, p.y - b.y);
          if (dist < playerRadius + 5) {
            hit = true;
            if (p.shield > 0) {
              p.shield--;
              createParticles(state, b.x, b.y, '#0000FF', 10);
              createFloatingText(state, p.x, p.y, "BLOCKED!", "#0000FF");
            } else {
              let damage = Math.round(2 * BOSS_DAMAGE_MULTIPLIER);
              if (b.type === 'FIRE') {
                damage = Math.round(3 * BOSS_DAMAGE_MULTIPLIER);
                p.fireTimer = ENEMY_FIRE_DURATION; // 6 seconds
              }
              else if (b.type === 'LASER') {
                damage = Math.round(3 * BOSS_DAMAGE_MULTIPLIER);
              }
              else if (b.type === 'BOMB') damage = Math.round(ENEMY_BOMB_DAMAGE * BOSS_DAMAGE_MULTIPLIER);
              else if (b.type === 'POISON') {
                damage = Math.round(4 * BOSS_DAMAGE_MULTIPLIER);
                p.poisonTimer = ENEMY_POISON_DURATION; // 15 seconds
              }
              else if (b.type === 'ICE') {
                p.playerFreezeTimer = ENEMY_ICE_DURATION; // 2 seconds
                createFloatingText(state, p.x, p.y, "FROZEN!", "#00FFFF");
              }
              else if (b.type === 'ELECTRIC' || b.type === 'THUNDER') {
                p.playerFreezeTimer = ENEMY_STUN_DURATION; // 0.5 seconds stun
                createFloatingText(state, p.x, p.y, "STUNNED!", "#FFFF00");
              }
              else if (b.type === 'WATERFALL') {
                damage = Math.round(1 * BOSS_DAMAGE_MULTIPLIER);
                p.y += 10; // Extra push on hit (reduced)
              }
              else if (b.type === 'ROCK') {
                damage = Math.round(5 * BOSS_DAMAGE_MULTIPLIER);
                state.screenShake = 10;
              }
              
              let finalDamage = damage;
              if (state.drones.length > 0 && !droneAbsorbed) {
                state.drones.pop();
                droneAbsorbed = true;
                finalDamage = Math.max(0, damage - 5);
                createFloatingText(state, p.x, p.y, "DRONE ABSORBED!", "#00FFFF");
                createParticles(state, p.x, p.y, "#00FFFF", 20);
              } else if (droneAbsorbed) {
                finalDamage = Math.max(0, damage - 5);
              }
              
              p.count -= finalDamage;
              vibrate(50);
              playSound('hit');
              createParticles(state, b.x, b.y, '#FF0000', 5);
              if (finalDamage > 0) createFloatingText(state, p.x, p.y, `-${finalDamage}`, "#FF0000");
              state.screenShake = finalDamage;
            }
          }
        });
        if (hit) state.enemyBullets.splice(i, 1);
      }

      // Player vs Item
      for (let i = state.items.length - 1; i >= 0; i--) {
        const item = state.items[i];
        let hit = false;
        state.players.forEach(p => {
          if (p.isDead || hit) return;
          const playerStage = getPlayerStage(p.count);
          const scale = 1 + playerStage * 0.1;
          const currentCatSize = CAT_SIZE * scale;
          const playerRadius = currentCatSize * HITBOX_SCALE; // Hitbox set to HITBOX_SCALE of visual size
          
          const dist = Math.hypot(p.x - item.x, p.y - item.y);
          if (dist < playerRadius + 15) {
            hit = true;
            playSound('powerup');
            if (item.type === 'FEVER') {
              vibrate([50, 30, 50]);
              state.feverTime = 300 + state.squadSkills.feverDuration; // 5 seconds fever + bonus
              playSound('fever');
              if (p.count < PLAYER_MAX_HP + state.squadSkills.maxHp) {
                 p.count++;
                 createFloatingText(state, item.x, item.y - 20, "+1", "#4ECDC4");
              }
              createParticles(state, item.x, item.y, '#FFFF00', 20);
              createFloatingText(state, item.x, item.y, "FEVER!", "#FFFF00");
            } else if (item.type === 'BOMB') {
              vibrate(100);
              if (p.bombCount < MAX_BOMBS) {
                p.bombCount++;
                createFloatingText(state, p.x, p.y - 40, "BOMB ACQUIRED!", "#FF0000");
              } else {
                createFloatingText(state, p.x, p.y - 40, "MAX BOMBS!", "#FF6B6B");
              }
              playSound('powerup');
            } else if (item.type === 'DRONE') {
              if (state.drones.length < MAX_DRONES) {
                state.drones.push({ angle: Math.random() * Math.PI * 2, id: Math.random() });
                createFloatingText(state, p.x, p.y, "DRONE ACQUIRED!", "#00FFFF");
              } else {
                createFloatingText(state, p.x, p.y, "MAX DRONES!", "#FF6B6B");
              }
            } else if (item.type === 'SHIELD') {
              const shieldGain = (1 + state.squadSkills.shieldDuration);
              if (p.shield < MAX_SHIELDS) {
                p.shield = Math.min(MAX_SHIELDS, p.shield + shieldGain);
                createFloatingText(state, p.x, p.y, `SHIELD +${shieldGain}`, "#0000FF");
              } else {
                createFloatingText(state, p.x, p.y, "MAX SHIELDS!", "#FF6B6B");
              }
            } else if (item.type === 'MAGNET') {
              p.magnetTime = 600;
              createFloatingText(state, p.x, p.y, "MAGNET!", "#FF00FF");
            } else if (item.type === 'FREEZE') {
              state.freezeTime = 200;
              createFloatingText(state, p.x, p.y, "FREEZE!", "#00FFFF");
            } else if (item.type === 'CRIT') {
              p.critTimer = 600; // 10 seconds
              createFloatingText(state, p.x, p.y, "CRITICAL HIT!", "#FFD700");
            } else if (item.type === 'FIRE') {
              p.ammoType = 'FIRE';
              p.ammoTimer = 600;
              createFloatingText(state, p.x, p.y, "FIRE!", "#FF4500");
            } else if (item.type === 'POISON_AMMO') {
              p.ammoType = 'POISON';
              p.ammoTimer = 600;
              createFloatingText(state, p.x, p.y, "POISON AMMO!", "#22c55e");
            } else if (item.type === 'ICE_AMMO') {
              p.ammoType = 'ICE';
              p.ammoTimer = 600;
              createFloatingText(state, p.x, p.y, "ICE AMMO!", "#00FFFF");
            } else if (item.type === 'HOMING_AMMO') {
              p.ammoType = 'HOMING';
              p.ammoTimer = 600;
              createFloatingText(state, p.x, p.y, "HOMING AMMO!", "#FF00FF");
            } else if (item.type === 'COIN') {
              vibrate(10);
              state.coins += 1;
              createFloatingText(state, item.x, item.y, "+1", "#FFD700");
            } else if (item.type === 'HEART') {
              state.players.forEach(p => {
                if (!p.isDead && p.count < PLAYER_MAX_HP + state.squadSkills.maxHp) {
                  p.count = Math.min(PLAYER_MAX_HP + state.squadSkills.maxHp, p.count + 20);
                  createFloatingText(state, p.x, p.y, "+20 HP", "#4ECDC4");
                }
              });
            }
            if (item.type === 'BOMB') playSound('explosion');
            else if (item.type === 'DRONE') playSound('shoot');
            else if (item.type === 'CRIT') playSound('hit');
            else playSound('powerup');
          }
        });
        if (hit) state.items.splice(i, 1);
      }

      // Player vs Gate
      for (let i = state.gates.length - 1; i >= 0; i--) {
        const g = state.gates[i];
        let hit = false;
        state.players.forEach(p => {
          if (p.isDead || hit) return;
          if (p.x > g.x && p.x < g.x + g.width && p.y > g.y && p.y < g.y + g.height) {
            hit = true;
            const oldCount = p.count;
            if (g.type === 'ADD') {
               p.count += g.value;
            } else if (g.type === 'MULT') {
               p.count *= g.value;
            } else if (g.type === 'DIV') {
               p.count = Math.max(1, Math.floor(p.count / g.value));
            } else if (g.type === 'SUB') {
               p.count = Math.max(1, p.count - g.value);
            } else {
               // Special gates are now shootable obstacles, ignore collision
               hit = false;
               return;
            }
            
            if (g.type === 'ADD' || g.type === 'MULT' || g.type === 'DIV' || g.type === 'SUB') {
                p.count = Math.max(1, Math.min(PLAYER_MAX_HP + state.squadSkills.maxHp, Math.floor(p.count)));
            }
            const diff = (g.type === 'ADD' || g.type === 'MULT' || g.type === 'DIV' || g.type === 'SUB') ? p.count - oldCount : 0;
            
            const gateY = g.y;
            state.gates = state.gates.filter(gate => Math.abs(gate.y - gateY) > 10);
            createParticles(state, p.x, p.y, '#4ECDC4', 20);
            
            if (diff !== 0) {
              const text = diff > 0 ? `+${diff}` : `${diff}`;
              const color = diff > 0 ? '#4ECDC4' : '#FF6B6B';
              createFloatingText(state, p.x, p.y - 20, text, color);
            }
          }
        });
        if (hit) break;
      }

      state.players.forEach(p => {
        p.count = Math.max(0, Math.min(PLAYER_MAX_HP + state.squadSkills.maxHp, Math.floor(p.count)));
        
        // Trigger Fever Mode if character is at stage 5 (Level 5)
        if (getPlayerStage(p.count) === 4 && state.feverTime < 60) {
          state.feverTime = 300 + state.squadSkills.feverDuration;
        }

        if (p.count <= 0) p.isDead = true;
        // Global clamping to prevent getting stuck out of bounds from external forces
        p.x = Math.max(20, Math.min(CANVAS_WIDTH - 20, p.x));
        p.y = Math.max(20, Math.min(CANVAS_HEIGHT - 20, p.y));
      });
      if (state.players.every(p => p.isDead)) {
         vibrate([100, 50, 100, 50, 200]);
         state.status = 'GAME_OVER';
         setFinalScore(state.score);
         if (state.score > highScore) {
           setHighScore(state.score);
         }
         saveRecord(state.score, state.stage);
         updateStatsAndSave(state.score, state.coins, state.kills, state.stage, state);
         setReactStateStatus('GAME_OVER');
      }

      // Cleanup offscreen & Game Over check
      for (const e of state.enemies) {
        if (e.y > CANVAS_HEIGHT && !state.bossDefeated) {
          state.status = 'GAME_OVER';
          setFinalScore(state.score);
          if (state.score > highScore) {
            setHighScore(state.score);
          }
          saveRecord(state.score, state.stage);
          updateStatsAndSave(state.score, state.coins, state.kills, state.stage, state);
          playSound('explosion');
          setReactStateStatus('GAME_OVER');
          return;
        }
      }
      state.enemies = state.enemies.filter(e => e.y < CANVAS_HEIGHT + 50 && e.hp > 0);
      state.gates = state.gates.filter(g => g.y < CANVAS_HEIGHT + 50);
      state.items = state.items.filter(i => i.y < CANVAS_HEIGHT + 50);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const state = gameState.current;
      
      if (state.gameCleared) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw Ending Background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw Victory Pose Image
        const victoryImg = assetsRef.current?.victoryPose;
        if (victoryImg) {
          ctx.drawImage(victoryImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        }
        
        // Draw Staff Roll (Credits)
        const creditsY = CANVAS_HEIGHT - (1800 - state.creditsTimer) * 0.5;
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 24px Inter';
        ctx.textAlign = 'center';
        const credits = [
          "THE ULTIMATE VOID DEFEATED!",
          "",
          "CONGRATULATIONS",
          "",
          "STAFF",
          "Director: AI Studio",
          "Artist: AI Studio",
          "Programmer: AI Studio",
          "",
          "THANK YOU FOR PLAYING!"
        ];
        credits.forEach((line, i) => {
          ctx.fillText(line, CANVAS_WIDTH / 2, creditsY + i * 50);
        });
        
        state.creditsTimer--;
        if (state.creditsTimer <= 0) {
          state.status = 'START';
          state.gameCleared = false;
        }
        return;
      }

      if (state.status === 'START') {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        // Draw a simple background even in start screen
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        return;
      }

      ctx.save();
      
      // Screen Shake
      if (state.screenShake > 0) {
        const dx = (Math.random() - 0.5) * state.screenShake;
        const dy = (Math.random() - 0.5) * state.screenShake;
        ctx.translate(dx, dy);
        state.screenShake *= 0.9;
        if (state.screenShake < 0.5) state.screenShake = 0;
      }

      // Background
      const currentStageIndex = Math.min(STAGES.length - 1, state.stage - 1);
      const bossData = STAGES[currentStageIndex].boss;
      const bgImg = assetsRef.current?.backgrounds[currentStageIndex];
      
      if (bgImg) {
        const scrollSpeed = 1.5;
        const scrollY = (state.frameCount * scrollSpeed) % CANVAS_HEIGHT;
        
        // Draw two images for seamless scrolling
        ctx.drawImage(bgImg, 0, scrollY, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.drawImage(bgImg, 0, scrollY - CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        // Fallback Gradient Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        bgGrad.addColorStop(0, bossData.bg);
        bgGrad.addColorStop(1, '#000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      // Boss Defeated Transition Effect
      if (state.bossDefeated) {
        const alpha = 1 - (state.bossDefeatedTimer / 60);
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 48px Inter';
        ctx.textAlign = 'center';
        ctx.fillText("STAGE CLEAR", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      }

      // Draw Gates
      state.gates.forEach(g => {
        const isHit = g.hitFlash && g.hitFlash > 0;
        
        const isNegative = (g.type === 'SUB' || g.type === 'DIV');
        const isSpecial = (g.type === 'FREEZE' || g.type === 'FIRE' || g.type === 'SHIELD' || g.type === 'DRONE');

        // 3D Thickness (Bottom face)
        if (isNegative) ctx.fillStyle = 'rgba(150, 0, 0, 0.8)';
        else if (isSpecial) ctx.fillStyle = 'rgba(100, 100, 0, 0.8)';
        else ctx.fillStyle = 'rgba(0, 100, 100, 0.8)';
        ctx.fillRect(g.x, g.y + 15, g.width, g.height);

        // Main Face
        if (isNegative) ctx.fillStyle = isHit ? 'rgba(255, 150, 150, 0.9)' : 'rgba(255, 107, 107, 0.9)';
        else if (isSpecial) ctx.fillStyle = isHit ? 'rgba(255, 255, 150, 0.9)' : 'rgba(200, 200, 0, 0.9)';
        else ctx.fillStyle = isHit ? 'rgba(150, 255, 255, 0.9)' : 'rgba(78, 205, 196, 0.9)';
        ctx.fillRect(g.x, g.y, g.width, g.height);
        
        ctx.strokeStyle = isNegative ? '#FF6B6B' : (isSpecial ? '#FFFF00' : '#4ECDC4');
        if (isHit) ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 4;
        ctx.strokeRect(g.x, g.y, g.width, g.height);
        
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 28px Inter'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        
        let text = '';
        if (g.type === 'MULT') text = `×${g.value}`;
        else if (g.type === 'DIV') text = `÷${g.value}`;
        else if (g.type === 'ADD') text = `+${g.value}`;
        else if (g.type === 'SUB') text = `-${g.value}`;
        else if (g.type === 'FREEZE') text = 'FREEZE';
        else if (g.type === 'FIRE') text = 'FIRE';
        else if (g.type === 'SHIELD') text = 'SHIELD';
        else if (g.type === 'DRONE') text = 'DRONE';
        
        ctx.fillText(text, g.x + g.width / 2, g.y + g.height / 2 - 10);
        
        // Gate Hit Progress Bar
        const totalCount = state.players.reduce((sum, p) => sum + (p.isDead ? 0 : p.count), 0);
        const hitsNeeded = getHitsNeeded(g.type, g.value, totalCount, state.stage);
        const hpBarWidth = g.width * 0.8;
        const hpBarHeight = 10;
        const hpBarX = g.x + (g.width - hpBarWidth) / 2;
        const hpBarY = g.y + g.height - 18;
        
        // Bar Background
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.beginPath();
        ctx.roundRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight, 5);
        ctx.fill();
        
        // Bar Fill
        const fillRatio = g.type === 'DIV' ? Math.max(0, 1 - g.hits / hitsNeeded) : Math.min(1, g.hits / hitsNeeded);
        const barColor = (g.type === 'SUB' || g.type === 'DIV') ? '#FF6B6B' : '#4ECDC4';
        
        ctx.fillStyle = barColor;
        ctx.beginPath();
        ctx.roundRect(hpBarX, hpBarY, hpBarWidth * fillRatio, hpBarHeight, 5);
        ctx.fill();
        
        // Glow effect for the bar
        ctx.shadowBlur = 10;
        ctx.shadowColor = barColor;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw Items
      state.items.forEach(item => {
        const itemType = item.type.toLowerCase();
        const itemImg = assetsRef.current?.items[itemType];
        if (itemImg) {
          drawImageCircle(ctx, itemImg, item.x, item.y, 18, 0, ITEM_CIRCLE_SCALE, ITEM_IMAGE_SCALE);
        } else {
          let color = '#FFFF00';
          let text = '?';
          if (item.type === 'BOMB') { color = '#333333'; text = '💣'; }
          else if (item.type === 'DRONE') { color = '#00FFFF'; text = '🛸'; }
          else if (item.type === 'SHIELD') { color = '#4ECDC4'; text = '🛡️'; }
          else if (item.type === 'MAGNET') { color = '#FF6B6B'; text = '🧲'; }
          else if (item.type === 'FEVER') { color = '#FFD700'; text = '⚡'; }
          else if (item.type === 'FREEZE') { color = '#A5F2F3'; text = '❄️'; }
          else if (item.type === 'CRIT') { color = '#FFD700'; text = '💥'; }
          else if (item.type === 'FIRE') { color = '#FF4500'; text = '🔥'; }
          else if (item.type === 'POISON_AMMO') { color = '#22c55e'; text = '🧪'; }
          else if (item.type === 'ICE_AMMO') { color = '#00FFFF'; text = '🧊'; }
          else if (item.type === 'HOMING_AMMO') { color = '#FF00FF'; text = '🎯'; }
          else if (item.type === 'COIN') { color = '#FFD700'; text = '💰'; }
          else if (item.type === 'HEART') { color = '#FF6B6B'; text = '❤️'; }

          ctx.save();
          ctx.translate(item.x, item.y);
          
          // Draw circle background
          ctx.fillStyle = color;
          ctx.beginPath(); 
          ctx.arc(0, 0, 15, 0, Math.PI * 2); 
          ctx.fill();
          
          // Draw border
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Draw text/emoji
          ctx.fillStyle = '#fff';
          ctx.font = '16px Inter';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(text, 0, 0);
          
          ctx.restore();
        }
      });

      // Draw Drones
      state.players.forEach(p => {
        if (p.isDead) return;
        state.drones.forEach(d => {
          const droneX = p.x + Math.cos(d.angle) * 40;
          const droneY = p.y + Math.sin(d.angle) * 40;
          const droneImg = assetsRef.current?.items.drone_equipped;
          if (droneImg) {
            ctx.drawImage(droneImg, droneX - 15, droneY - 15, 30, 30);
          } else {
            ctx.fillStyle = '#00FFFF';
            ctx.beginPath(); ctx.arc(droneX, droneY, 6, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFF';
            ctx.beginPath(); ctx.arc(droneX, droneY, 3, 0, Math.PI * 2); ctx.fill();
            ctx.shadowBlur = 10; ctx.shadowColor = '#00FFFF'; ctx.fill(); ctx.shadowBlur = 0;
          }
        });
      });

      // Draw Bullets
      state.bullets.forEach(b => {
        const radius = b.size * 4; // 4x size
        let bulletImg = assetsRef.current?.bullets[b.type?.toLowerCase() || 'normal'];
        if (b.isCrit) {
          bulletImg = assetsRef.current?.bullets?.crit || bulletImg;
        }
        
        if (bulletImg) {
          ctx.save();
          ctx.translate(b.x, b.y);
          
          let glowColor = '#FFE66D';
          if (b.type === 'FIRE') glowColor = '#FF4500';
          else if (b.type === 'POISON') glowColor = '#22c55e';
          else if (b.type === 'ICE') glowColor = '#00FFFF';
          else if (b.type === 'HOMING') glowColor = '#FF00FF';
          
          if (state.feverTime > 0) glowColor = '#FF00FF';

          ctx.shadowBlur = b.isCrit ? 15 : 10;
          ctx.shadowColor = glowColor;
          
          ctx.drawImage(bulletImg, -radius, -radius, radius * 2, radius * 2);
          ctx.restore();
        } else {
          const grad = ctx.createRadialGradient(b.x - radius * 0.3, b.y - radius * 0.3, radius * 0.1, b.x, b.y, radius);
          grad.addColorStop(0, '#FFFFFF');
          
          let color1 = state.feverTime > 0 ? '#FF00FF' : '#FFE66D';
          let color2 = state.feverTime > 0 ? '#880088' : '#887700';
          
          if (b.type === 'FIRE') {
            color1 = '#FF4500'; color2 = '#8B0000';
          } else if (b.type === 'POISON') {
            color1 = '#22c55e'; color2 = '#064e3b';
          } else if (b.type === 'ICE') {
            color1 = '#00FFFF'; color2 = '#008B8B';
          } else if (b.type === 'HOMING') {
            color1 = '#FF00FF'; color2 = '#8B008B';
          }

          grad.addColorStop(0.5, color1);
          grad.addColorStop(1, color2);
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(b.x, b.y, radius, 0, Math.PI * 2); ctx.fill();
          ctx.shadowBlur = b.isCrit ? 15 : 10; ctx.shadowColor = color1; ctx.fill(); ctx.shadowBlur = 0;
        }
      });

      // Draw Enemy Bullets
      state.enemyBullets.forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);
        
        const bulletImg = assetsRef.current?.bossBullets[b.type?.toLowerCase() || ''];
        if (bulletImg) {
          // Determine glow color based on type
          let glowColor = '#ff0000'; // Default red
          if (b.type === 'FIRE') glowColor = '#ff4500';
          else if (b.type === 'ICE') glowColor = '#00ffff';
          else if (b.type === 'POISON') glowColor = '#22c55e';
          else if (b.type === 'ELECTRIC' || b.type === 'THUNDER') glowColor = '#ffff00';
          else if (b.type === 'LASER') glowColor = '#ff00ff';
          else if (b.type === 'WATER' || b.type === 'WATERFALL') glowColor = '#1e90ff';
          else if (b.type === 'ROCK') glowColor = '#8b4513';
          else if (b.type === 'STORM') glowColor = '#90a4ae';
          
          // Add pulsating aura
          const pulse = Math.sin(state.frameCount * 0.15) * 0.2 + 0.8; // 0.6 to 1.0
          const auraRadius = 22 * pulse;
          
          ctx.beginPath();
          ctx.arc(0, 0, auraRadius, 0, Math.PI * 2);
          ctx.fillStyle = glowColor;
          ctx.globalAlpha = 0.6;
          ctx.shadowBlur = 20;
          ctx.shadowColor = glowColor;
          ctx.fill();
          
          ctx.globalAlpha = 1.0;
          ctx.shadowBlur = 10; // Keep some glow on the image itself
          
          // Draw the bullet image slightly larger for better visibility
          ctx.drawImage(bulletImg, -20, -20, 40, 40);
          ctx.shadowBlur = 0;
        } else if (b.type === 'FIRE') {
          const radius = 10;
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
          grad.addColorStop(0, '#FFF');
          grad.addColorStop(0.2, '#FFD700');
          grad.addColorStop(0.5, '#FF4500');
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fill();
          
          // Flame tail
          ctx.fillStyle = '#FF4500';
          for(let i=0; i<3; i++) {
            const s = 4 + Math.random() * 4;
            ctx.beginPath();
            ctx.arc((Math.random()-0.5)*8, 5 + i*5, s, 0, Math.PI*2);
            ctx.fill();
          }
        } else if (b.type === 'ICE') {
          ctx.fillStyle = '#E0FFFF';
          ctx.shadowColor = '#00FFFF';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          for(let i=0; i<6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const r = i % 2 === 0 ? 12 : 6;
            ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#00FFFF';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (b.type === 'WATER' || b.type === 'WATERFALL') {
          ctx.fillStyle = '#1E90FF';
          ctx.beginPath();
          ctx.arc(0, 4, 8, 0, Math.PI);
          ctx.lineTo(0, -12);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#87CEFA';
          ctx.beginPath(); ctx.arc(-3, 2, 3, 0, Math.PI*2); ctx.fill();
        } else if (b.type === 'POISON') {
          const angle = Math.atan2(b.vy, b.vx);
          ctx.rotate(angle - Math.PI / 2);
          
          // Bubble effect
          ctx.fillStyle = '#22c55e';
          ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#4ade80';
          ctx.beginPath(); ctx.arc(-3, -3, 3, 0, Math.PI*2); ctx.fill();
          
          // Tail
          ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
          ctx.beginPath();
          ctx.moveTo(-8, 0);
          ctx.quadraticCurveTo(0, -20, 8, 0);
          ctx.fill();
        } else if (b.type === 'ELECTRIC' || b.type === 'THUNDER') {
          ctx.strokeStyle = '#FFFF00';
          ctx.lineWidth = 3;
          ctx.shadowColor = '#FFFF00';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.moveTo(0, -15);
          for(let i=0; i<4; i++) {
            ctx.lineTo((Math.random()-0.5)*15, -15 + i*10);
          }
          ctx.stroke();
        } else if (b.type === 'ROCK') {
          ctx.fillStyle = '#8B4513';
          ctx.strokeStyle = '#5D2906';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for(let i=0; i<8; i++) {
            const angle = (i/8)*Math.PI*2;
            const r = 10 + Math.random()*5;
            ctx.lineTo(Math.cos(angle)*r, Math.sin(angle)*r);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (b.type === 'LASER') {
          ctx.fillStyle = '#FF00FF';
          ctx.shadowColor = '#FF00FF';
          ctx.shadowBlur = 20;
          ctx.fillRect(-4, -50, 8, 100);
          ctx.fillStyle = '#FFF';
          ctx.fillRect(-1, -50, 2, 100);
        } else if (b.type === 'STORM') {
          ctx.strokeStyle = '#90A4AE';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for(let i=0; i<3; i++) {
            const r = 10 + i*5;
            const a = state.frameCount * 0.2 + i;
            ctx.arc(0, 0, r, a, a + Math.PI);
          }
          ctx.stroke();
        } else if (b.type === 'ARROW') {
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(-1, -10, 2, 20);
          ctx.fillStyle = '#A9A9A9';
          ctx.beginPath(); ctx.moveTo(-3, 10); ctx.lineTo(0, 15); ctx.lineTo(3, 10); ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath(); ctx.moveTo(-3, -10); ctx.lineTo(0, -15); ctx.lineTo(3, -10); ctx.fill();
        } else if (b.type === 'BOMB') {
          ctx.fillStyle = '#333';
          ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#FF0000';
          ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = '#FFA500'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, -12); ctx.stroke();
        } else {
          const radius = 6;
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
          grad.addColorStop(0, '#FFF');
          grad.addColorStop(1, '#666');
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.fill();
        }
        
        ctx.restore();
      });

      // Draw Enemies
      state.enemies.forEach(e => {
        if (e.type === 'BOSS') {
          const bossImg = assetsRef.current?.bossImages.get(e.bossType || '');
          const hpPercent = e.hp / e.maxHp;
          const isPhase2 = hpPercent < 0.5;
          const isPhase3 = hpPercent < 0.2;
          
          if (isPhase2) {
            ctx.save();
            // Pulsating size
            const pulse = 1 + Math.sin(state.frameCount / 10) * 0.2;
            const auraRadius = e.size * BOSS_CIRCLE_SCALE * pulse * (isPhase3 ? 2.0 : 1.5);
            
            // Color based on health (Red for low, Yellow for medium, Green for high)
            let baseHue = 0; // Red
            if (hpPercent > 0.5) baseHue = 120; // Green
            else if (hpPercent > 0.2) baseHue = 40; // Yellow
            
            const gradient = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, auraRadius);
            gradient.addColorStop(0, isPhase3 ? `rgba(255, 0, 0, 0.8)` : `hsla(${baseHue}, 100%, 50%, 0.6)`);
            gradient.addColorStop(1, `hsla(${baseHue}, 100%, 50%, 0)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(e.x, e.y, auraRadius, 0, Math.PI * 2);
            ctx.fill();

            // Phase indicator text
            if (state.frameCount % 60 < 30) {
              ctx.fillStyle = isPhase3 ? '#FF0000' : '#FFFF00';
              ctx.font = 'bold 20px Inter';
              ctx.textAlign = 'center';
              ctx.fillText(isPhase3 ? "!!! DANGER !!!" : "PHASE 2", e.x, e.y - e.size - 45);
            }
            ctx.restore();
          }

          if (bossImg) {
            drawImageCircle(ctx, bossImg, e.x, e.y, e.size, e.hitFlash, BOSS_CIRCLE_SCALE, BOSS_IMAGE_SCALE, 'cover');
          } else if (assetsRef.current?.boss) {
            drawImageCircle(ctx, assetsRef.current.boss, e.x, e.y, e.size, e.hitFlash, BOSS_CIRCLE_SCALE, BOSS_IMAGE_SCALE, 'cover');
          } else {
            drawMonster(ctx, e.x, e.y, e.size, e.hp, e.maxHp, e.hitFlash, e.type, assetsRef.current || undefined);
          }
          // Prominent Boss HP Bar
          const barWidth = e.size * 2.5;
          const barHeight = 12;
          const barX = e.x - barWidth / 2;
          const barY = e.y - e.size - 25;
          
          ctx.fillStyle = '#000'; 
          ctx.fillRect(barX, barY, barWidth, barHeight);
          
          const hpRatio = Math.max(0, e.hp / e.maxHp);
          // Hue goes from 120 (Green) at hpRatio=1 to 0 (Red) at hpRatio=0
          const hue = Math.floor(120 * hpRatio);
          ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
          ctx.fillRect(barX, barY, barWidth * hpRatio, barHeight);
          
          // Add a white border for prominence
          ctx.strokeStyle = '#FFF';
          ctx.lineWidth = 2;
          ctx.strokeRect(barX, barY, barWidth, barHeight);
        } else {
          // Draw aura around enemy character
          ctx.save();
          const auraRadius = e.size * 1.6;
          const pulse = Math.sin(state.frameCount * 0.15) * 0.25 + 0.9;
          ctx.globalCompositeOperation = 'lighter';
          const grad = ctx.createRadialGradient(e.x, e.y, e.size * 0.4, e.x, e.y, auraRadius * pulse);
          
          let auraColor = 'rgba(255, 0, 0, 0.8)'; // More intense red aura
          if (e.type === 'FIRE') auraColor = 'rgba(255, 69, 0, 0.4)';
          else if (e.type === 'ICE') auraColor = 'rgba(0, 255, 255, 0.4)';
          else if (e.type === 'POISON') auraColor = 'rgba(34, 197, 94, 0.4)';
          else if (e.type === 'BOMB') auraColor = 'rgba(255, 0, 255, 0.4)';
          else if (e.type === 'WATER') auraColor = 'rgba(30, 144, 255, 0.4)';
          
          grad.addColorStop(0, auraColor);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(e.x, e.y, auraRadius * pulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          drawMonster(ctx, e.x, e.y, e.size, e.hp, e.maxHp, e.hitFlash, e.type, assetsRef.current || undefined);
        }

        // Draw Enemy Status Effects
        if (e.fireTimer && e.fireTimer > 0) {
          ctx.save(); ctx.translate(e.x, e.y);
          ctx.beginPath(); ctx.arc(0, 0, e.size + 5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 69, 0, 0.8)'; ctx.lineWidth = 3; ctx.stroke();
          ctx.restore();
        }
        if (e.poisonTimer && e.poisonTimer > 0) {
          ctx.save(); ctx.translate(e.x, e.y);
          ctx.beginPath(); ctx.arc(0, 0, e.size + 8, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)'; ctx.lineWidth = 3; ctx.stroke();
          ctx.restore();
        }
        if (e.freezeTimer && e.freezeTimer > 0) {
          ctx.save(); ctx.translate(e.x, e.y);
          ctx.beginPath(); ctx.arc(0, 0, e.size + 11, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'; ctx.lineWidth = 3; ctx.stroke();
          ctx.fillStyle = 'rgba(0, 255, 255, 0.3)'; ctx.fill();
          ctx.restore();
        }
      });

      // Draw Player Squad
      state.players.forEach((p, index) => {
        if (p.isDead || p.count <= 0) return;
        
        // 5 stages every 20 count (1-20, 21-40, 41-60, 61-80, 81-MAX)
        // Stage logic based on user request:
        // 1단계: 0 ~ 10
        // 2단계: 11 ~ 30
        // 3단계: 31 ~ 60
        // 4단계: 61 ~ 90
        // 5단계: 91 ~ MAX
        const playerStage = getPlayerStage(p.count);

        // Scale based on stage for visible growth
        const scale = 1 + playerStage * 0.1; 
        const currentCatSize = CAT_SIZE * scale;
        const visualRadius = currentCatSize;
        const playerRadius = visualRadius * HITBOX_SCALE; // Hitbox set to HITBOX_SCALE of visual size

        const visualCount = Math.min(p.count, PLAYER_MAX_HP + state.squadSkills.maxHp);
        // Draw only ONE character as requested
        const offsets = [{ x: 0, y: 0 }];
        
        // playerRadius is now the hitbox (70% of visual)
        
        if (state.feverTime > 0) {
          ctx.save(); ctx.translate(p.x, p.y);
          ctx.beginPath(); ctx.arc(0, 0, playerRadius + Math.sin(state.frameCount / 5) * 5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; ctx.fill(); ctx.restore();
        }
        
        if (p.shield > 0) {
          ctx.save(); ctx.translate(p.x, p.y);
          ctx.beginPath(); ctx.arc(0, 0, playerRadius + 10, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 100, 255, 0.8)'; ctx.lineWidth = 4; ctx.stroke();
          ctx.fillStyle = 'rgba(0, 100, 255, 0.2)'; ctx.fill();
          ctx.fillStyle = '#FFF'; ctx.font = 'bold 16px Inter'; ctx.fillText(p.shield.toString(), 0, -playerRadius - 20);
          ctx.restore();
        }
        
        if (p.fireTimer > 0) {
          ctx.save(); ctx.translate(p.x, p.y);
          ctx.beginPath(); ctx.arc(0, 0, playerRadius + 5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 69, 0, 0.8)'; ctx.lineWidth = 3; ctx.stroke();
          ctx.fillStyle = 'rgba(255, 69, 0, 0.3)'; ctx.fill();
          ctx.restore();
        }

        if (p.poisonTimer > 0) {
          ctx.save(); ctx.translate(p.x, p.y);
          ctx.beginPath(); ctx.arc(0, 0, playerRadius + 8, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.8)'; ctx.lineWidth = 3; ctx.stroke();
          ctx.fillStyle = 'rgba(34, 197, 94, 0.3)'; ctx.fill();
          ctx.restore();
        }

        if (p.playerFreezeTimer > 0) {
          ctx.save(); ctx.translate(p.x, p.y);
          ctx.beginPath(); ctx.arc(0, 0, playerRadius + 12, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)'; ctx.lineWidth = 5; ctx.stroke();
          ctx.fillStyle = 'rgba(0, 255, 255, 0.4)'; ctx.fill();
          ctx.restore();
        }
        
        if (p.magnetTime > 0) {
          ctx.save(); ctx.translate(p.x, p.y);
          ctx.beginPath(); ctx.arc(0, 0, playerRadius + 20 + Math.sin(state.frameCount / 5) * 10, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)'; ctx.lineWidth = 2; ctx.stroke();
          ctx.restore();
        }

        if (p.critTimer > 0) {
          ctx.save(); ctx.translate(p.x, p.y);
          ctx.beginPath(); ctx.arc(0, 0, playerRadius + 25 + Math.sin(state.frameCount / 3) * 5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)'; ctx.lineWidth = 3; ctx.stroke();
          ctx.restore();
        }

        if (p.ammoTimer > 0) {
          ctx.save(); ctx.translate(p.x, p.y);
          ctx.beginPath(); ctx.arc(0, 0, visualRadius * FIRING_CIRCLE_SCALE, 0, Math.PI * 2);
          let ammoColor = '#FFF';
          if (p.ammoType === 'FIRE') ammoColor = '#FF4500';
          if (p.ammoType === 'POISON') ammoColor = '#22c55e';
          if (p.ammoType === 'ICE') ammoColor = '#00FFFF';
          if (p.ammoType === 'HOMING') ammoColor = '#FF00FF';
          ctx.strokeStyle = ammoColor; ctx.lineWidth = 2; ctx.setLineDash([5, 5]); ctx.stroke();
          ctx.restore();
        }
        
        if (state.freezeTime > 0 && index === 0) {
          ctx.save();
          ctx.fillStyle = 'rgba(0, 255, 255, 0.1)';
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          ctx.restore();
        }

        offsets.forEach((offset, i) => {
          const stage = getPlayerStage(p.count);
          
          const charImgs = assetsRef.current?.characters?.[p.character];
          const charImg = charImgs ? charImgs[stage] : null;
          if (charImg) {
            drawImageCircle(ctx, charImg, p.x + offset.x, p.y + offset.y, visualRadius, 0, PLAYER_CIRCLE_SCALE, PLAYER_IMAGE_SCALE, 'contain', state.feverTime > 0);
          } else if (assetsRef.current?.animal && i % 2 === 0) {
            drawImageCircle(ctx, assetsRef.current.animal, p.x + offset.x, p.y + offset.y, visualRadius, 0, PLAYER_CIRCLE_SCALE, PLAYER_IMAGE_SCALE, 'contain', state.feverTime > 0);
          } else {
            drawCat(ctx, p.x + offset.x, p.y + offset.y, visualRadius);
          }
        });
        
        // Draw health above the character circle
        const circleRadius = visualRadius * PLAYER_CIRCLE_SCALE;
        ctx.fillStyle = '#FFF'; ctx.font = 'bold 24px Inter'; ctx.textAlign = 'center';
        ctx.shadowBlur = 4; ctx.shadowColor = '#000';
        const countText = p.count >= PLAYER_MAX_HP + state.squadSkills.maxHp ? 'MAX' : p.count.toString();
        ctx.fillText(countText, p.x, p.y - circleRadius - 20);
        ctx.shadowBlur = 0;
      });

      // Draw Particles
      state.particles.forEach(p => {
        ctx.fillStyle = p.color; ctx.globalAlpha = p.life;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
      });

      // Draw Floating Texts
      state.floatingTexts.forEach(ft => {
        ctx.save();
        if (ft.isWarning) {
          ctx.font = 'bold 32px Inter';
          ctx.shadowBlur = 15;
          ctx.shadowColor = ft.color;
          ctx.globalAlpha = ft.life;
          ctx.fillStyle = ft.color;
          ctx.textAlign = 'center';
          ctx.fillText(ft.text, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + (1 - ft.life) * 50);
        } else {
          ctx.fillStyle = ft.color;
          ctx.globalAlpha = ft.life;
          ctx.font = 'bold 20px Inter'; ctx.textAlign = 'center';
          ctx.shadowBlur = 2; ctx.shadowColor = '#000';
          ctx.fillText(ft.text, ft.x, ft.y);
          ctx.shadowBlur = 0;
        }
        ctx.restore();
        ft.y -= 1;
        ft.life -= 0.02;
      });
      state.floatingTexts = state.floatingTexts.filter(ft => ft.life > 0);

      // Draw Score HUD
      if (state.status === 'PLAYING') {
        const scoreText = `🏆 ${state.score}  |  Stage ${state.stage}`;
        ctx.font = 'bold 20px Inter';
        const textWidth = ctx.measureText(scoreText).width;
        const bgWidth = Math.max(200, textWidth + 40);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath(); ctx.roundRect(10, 10, bgWidth, 40, 20); ctx.fill();
        ctx.fillStyle = '#FFF'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(scoreText, 25, 30);
        
        if (state.combo > 1) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.beginPath(); ctx.roundRect(10, 60, 160, 40, 20); ctx.fill();
          ctx.fillStyle = '#FFD700'; ctx.font = 'bold 20px Inter';
          ctx.fillText(`🔥 ${state.combo} COMBO`, 25, 80);
          
          // Combo timer bar
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(20, 92, 140, 4);
          ctx.fillStyle = '#FFD700';
          ctx.fillRect(20, 92, 140 * (state.comboTimer / 120), 4);
        }

        if (state.feverTime > 0) {
          ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
          ctx.beginPath(); ctx.roundRect(10, 110, 160, 40, 20); ctx.fill();
          ctx.fillStyle = '#FFFF00'; ctx.font = 'bold 20px Inter';
          ctx.fillText(`⚡ FEVER!`, 25, 130);
          
          // Fever timer bar
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(20, 142, 140, 4);
          ctx.fillStyle = '#FFFF00';
          ctx.fillRect(20, 142, 140 * (state.feverTime / 300), 4);
        }

        // Coin HUD
        const totalCoins = Math.max(0, (coinsRef.current || 0) + (state.coins || 0));
        const coinText = `💰 ${totalCoins.toLocaleString()}`;
        ctx.font = 'bold 16px Inter';
        const coinWidth = ctx.measureText(coinText).width + 20;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath(); ctx.roundRect(CANVAS_WIDTH - coinWidth - 10, 10, coinWidth, 30, 15); ctx.fill();
        ctx.fillStyle = '#FFD700'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText(coinText, CANVAS_WIDTH - 20, 25);

        // Bomb HUD
        const p1 = state.players[0];
        if (p1 && !p1.isDead) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.beginPath(); ctx.roundRect(CANVAS_WIDTH - 75, 50, 65, 30, 15); ctx.fill();
          ctx.fillStyle = '#FF4444'; ctx.font = 'bold 16px Inter'; ctx.textAlign = 'right';
          ctx.fillText(`💣 x${p1.bombCount}`, CANVAS_WIDTH - 20, 65);
        }

        // Active Items HUD (Bottom)
        const activeItems = [];
        if (p1 && !p1.isDead) {
          if (p1.shield > 0) activeItems.push({ type: 'shield', count: p1.shield });
          if (state.drones.length > 0) activeItems.push({ type: 'drone', count: state.drones.length });
          if (p1.magnetTime > 0) activeItems.push({ type: 'magnet' });
          if (p1.critTimer > 0) activeItems.push({ type: 'crit' });
          if (state.feverTime > 0) activeItems.push({ type: 'fever' });
          if (state.freezeTime > 0) activeItems.push({ type: 'freeze' });
          if (p1.ammoTimer > 0) activeItems.push({ type: p1.ammoType?.toLowerCase() + '_ammo' });
        }

        const itemSize = 30;
        const spacing = 15;
        let currentX = 20;
        const startY = CANVAS_HEIGHT - 50;

        activeItems.forEach((item) => {
          ctx.save();
          ctx.globalAlpha = 0.5; // Slightly transparent
          
          let img = assetsRef.current?.items[item.type];
          if (img) {
            ctx.drawImage(img, currentX, startY, itemSize, itemSize);
          } else {
            // Fallback
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.beginPath(); ctx.arc(currentX + itemSize/2, startY + itemSize/2, itemSize/2, 0, Math.PI*2); ctx.fill();
          }

          if (item.count !== undefined) {
             ctx.globalAlpha = 1.0;
             ctx.fillStyle = '#FFF';
             ctx.font = 'bold 14px Inter';
             ctx.textAlign = 'left';
             ctx.textBaseline = 'middle';
             ctx.fillText(`×${item.count}`, currentX + itemSize + 2, startY + itemSize/2);
             currentX += itemSize + spacing + 25; // Extra space for count
          } else {
             currentX += itemSize + spacing;
          }
          ctx.restore();
        });
      }
      
      ctx.restore();
    };

    const handleKeyDown = (e: KeyboardEvent) => { keysRef.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysRef.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let lastTime = performance.now();
    let accumulator = 0;
    const step = 1000 / 60;

    const loop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Limit deltaTime to prevent "spiral of death" if the game lags
      accumulator += Math.min(deltaTime, 100); 

      while (accumulator >= step) {
        update();
        accumulator -= step;
      }
      
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState.current.status !== 'PLAYING' || gameState.current.isPaused) return;
    const player = gameState.current.players[0];
    if (player.playerFreezeTimer > 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // Calculate character's visual radius to offset the touch point to the bottom
    const playerStage = getPlayerStage(player.count);
    const scale = 1 + playerStage * 0.1;
    const visualRadius = CAT_SIZE * scale;
    const circleRadius = visualRadius * PLAYER_CIRCLE_SCALE;
    
    const targetY = y - circleRadius;
    
    player.x = Math.max(20, Math.min(CANVAS_WIDTH - 20, x));
    player.y = Math.max(20, Math.min(CANVAS_HEIGHT - 20, targetY));
  };

  const handleMouseDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState.current.status !== 'PLAYING') return;
    if (e.pointerType === 'mouse' && e.button === 0) {
      useBomb(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState.current.status !== 'PLAYING') return;
    // Detonate bomb if two fingers touch the screen
    if (e.touches.length >= 2) {
      useBomb(0);
    }
  };

  return (
    <ErrorBoundary>
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-0 sm:p-4 font-sans select-none overflow-hidden">
        <div className="relative w-full h-full sm:h-auto max-w-[400px] sm:max-h-[90vh] aspect-auto sm:aspect-[4/7] bg-black rounded-none sm:rounded-3xl overflow-hidden shadow-2xl ring-0 sm:ring-8 ring-slate-800">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full touch-none cursor-crosshair"
            onPointerDown={(e) => { handlePointerMove(e); handleMouseDown(e); }}
            onPointerMove={handlePointerMove}
            onTouchStart={handleTouchStart}
          />
          
          {reactStateStatus === 'PLAYING' && (
            <div className="absolute bottom-4 inset-x-4 flex justify-end pointer-events-none">
              <div className="pointer-events-auto">
                <button
                  onClick={() => useBomb(0)}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-red-400/30 hover:bg-red-500/50 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-red-600/20 active:scale-95 transition-all"
                >
                  <BombIcon size={14} />
                </button>
              </div>
            </div>
          )}
          
          {reactStateStatus === 'START' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-between text-white p-3 sm:p-6 text-center overflow-hidden">
              {/* Top Bar */}
              <div className="w-full flex justify-between items-center mt-1">
                <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-yellow-500/30 flex items-center gap-2 shadow-lg">
                  <span className="text-yellow-400 text-base sm:text-xl">💰</span>
                  <span className="text-white font-black text-base sm:text-xl">{isNaN(Number(coins)) ? 0 : coins}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button 
                    onClick={() => setShowAchievements(true)}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center border border-slate-700 transition-all shadow-lg"
                    title="Achievements"
                  >
                    <Target size={16} className="text-yellow-400 sm:w-5 sm:h-5" />
                  </button>
                  <button 
                    onClick={() => setShowManual(true)}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center border border-slate-700 transition-all shadow-lg"
                  >
                    <Info size={16} className="text-slate-400 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md py-1">
                <h1 className="text-2xl sm:text-4xl font-black mb-0 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 leading-tight drop-shadow-2xl">
                  CUTE SQUAD RUSH
                </h1>

                {/* High Score Display */}
                <div className="mb-1 bg-white/5 backdrop-blur-md px-3 py-0.5 rounded-xl border border-white/10 flex flex-col items-center">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Best Record</span>
                  <span className="text-lg font-black text-blue-400">{highScore.toLocaleString()}</span>
                </div>
              
                <div className="mb-1 flex flex-col items-center w-full gap-1">
                  <div className="flex flex-col gap-1 w-full max-w-[340px]">
                    <div className="flex flex-col items-center bg-black/20 p-2 rounded-xl border border-slate-700/30 backdrop-blur-sm">
                      <div className="flex gap-2">
                        {['cat', 'rabbit', 'rat', 'dog'].map(char => (
                          <div key={char} className="flex flex-col items-center gap-1">
                            <button
                              onClick={() => {
                                setSelectedCharacters([char]);
                              }}
                              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center transition-all overflow-hidden ${
                                selectedCharacters[0] === char
                                  ? 'bg-slate-700 ring-4 ring-orange-500 scale-105 shadow-xl shadow-orange-500/40'
                                  : 'bg-slate-800/50 hover:bg-slate-700 opacity-40'
                              }`}
                            >
                              <img 
                                src={char === 'cat' ? cat1 : char === 'rabbit' ? rabbit1 : char === 'rat' ? rat1 : dog1} 
                                alt={char} 
                                className="w-full h-full object-contain p-1"
                                referrerPolicy="no-referrer"
                              />
                            </button>
                            <div className="flex flex-col items-center">
                              <span className={`text-[9px] font-bold ${selectedCharacters[0] === char ? 'text-white' : 'text-slate-400'}`}>
                                {char === 'cat' ? '고양이' : char === 'rabbit' ? '토끼' : char === 'rat' ? '쥐' : '강아지'}
                              </span>
                              <span className={`text-[8px] font-bold uppercase ${selectedCharacters[0] === char ? 'text-orange-400' : 'text-slate-500'}`}>
                                {char === 'cat' ? '공속' : char === 'rabbit' ? '관통' : char === 'rat' ? '치명' : '공격'}
                              </span>
                              <span className="text-[7px] text-slate-500 font-medium">
                                {char === 'cat' ? '+10%' : char === 'rabbit' ? '+10%' : char === 'rat' ? '+5%' : '+10%'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-0 w-full flex justify-center">
                    <input
                      type="text"
                      value={playerName}
                      onChange={(e) => {
                        setPlayerName(e.target.value);
                        localStorage.setItem('nano_banana_player_name', e.target.value);
                      }}
                      placeholder="Enter Squad Name"
                      className="bg-black/50 border border-slate-700 rounded-lg px-3 py-1.5 text-center text-[10px] text-white focus:outline-none focus:ring-1 focus:ring-orange-500/50 w-full max-w-[260px] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full max-w-[260px] mt-0">
                  <button 
                    onClick={handlePlayClick}
                    className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-black py-2.5 px-6 rounded-xl shadow-xl shadow-orange-500/40 transform transition hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-base uppercase tracking-wider"
                  >
                    <Play fill="currentColor" size={18} /> START MISSION
                  </button>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button 
                      onClick={() => setShowManual(true)}
                      className="bg-white/10 hover:bg-white/20 text-white font-bold py-1.5 px-2 rounded-xl border border-white/20 backdrop-blur-sm transform transition hover:scale-105 text-[9px] flex items-center justify-center"
                    >
                      MANUAL
                    </button>
                    <button 
                      onClick={() => setShowRecords(true)}
                      className="bg-white/10 hover:bg-white/20 text-blue-400 font-bold py-1.5 px-2 rounded-xl border border-blue-400/30 backdrop-blur-sm transform transition hover:scale-105 text-[9px] flex items-center justify-center gap-1"
                    >
                      <Trophy size={10} /> RECORDS
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowShop(true)}
                    className="bg-white/10 hover:bg-white/20 text-yellow-400 font-bold py-2 px-4 rounded-xl border border-yellow-400/30 backdrop-blur-sm transform transition hover:scale-105 text-[10px] flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={12} /> UPGRADE SQUAD
                  </button>
                </div>
              </div>
            </div>
          )}

        {showPause && (
          <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-white">
            <h2 className="text-4xl font-black text-yellow-400 mb-8">일시 정지</h2>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button 
                onClick={() => {
                  gameState.current.isPaused = false;
                  setShowPause(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all"
              >
                게임 계속하기
              </button>
              <button 
                onClick={() => {
                  gameState.current = JSON.parse(JSON.stringify(INITIAL_GAME_STATE));
                  gameState.current.isPaused = false;
                  setShowPause(false);
                  setReactStateStatus('START');
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all"
              >
                메인화면으로 가기
              </button>
            </div>
          </div>
        )}

        {showShop && (
          <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 text-white overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center gap-2">
                <ShoppingCart size={24} className="sm:w-8 sm:h-8" /> UPGRADE SHOP
              </h2>
              <button 
                onClick={() => setShowShop(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <div className="mb-4 sm:mb-6 bg-slate-800/50 p-3 sm:p-4 rounded-2xl border border-yellow-500/30 flex justify-between items-center">
              <span className="text-lg sm:text-xl font-bold text-slate-300">Your Coins:</span>
              <span className="text-2xl sm:text-3xl font-black text-yellow-400 flex items-center gap-2">
                💰 {isNaN(Number(coins)) ? 0 : coins}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-2 sm:gap-4 w-full max-w-md mx-auto flex-1 overflow-y-auto scrollbar-hide">
              {randomUpgrades.map(id => {
                const config = UPGRADE_CONFIG[id];
                const currentLevel = upgrades[id as keyof typeof upgrades] || 0;
                const isMax = currentLevel >= config.maxLevel;
                const cost = isMax ? 0 : Math.floor(config.baseCost * Math.pow(config.costScaling, currentLevel));
                const canAfford = !isMax && coins >= cost;
                
                return (
                  <button
                    key={id}
                    disabled={!canAfford}
                    onClick={() => buyUpgrade(id)}
                    className={`p-3 sm:p-4 rounded-lg border flex items-center gap-3 sm:gap-4 ${
                      !canAfford ? 'bg-slate-800 border-slate-700 opacity-50' : 'bg-slate-700 border-slate-500 hover:border-yellow-400'
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl">{config.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-sm sm:text-base">{config.name}</div>
                      <div className="text-xs sm:text-sm text-slate-300">{config.description}</div>
                      <div className="text-xs sm:text-sm text-yellow-400">
                        {isMax ? 'MAX' : `Cost: ${cost}`} | {config.levelPerValue} per level
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm">Lv.{currentLevel}/{config.maxLevel}</div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-6 justify-center">
              <button onClick={() => { setCoins(0); saveProgress(0, upgrades, highScore); }} className="bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-base">Reset Coins</button>
              <button onClick={() => { setUpgrades({}); saveProgress(coins, {}, highScore); }} className="bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-base">Reset Skills</button>
            </div>
          </div>
        )}

        {showRecords && (
          <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 text-white overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                RECORDS
              </h2>
              <div className="flex items-center gap-2">
                {records.length > 0 && (
                  <div className="flex items-center gap-2">
                    {showResetConfirm ? (
                      <div className="flex items-center gap-1 bg-red-900/40 p-1 rounded-lg border border-red-500/30 animate-pulse">
                        <span className="text-[10px] text-red-200 px-1">RESET?</span>
                        <button 
                          onClick={resetRecords}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded transition-colors"
                        >
                          YES
                        </button>
                        <button 
                          onClick={() => setShowResetConfirm(false)}
                          className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-white text-[10px] font-bold rounded transition-colors"
                        >
                          NO
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowResetConfirm(true)}
                        className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-bold rounded-lg border border-red-600/30 transition-colors"
                      >
                        RESET
                      </button>
                    )}
                  </div>
                )}
                <button 
                  onClick={() => {
                    setShowRecords(false);
                    setShowResetConfirm(false);
                  }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
              {records.length === 0 ? (
                <div className="text-center text-slate-400 mt-10">No records yet. Play a game!</div>
              ) : (
                records.map((record, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                    <div className="text-2xl font-black text-slate-500 w-8 text-center">#{idx + 1}</div>
                    {record.character && (
                      <img src={characterImageMap[record.character]} alt={record.character} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <div className="flex-1">
                      <div className="font-bold text-lg text-white">{record.name}</div>
                      <div className="text-xs text-slate-400">{new Date(record.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-yellow-400 text-xl">{record.score}</div>
                      <div className="text-xs text-slate-400 font-bold">STAGE {record.stage}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {showAchievements && <AchievementModal />}
        {showManual && (
          <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex flex-col p-4 sm:p-6 text-white overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                게임 방법
              </h2>
              <button 
                onClick={() => setShowManual(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
              <section className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <Gamepad2 size={20} /> 조작 방법
                </h3>
                <ul className="text-sm text-zinc-300 space-y-2">
                  <li><span className="font-bold text-white">이동</span>: <kbd className="bg-zinc-700 px-1 rounded">WASD</kbd> 또는 <kbd className="bg-zinc-700 px-1 rounded">방향키</kbd> (모바일: 드래그)</li>
                  <li><span className="font-bold text-white">폭탄</span>: <kbd className="bg-zinc-700 px-1 rounded">B</kbd> 또는 <kbd className="bg-zinc-700 px-1 rounded">스페이스바</kbd> (모바일: <span className="text-red-400 font-bold">두 손가락 터치</span>)</li>
                  <li><kbd className="bg-zinc-700 px-1 rounded">M</kbd> : 도움말 켜기/끄기</li>
                  <li><kbd className="bg-zinc-700 px-1 rounded">P</kbd> : 게임 일시 정지</li>
                  <li className="text-xs text-slate-400 pt-2 border-t border-white/5">* 모바일에서 피격 시 햅틱 반응(진동)이 제공됩니다.</li>
                  <li className="text-xs text-slate-400">* 보호막과 폭탄은 최대 3개까지 보유 가능합니다.</li>
                </ul>
              </section>

              <section className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <Info size={20} /> 게임 설명
                </h3>
                <p className="text-sm text-zinc-300 mb-4">
                  아이템을 모아 파워업하고, 적의 탄환을 피해 보스를 물리치세요!
                </p>
                <h4 className="text-md font-bold text-cyan-400 mb-2">캐릭터 패시브</h4>
                <ul className="text-sm text-zinc-300 space-y-2 mb-4">
                  <li><span className="font-bold text-white">🐱 고양이</span>: 공격 속도 +10%</li>
                  <li><span className="font-bold text-white">🐶 강아지</span>: 공격력 +10%</li>
                  <li><span className="font-bold text-white">🐰 토끼</span>: 관통 공격 +10%</li>
                  <li><span className="font-bold text-white">🐭 쥐</span>: 영구 소형 자석 + 치명타 피해 +5%</li>
                </ul>
                <h4 className="text-md font-bold text-orange-400 mb-2">특수 탄환 및 효과</h4>
                <ul className="text-sm text-zinc-300 space-y-2">
                  <li><span className="font-bold text-red-400">🔥 화염</span>: 일정 시간 동안 지속적인 데미지를 입힙니다.</li>
                  <li><span className="font-bold text-green-400">☠️ 독</span>: 긴 시간 동안 강력한 데미지를 입힙니다.</li>
                  <li><span className="font-bold text-cyan-400">❄️ 빙결</span>: 대상을 잠시 동안 제자리에 얼립니다.</li>
                  <li><span className="font-bold text-yellow-400">⚡ 전기/번개</span>: 대상을 잠시 동안 기절시킵니다.</li>
                  <li><span className="font-bold text-fuchsia-400">🎯 유도</span>: 적을 자동으로 추적합니다.</li>
                </ul>
              </section>

              <section className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
                  <Info size={20} /> 파워업 아이템
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 bg-black/20 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">🛡️</div>
                    <div>
                      <div className="text-xs font-bold">보호막</div>
                      <div className="text-[10px] text-slate-400">1회 피해를 막아줍니다.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-black/20 rounded-lg">
                    <div className="w-8 h-8 bg-red-500/20 rounded flex items-center justify-center">💣</div>
                    <div>
                      <div className="text-xs font-bold">폭탄</div>
                      <div className="text-[10px] text-slate-400">화면의 모든 적을 제거합니다.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-black/20 rounded-lg">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded flex items-center justify-center">🧲</div>
                    <div>
                      <div className="text-xs font-bold">자석</div>
                      <div className="text-[10px] text-slate-400">아이템을 끌어당깁니다.</div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                  <Skull size={20} /> 보스 가이드
                </h3>
                <div className="space-y-3">
                  {[
                    { s: 1, n: '프로스트 웜', e: '빙결', p: 2, c: 'text-cyan-400', d: '패턴: 확산탄, 빙결 비, 빙결 가시, 프리징 블래스트' },
                    { s: 2, n: '마그마 웜', e: '화염', p: 3, c: 'text-red-400', d: '패턴: 확산탄, 화염 레이저, 화염 고리, 화염 비' },
                    { s: 3, n: '토식 뮤턴트', e: '독', p: 4, c: 'text-green-400', d: '패턴: 독 고리, 회전 독탄, 독 비, 유도 독탄' },
                    { s: 4, n: '썬더 비스트', e: '전기', p: 2, c: 'text-yellow-400', d: '패턴: 유도 전기탄, 전기 레이저, 전기장, 체인 라이트닝' },
                    { s: 5, n: '워터 크라켄', e: '폭포', p: 1, c: 'text-blue-400', d: '패턴: 폭포, 해일' },
                    { s: 6, n: '윈드 스피릿', e: '바람', p: 2, c: 'text-slate-300', d: '패턴: 강풍, 바람 탄환' },
                    { s: 7, n: '스톰 버드', e: '폭풍', p: 2, c: 'text-slate-400', d: '패턴: 폭풍우, 회오리' },
                    { s: 8, n: '어스 골렘', e: '지진', p: 5, c: 'text-amber-700', d: '패턴: 지진, 낙석' },
                    { s: 9, n: '레이저 센티넬', e: '레이저', p: 3, c: 'text-purple-400', d: '패턴: 레이저 난사, 회전 레이저' },
                    { s: 10, n: '썬더 갓', e: '번개', p: 2, c: 'text-indigo-400', d: '패턴: 낙뢰, 번개 폭풍' },
                    { s: '최종', n: '보이드 엔티티', e: '모두', p: 2, c: 'text-white', d: '패턴: 모든 속성 공격 전환' },
                  ].map((b, i) => (
                    <div key={i} className="flex justify-between items-center text-xs border-b border-white/5 pb-2 last:border-0">
                      <div>
                        <span className="text-slate-500 mr-2">STG {b.s}</span>
                        <span className={`font-bold ${b.c}`}>{b.n}</span>
                        <div className="text-[10px] text-slate-400">{b.d}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase">{b.e}</div>
                        <div className="font-mono text-yellow-500">ATK: {b.p}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                  <Target size={20} /> 몬스터
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-400"/> 일반 슬라임</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"/> 화염 슬라임</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"/> 물 슬라임</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-cyan-400"/> 빙결 슬라임</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"/> 독 슬라임</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"/> 폭탄 슬라임</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400"/> 궁수</div>
                </div>
              </section>

              <section className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <h3 className="text-lg font-bold text-pink-400 mb-2 flex items-center gap-2">
                  <Info size={20} /> 게임 시스템
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  • 시간차 소환: 몬스터들이 0~5초의 지연 시간을 두고 나타납니다.<br/>
                  • 보스 부하: 보스는 스테이지 레벨당 1마리의 부하를 추가로 소환합니다.<br/>
                  • 특수 데미지: 독(4), 화염/레이저(3), 낙석(5), 폭포(1)
                </p>
              </section>
            </div>
            
            <button 
              onClick={() => setShowManual(false)}
              className="mt-6 w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black rounded-2xl shadow-lg transform transition active:scale-95"
            >
              게임으로 돌아가기
            </button>
          </div>
        )}

        {reactStateStatus === 'GENERATING' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-yellow-400 mb-6" />
            <h2 className="text-3xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              SUMMONING<br/>SQUAD
            </h2>
            <p className="text-lg text-slate-300 animate-pulse">{loadingText}</p>
          </div>
        )}

        {reactStateStatus === 'SKILL_SELECTION' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4 sm:p-6 z-50 overflow-y-auto scrollbar-hide">
            <h2 className="text-3xl font-black mb-1 sm:mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">LEVEL UP!</h2>
            <p className="text-slate-300 mb-4 sm:mb-8 text-sm sm:text-base">Choose a skill for your squad</p>
            
            <div className="flex flex-col gap-2 sm:gap-4 w-full max-w-sm">
              {skillChoices.map((skill, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSkillSelect(skill)}
                  className={`${SKILL_BUTTON_BG} ${SKILL_BUTTON_BORDER} ${SKILL_BUTTON_HOVER} rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all transform hover:scale-105`}
                >
                  <div className="text-3xl sm:text-4xl">{skill.icon}</div>
                  <div className="text-left flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-bold text-base sm:text-lg ${SKILL_TITLE_COLOR} leading-tight`}>{skill.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ml-2 ${SKILL_RARITY_COLORS[skill.rarity]}`}>
                        {skill.rarity}
                      </span>
                    </div>
                    <p className={`text-xs sm:text-sm ${SKILL_DESC_COLOR}`}>{skill.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {reactStateStatus === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-4 sm:p-6 text-center overflow-hidden">
            <h2 className="text-3xl sm:text-5xl font-black mb-2 text-red-500">GAME OVER</h2>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-[300px] mb-4 mt-2">
              <div className="bg-white/5 p-2 sm:p-4 rounded-xl border border-white/10">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Final Score</p>
                <p className="text-lg sm:text-2xl font-black text-yellow-400">{finalScore.toLocaleString()}</p>
              </div>
              <div className="bg-white/5 p-2 sm:p-4 rounded-xl border border-white/10">
                <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">High Score</p>
                <p className="text-lg sm:text-2xl font-black text-blue-400">{highScore.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 w-full max-w-[240px] sm:max-w-[280px] mb-4">
              <button 
                onClick={handlePlayClick}
                className="bg-white text-black hover:bg-slate-200 font-bold py-3 px-8 rounded-xl shadow-lg transform transition hover:scale-105 flex items-center justify-center gap-2 text-base sm:text-2xl"
              >
                <RotateCcw size={18} className="sm:w-7 sm:h-7" /> TRY AGAIN
              </button>
              <button 
                onClick={() => setReactStateStatus('START')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-8 rounded-xl border border-white/20 backdrop-blur-sm transform transition hover:scale-105 flex items-center justify-center gap-2 text-xs sm:text-lg"
              >
                <Home size={14} className="sm:w-5 sm:h-5" /> MAIN MENU
              </button>
              <button 
                onClick={() => setShowManual(true)}
                className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-8 rounded-xl border border-white/20 backdrop-blur-sm transform transition hover:scale-105 text-xs sm:text-lg"
              >
                GAME MANUAL
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
