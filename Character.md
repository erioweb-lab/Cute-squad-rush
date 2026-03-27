# Character Graphic Upgrade Prompts

이 문서는 플레이어 캐릭터가 게이트를 파괴하고 체력을 증가시킬 때마다(5단계별로 1.2배씩 크기가 증가하며 외형이 업그레이드됨) 적용할 수 있는 고품질 AI 이미지 생성 프롬프트 모음입니다.

## 성장 시스템 개요
- **1단계 (기본):** 작고 귀여운 동물 형태 (예: 강아지, 슬라임 등)
- **2단계 (성장):** 약간의 장비(가벼운 갑옷이나 헬멧)를 착용한 모습
- **3단계 (진화):** 중급 갑옷 착용, 무기나 마법 이펙트가 생기기 시작함
- **4단계 (각성):** 중무장한 전사/마법사 형태, 강렬한 오라와 카리스마
- **5단계 (궁극):** 거대하고 화려한 전설적인 존재, 화면을 압도하는 빛나는 이펙트

## 공통 스타일 가이드
`3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution`

---

### Stage 1: Basic Form (기본 형태)
**Prompt:**
> A cute, small, spherical animal character (like a brave little puppy or fox), simple and adorable, soft fur, big determined eyes, no armor, 3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution.

### Stage 2: Novice Adventurer (초보 모험가)
**Prompt:**
> A small spherical animal character wearing a light leather helmet and a tiny red scarf, looking slightly more confident, holding a small wooden shield, 3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution.

### Stage 3: Elite Warrior (정예 전사)
**Prompt:**
> A medium-sized spherical animal character wearing shiny steel armor and a glowing blue pendant, holding a glowing sword, confident and strong expression, faint magical aura, 3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution.

### Stage 4: Awakened Hero (각성한 영웅)
**Prompt:**
> A large, fierce spherical animal character clad in heavy golden paladin armor, wielding a massive glowing energy weapon, surrounded by a swirling aura of light and lightning, majestic and powerful, 3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution.

### Stage 5: Legendary Avatar (전설의 화신 - 궁극기)
**Prompt:**
> A massive, god-like spherical animal character, wearing intricate glowing divine armor, floating above the ground, radiating blinding golden and blue holy light, majestic energy wings, ultimate power, 3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution.

---

## 게임 내 적용 가이드 (크기 증가 로직)
캐릭터의 체력(HP)이나 레벨이 오를 때마다 캔버스에서 그려지는 크기를 1.2배씩 증가시키려면, `drawImage` 시에 너비와 높이에 배율을 곱해주면 됩니다.

```typescript
// 예시 로직
const stage = Math.min(5, Math.floor(player.count / 10) + 1); // 10 단위로 스테이지 증가 (최대 5)
const scale = Math.pow(1.2, stage - 1); // 1단계: 1x, 2단계: 1.2x, 3단계: 1.44x ...
const baseSize = 40;
const currentSize = baseSize * scale;

// 캔버스에 그릴 때
ctx.drawImage(characterImages[stage - 1], player.x - currentSize/2, player.y - currentSize/2, currentSize, currentSize);
```
