# Game Development Plan & Progress

## 📜 Development History (상세 작업 이력)

### Phase 1: Core Mechanics (완료)
1.  **기본 엔진 구축**: `requestAnimationFrame` 기반의 게임 루프, 키보드/마우스 입력 처리 시스템 구현.
2.  **게이트 시스템**: 통과 시 캐릭터 숫자/체력이 변하는 수학 게이트(ADD, SUB, MULT, DIV) 로직 및 시각적 피드백 구현.
3.  **멀티플레이어**: 최대 3인까지 동시에 플레이 가능한 로컬 협동 시스템 구축 (키보드 매핑).
4.  **캐릭터 성장**: 획득한 아이템 수에 따른 5단계 외형 변화 시스템 및 레벨업 로직 구현.

### Phase 2: Optimization & Asset Transition (완료)
5.  **SVG 제거 및 PNG 전환**: 성능 최적화를 위해 모든 SVG 파일을 삭제하고 PNG 기반 시스템으로 전환.
6.  **크로스 오리진(CORS) 대응**: 외부 이미지(Picsum) 로딩 시 발생하던 `Canvas Tainted` 보안 오류 해결.
7.  **에셋 폴백 시스템**: 특정 이미지가 없을 경우 자동으로 플레이스홀더를 생성하는 안정화 로직 추가.
8.  **배경 제거 유틸리티**: 스프라이트 시트의 배경색을 실시간으로 투명하게 만드는 캔버스 도구 구현.

### Phase 3: Bug Fixes & Refinement (완료)
9.  **플레이어 이동 버그 수정**: 특정 공격(Waterfall, Storm) 시 캐릭터가 의도치 않게 아래로 밀려나는 현상 수정 및 마우스/터치 조작 시 Y축 이동 지원 추가.
10. **공격 밸런싱**: 보스 및 적의 특수 공격(밀어내기 등)의 강도를 적절하게 조절하여 게임성 개선.
11. **위치 고정 시스템**: 캐릭터가 화면 밖으로 나가지 않도록 매 프레임 위치 강제 고정(Clamping) 로직 추가.
12. **게임 밸런스 조정**: 보스 체력 및 탄환 파워를 전역 상수로 관리하여 쉽게 조절할 수 있도록 리팩토링.
13. **보스 공격 패턴 다양화**: 보스 체력 비율(HP %)에 따라 3단계 공격 패턴(확산 사격, 레이저, 슬라임 소환)이 변화하도록 AI 로직 구현.
14. **아이템 시스템**: 보호막, 자석, 폭탄 등 게임의 전략적 요소를 더하는 아이템 구현.
16. **파티클 시스템**: 적 처치 시 폭발 등 화려한 이펙트 추가.
18. **게임 매뉴얼 최적화**: 게임 내 조작법, 아이템 설명, 보스 패턴 등을 보여주는 모달 UI 구현.

### Phase 4: Progression & Features (완료)
19. **스테이지 및 진행 (Progression)**: 보스 처치 후 다음 스테이지로 넘어가며 배경 테마, 적 스폰 속도, 적 종류 등이 동적으로 변경되는 난이도 곡선 구현. (완료)
20. **캐릭터별 특수 능력**: 캐릭터마다 고유 패시브 스킬(고양이: 공격 속도 증가, 강아지: 공격력 증가, 토끼: 이동 속도 증가, 쥐: 자석 효과)을 부여하여 전략성 강화. (완료)
21. **콤보 시스템**: 2초 내에 적을 연속 처치 시 콤보 게이지가 쌓이며, 20콤보 달성 시 5초간 공격 속도와 데미지가 2배가 되는 '피버 모드(Fever Mode)' 발동. (완료)
22. **다이내믹 카메라**: 플레이어 캐릭터 무리의 크기가 커지거나 보스전이 시작될 때 카메라가 자동으로 줌인/줌아웃되어 박진감을 더하는 기능. (완료)
23. **업그레이드 상점**: 적 처치 시 획득한 코인으로 공격력, 연사력, 탄환 크기 등을 영구적으로 업그레이드할 수 있는 시스템. (완료)
24. **로그라이트 스킬 선택 (Roguelite Skill Selection)**: 스테이지 클리어 또는 보스 처치 시 3개의 무작위 스킬 중 하나를 선택하여 스쿼드를 강화하는 시스템 구현. (완료)
25. **스킬 밸런스 조정**: 기존의 '이동 속도(Movement Speed)' 스킬을 삭제하고, 탄환의 크기와 히트박스를 키워주는 '탄환 크기(Bullet Size)' 스킬로 교체. (완료)
26. **UI/UX 폴리싱**: 스킬 선택 UI 변수 상수화 및 배경 제거 도구 시인성 개선 (배경색 변경). (완료)
28. **배경 제거 로직 제거**: 적 캐릭터 및 보스 이미지의 배경 제거 로직을 제거하여 원본 이미지 그대로 반영. (완료)
29. **환경 상호작용 오브젝트 추가**: 공격 시 폭발하는 '폭약통', 밟으면 가속되는 '가속 패드', 숨을 수 있는 '수풀' 등 전략적 오브젝트 구현. (완료)

---

## 🛠️ Future Roadmap & Implementation Guide (향후 계획 및 구현 가이드)

### ✅ To-Do: Gate System Enhancements (완료)
- **게이트(Gate) 디자인 컨셉 (Last War 스타일)**:
    - **시각적 명확성**: 녹색(긍정적 효과: +/x)과 빨간색(부정적 효과: -/÷)의 강렬한 대비.
    - **아이콘 및 숫자**: 게이트 중앙에 직관적인 수학 연산 기호(+, -, x, ÷)와 숫자를 크게 배치.
    - **프레임**: 게이트 주변에 빛나는 테두리(Neon Glow)를 두어 포털 느낌 강조.
- **게이트(Gate) 활용 아이디어 (완료)**:
    - **기본 연산 게이트**: 기존의 +, -, x, ÷ 연산 게이트. (통과 시 즉시 적용)
    - **특수 게이트 (Shoot-to-Obtain)**: TIME_WARP, ELEMENT_INFUSION, SHIELD_GENERATOR, SPLIT 게이트는 총으로 쏴서 파괴해야 아이템을 드랍함. (완료)
- **게이트 생성 프롬프트**:
    - "A 3D glossy game gate, Last War mobile game style, vibrant green or red neon glow, clear math operation symbol (+, -, x, ÷) in the center, futuristic portal frame, studio lighting, isolated on white background."
- **추천 AI 모델**: `gemini-3.1-flash-image-preview` (고품질 3D 에셋 생성용)

최신 캐주얼 액션 및 로그라이트(Roguelite) 게임 트렌드(예: 뱀파이어 서바이버, 스쿼드 버스터즈, 브롤스타즈 등)를 반영하여 게임의 깊이와 리텐션(유지율)을 높일 수 있는 추가 구현 제안입니다.

### Phase 5: Modern Trends & Polishing (진행 중)
1.  **Boss Low Health Aura Effect**: 보스 체력이 낮을 때 상태에 따른 색상 변화 및 맥동하는 오라 효과 추가. (완료)
2.  **Stage Clear Timer Enhancement**: 보스 처치 후 스테이지 클리어 메시지 2초간 유지. (완료)
3.  **Critical Item Bullet Image Change**: 크리티컬 아이템 획득 시 탄환 이미지 변경 시스템. (해야 할 일)
    - 설명: 크리티컬 아이템 획득 시, 일정 시간 동안 탄환의 외형을 더 강력하거나 화려한 이미지로 변경하여 시각적 피드백 강화.
    - 구현 프롬프트: "Implement a mechanic where picking up a 'Critical' item changes the bullet sprite to a more powerful or glowing version for a limited duration, providing clear visual feedback."

#### 0. Boss Destruction & Stage Transition (보스 파괴 및 화면 전환) - (완료)
- **설명**: 보스 처치 시 화려한 파괴 이펙트와 함께 화면이 자연스럽게 다음 스테이지로 전환되도록 합니다.
- **보스 파괴 프롬프트**: "A dramatic 3D boss destruction effect, massive explosion of particles, screen shake, slow motion, debris flying, fading out, cinematic, high quality."
- **화면 전환 프롬프트**: "A smooth stage transition effect, fade to black, 'STAGE CLEAR' text animation, dynamic camera zoom out, loading next stage, cinematic, polished."

#### 1. 로그라이트 스킬 선택 (Roguelite Skill Selection) - (완료)
- **설명**: 스테이지 클리어 또는 레벨업 시, 3개의 무작위 스킬/버프 중 하나를 선택하는 시스템입니다. 매 판마다 다른 빌드(관통탄, 독 장판, 최대 체력 증가 등)를 구성하는 재미를 주어 반복 플레이 가치를 높입니다.
- **구현 프롬프트**: `"Implement a roguelite skill selection modal that appears when a player levels up or clears a stage. It should present 3 random perks from a predefined list, allowing the player to choose one to apply to their squad."`

#### 2. 캐릭터 융합/진화 시스템 (Character Fusion/Evolution)
- **설명**: 스쿼드 버스터즈처럼 같은 종류의 캐릭터를 3마리 모으면, 거대하고 강력한 '엘리트' 캐릭터 하나로 융합되는 시스템입니다. 무작정 숫자를 늘리는 것보다 전략적인 캐릭터 수집을 유도합니다.
- **구현 프롬프트**: `"Add a character fusion mechanic. When the player collects 3 of the same character type (e.g., 3 cats), merge them into a single 'Elite' version with increased size, health, and a unique attack pattern."`

#### 3. 액티브 대시/회피기 (Active Dash/Dodge Roll)
- **설명**: 스페이스바나 우클릭을 눌러 짧은 거리를 빠르게 이동하며 무적 판정(i-frame)을 받는 회피기입니다. 보스의 강력한 공격 패턴을 피하는 컨트롤 요소를 추가하여 액션성을 강화합니다.
- **구현 프롬프트**: `"Add an active dash mechanic for the player squad. When the dash key is pressed, the squad moves quickly in the current direction with a short invincibility frame, followed by a cooldown period."`

#### 4. 환경 상호작용 오브젝트 (Interactive Environment)
- **설명**: 공격하면 폭발하여 주변 적에게 피해를 주는 '폭약통', 밟으면 일시적으로 빨라지는 '가속 패드', 숨을 수 있는 '수풀' 등 맵에 전략적 요소를 추가합니다.
- **구현 프롬프트**: `"Add interactive environmental objects to the canvas, such as explosive barrels that damage nearby enemies when destroyed, and speed pads that temporarily boost player movement speed."`

#### 5. 업적 및 일일 퀘스트 (Achievements & Daily Quests)
- **설명**: "슬라임 100마리 처치", "스테이지 5 도달" 등의 목표를 제공하고, 달성 시 상점 코인이나 특별한 스킨을 보상으로 지급하여 플레이 동기를 부여합니다.
- **구현 프롬프트**: `"Implement an achievement and quest system. Track stats like enemies killed and stages cleared, and reward the player with coins when specific milestones are reached. Add a UI modal to view progress."`

#### 6. Enemy Character Descriptions (적 캐릭터 설명)
- **일반 슬라임 (Slime)**: 가장 기본적인 적입니다. 둥글고 귀여운 외형을 가졌으며, 특별한 능력은 없지만 물량으로 플레이어를 압박합니다.
- **불 슬라임 (Fire Slime)**: 머리에 불꽃이 타오르는 슬라임입니다. 플레이어에게 화염 피해를 입히며, 처치 시 짧은 화염 장판을 남깁니다.
- **얼음 슬라임 (Ice Slime)**: 얼음 결정으로 이루어진 슬라임입니다. 플레이어의 이동 속도를 늦추는 냉기 공격을 합니다.
- **독 슬라임 (Poison Slime)**: 보라색 몸체에 독 기운을 뿜어내는 슬라임입니다. 플레이어에게 지속적인 독 피해를 입힙니다.
- **폭탄 슬라임 (Bomb Slime)**: 머리에 도화선이 달린 검은색 슬라임입니다. 플레이어에게 접근하여 폭발하며 광역 피해를 입힙니다.

---

## 🎨 Nano Banana Asset Prompts (3D 에셋 생성 프롬프트)

### 💡 3D 에셋 생성 핵심 조건 (공통 프롬프트 가이드)
- **시점 (Perspective)**: `Top-down perspective` 또는 `Slightly angled top-down view` (위에서 내려다보는 시점)
- **조명 (Lighting)**: `Studio lighting, rim lighting, soft ambient occlusion` (어두운 배경에서도 캐릭터가 돋보이도록 림 라이팅 강조)
- **재질 (Material)**: `Glossy, soft plastic/clay feel, vibrant colors, stylized 3D render, high quality` (부드럽고 쨍한 색감의 3D 재질)
- **배경 (Background)**: `Isolated on a pure white background for easy cutout` (배경 제거가 쉽도록 순백색 배경 지정)

### 🖼️ SVG 대체 3D 에셋 생성 프롬프트 (UI 및 게임 요소)
- **공통 프롬프트**: "A 3D glossy icon of [ITEM_NAME], stylized, vibrant colors, studio lighting, isolated on white background."
- **예시**:
    - **상점 아이콘**: "A 3D glossy icon of a shopping cart, stylized, vibrant colors, studio lighting, isolated on white background."
    - **설정 아이콘**: "A 3D glossy icon of a gear, stylized, vibrant colors, studio lighting, isolated on white background."
    - **정보 아이콘**: "A 3D glossy icon of an info sign, stylized, vibrant colors, studio lighting, isolated on white background."
    - **일시정지 아이콘**: "A 3D glossy icon of a pause button, stylized, vibrant colors, studio lighting, isolated on white background."

---

---

### 1. 적 캐릭터 (Enemies) - [완료]
- **일반 슬라임**: "A cute 3D rendered green slime monster for a modern mobile game. Top-down perspective, facing forward. Glossy soft plastic material, vibrant green color, cute big eyes. Studio lighting with rim lighting for a clear silhouette. Isolated on a pure white background."
- **불 슬라임**: "A cute 3D rendered red slime monster with a stylized flame burning on its head. Top-down perspective, facing forward. Glossy material, vibrant fiery colors. Studio lighting with rim lighting. Isolated on a pure white background."
- **얼음 슬라임**: "A cute 3D rendered light blue ice slime monster with frost and crystal details. Top-down perspective, facing forward. Translucent icy material, vibrant colors. Studio lighting with rim lighting. Isolated on a pure white background."
- **독 슬라임**: "A cute 3D rendered purple poison slime monster with bubbling toxic details. Top-down perspective, facing forward. Glossy wet material, vibrant purple and neon green colors. Studio lighting with rim lighting. Isolated on a pure white background."
- **폭탄 슬라임**: "A cute 3D rendered black bomb monster with a lit sparking fuse on its head. Top-down perspective, facing forward. Smooth matte black material with glowing sparks. Studio lighting with rim lighting. Isolated on a pure white background."
- **화난 보라색 몬스터 (첨부 이미지)**: "A 2D game sprite of a cute but angry purple blob monster. It has a semi-circular dome shape with a flat bottom, thick black angry eyebrows, big white eyes with black pupils, and a small purple tail curling out from the left side. The style is flat, colorful, and cartoonish, suitable for a mobile game. Isolated on a pure white background."

### 2. 보스 몬스터 (Bosses) - [해야 할 일]
- **Inferno King**: "A spherical fire elemental boss monster, glowing magma core with cracked dark obsidian crust, wearing a small golden crown on top, intense heat distortion, fiery aura, glowing angry eyes, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Ice Monarch**: "A spherical ice elemental boss monster, made of sharp translucent blue crystals and snowflakes, freezing aura, cold mist surrounding it, sharp glowing blue eyes, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Vortex Bringer**: "A spherical water elemental boss monster, swirling liquid vortex dynamics, splashing water droplets, deep ocean blue colors, glowing cyan eyes, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Thunder Dragon**: "A spherical dragon-themed boss monster, greyish-blue scales, sharp horns, glowing green eyes, crackling lightning aura, electricity sparking around it, fierce expression, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Toxic Cloud**: "A spherical poison elemental boss monster, bumpy green toxic surface, dripping green acid, surrounded by swirling toxic gas clouds, glowing yellow eyes, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Acid Stalker**: "A spherical acid boss monster with insectoid features, dark green chitinous shell, dripping corrosive acid, sharp mandibles, multiple glowing green eyes, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Volt Spiker**: "A spherical electric boss monster, deep purple and blue core, radiating sharp glowing pink and purple energy spikes, crackling electricity, intense glowing eyes, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Rock Cracker**: "A spherical earth elemental boss monster, made of solid brown rocks and boulders, equipped with a sharp metal drill on top and bottom, glowing white eyes, dust particles, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Beam Sentinel**: "A spherical mechanical boss monster, futuristic sci-fi design, central glowing blue camera lens eye, surrounded by floating metallic rings, sleek white and grey metal plating, laser energy, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Void Glitch / Void Entity**: "A spherical void boss monster, pitch black dark matter core, glowing purple eyes, surrounded by digital cyan and magenta glitch effects, reality-bending aura, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Ancient Core**: "A spherical ancient mechanical boss monster, made of rusty bronze and copper gears, intricate clockwork mechanisms, central keyhole, glowing warm light from inside, steampunk style, 3D render, octane render, unreal engine 5, high detail, isometric game asset, spherical shape, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."

### 3. 캐릭터 (Characters) - [해야 할 일]
- **Stage 1 (Basic Form)**: "A cute, small, spherical animal character (like a brave little puppy or fox), simple and adorable, soft fur, big determined eyes, no armor, 3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Stage 2 (Novice Adventurer)**: "A small spherical animal character wearing a light leather helmet and a tiny red scarf, looking slightly more confident, holding a small wooden shield, 3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Stage 3 (Elite Warrior)**: "A medium-sized spherical animal character wearing shiny steel armor and a glowing blue pendant, holding a glowing sword, confident and strong expression, faint magical aura, 3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Stage 4 (Awakened Hero)**: "A large, fierce spherical animal character clad in heavy golden paladin armor, wielding a massive glowing energy weapon, surrounded by a swirling aura of light and lightning, majestic and powerful, 3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."
- **Stage 5 (Legendary Avatar)**: "A massive, god-like spherical animal character, wearing intricate glowing divine armor, floating above the ground, radiating blinding golden and blue holy light, majestic energy wings, ultimate power, 3D render, octane render, unreal engine 5, high detail, isometric game asset, transparent background, cinematic lighting, vibrant colors, masterpiece, 8k resolution."

### 4. 아이템 및 재화 (Items & Currency) - [완료]
- **코인 (재화)**: "A high-quality 3D rendered shiny thick gold coin with a star symbol in the center. Isometric top-down view. Glossy metallic material, vibrant yellow and gold colors, glowing effect. Isolated on a pure white background."
- **회복 아이템 (하트)**: "A high-quality 3D rendered plump, glossy red heart. Isometric top-down view. Soft plastic material, vibrant red color, studio lighting with bright highlights. Isolated on a pure white background."
- **자석 아이템**: "A high-quality 3D rendered red and silver horseshoe magnet with stylized blue lightning sparks. Isometric top-down view. Glossy material, vibrant colors. Isolated on a pure white background."
- **폭탄 아이템**: "A high-quality 3D rendered classic round black bomb with a glowing, sparking fuse. Isometric top-down view. Matte black texture with bright sparks. Isolated on a pure white background."
- **피버 아이템 (번개)**: "A high-quality 3D rendered thick, glossy yellow lightning bolt. Isometric top-down view. Vibrant glowing yellow material, energetic feel. Isolated on a pure white background."
- **드론 아이템 (Drone)**: "A high-quality 3D rendered small futuristic combat drone, spherical body with glowing blue lights, small propellers, isometric top-down view, isolated on white background."
- **보호막 아이템 (Shield)**: "A high-quality 3D rendered translucent blue energy shield bubble, hexagonal patterns, glowing edges, isometric top-down view, isolated on white background."
- **빙결 아이템 (Freeze)**: "A high-quality 3D rendered sharp blue ice crystal, frosty aura, translucent material, isometric top-down view, isolated on white background."
- **크리티컬 아이템 (Crit)**: "A high-quality 3D rendered golden star with a sharp '!' mark, glowing effect, isometric top-down view, isolated on white background."
- **화염 탄환 (Fire Ammo)**: "A high-quality 3D rendered bullet with a burning flame trail, vibrant orange and red, isometric top-down view, isolated on white background."
- **독 탄환 (Poison Ammo)**: "A high-quality 3D rendered bullet dripping with green toxic liquid, bubbling effect, isometric top-down view, isolated on white background."
- **얼음 탄환 (Ice Ammo)**: "A high-quality 3D rendered bullet made of sharp ice, frosty trail, isometric top-down view, isolated on white background."
- **유도 탄환 (Homing Ammo)**: "A high-quality 3D rendered purple energy projectile with a spiral trail, glowing core, isometric top-down view, isolated on white background."

### 5. 캐릭터 탄환 (Character Bullets) - [해야 할 일]
- **공통 스타일**: "A high-quality 3D rendered projectile for a mobile game, stylized, vibrant colors, glowing effect, isometric view, isolated on a pure white background."
- **기본 탄환 (Normal)**: "A high-quality 3D rendered glowing yellow energy sphere, vibrant yellow and white, soft glow, isometric top-down view, isolated on white background."
- **화염 탄환 (Fire)**: "A high-quality 3D rendered fiery bullet with a burning flame trail, vibrant orange and red, isometric top-down view, isolated on white background."
- **얼음 탄환 (Ice)**: "A high-quality 3D rendered icy bullet with sharp crystal edges, frosty blue, isometric top-down view, isolated on white background."
- **독 탄환 (Poison)**: "A high-quality 3D rendered toxic bullet dripping with green acid, bubbling effect, vibrant green, isometric top-down view, isolated on white background."
- **유도 탄환 (Homing)**: "A high-quality 3D rendered purple energy projectile with a spiral trail, glowing core, isometric top-down view, isolated on white background."
- **전기 탄환 (Electric)**: "A high-quality 3D rendered electric bullet with crackling lightning sparks, glowing purple and blue, isometric top-down view, isolated on white background."
- **레이저 탄환 (Laser)**: "A high-quality 3D rendered long, thin laser beam projectile, glowing cyan, intense energy, isometric top-down view, isolated on white background."

### Phase 6: Skill & Balance (완료)
- **Skill Balance Pass**:
    - "Piercing Bullets": 10% 확률 기반으로 변경 및 설명 문구 수정. (완료)
    - "Damage Up": 20% -> 5%로 하향 조정 (난이도 상승). (완료)
    - "Ghost Bullets": +2 enemies -> +1 enemies로 하향 조정 (난이도 상승). (완료)
- **New Skill Ideas**:
    - "Vampiric Bullets": 적 타격 시 입힌 데미지의 1%만큼 체력 회복. (완료)
    - "Explosive Bullets": 탄환 타격 시 10% 확률로 폭발하여 주변 광역 피해. (완료)
    - "Speedy Squad": 스쿼드 이동 속도 10% 증가. (완료)

### Phase 7: Mobile Optimization & Stability (완료)
- **고정 타임스텝(Fixed Time Step) 도입**: 120Hz 등 고주사율 모바일 기기에서 게임이 비정상적으로 빠르게 실행되는 문제 해결. (완료)
- **모바일 레이아웃 최적화**: 옆면 스크롤바 제거, `100dvh` 및 `fixed` 포지션을 이용한 화면 고정, UI 요소 크기 조정을 통해 핸드폰 화면에 완벽하게 맞춤. (완료)

### Phase 8: Persistence & Social (진행 예정)
- **Firebase 연동 (Persistence)**: 획득한 코인, 업그레이드 상태, 최고 기록 등을 서버에 저장하여 기기를 변경해도 유지되도록 구현.
- **글로벌 랭킹 시스템 (Leaderboard)**: Firebase를 활용하여 전 세계 플레이어들과 점수를 경쟁하는 리더보드 구현.
- **사운드 시스템 구현 (Audio)**: 배경음악(BGM) 및 효과음(SFX)을 실제 게임 로직에 연결하여 몰입감 강화.
- **캐릭터 진화 시스템 (Evolution)**: 동일한 캐릭터 3마리 수집 시 더 강력한 '엘리트' 캐릭터로 합체되는 시스템.

### 6. UI 및 기타 (UI & Misc) - [해야 할 일]
- **상점 아이콘**: "A high-quality 3D rendered wooden treasure chest overflowing with shiny gold coins and glowing gems. Isometric view. Stylized mobile game UI asset, vibrant colors, glossy finish. Isolated on a pure white background."
- **업그레이드 아이콘 (검)**: "A high-quality 3D rendered shiny steel broadsword with a glowing blue hilt. Isometric view. Stylized mobile game UI asset, metallic reflections. Isolated on a pure white background."
- **업그레이드 아이콘 (신발)**: "A high-quality 3D rendered winged boot. Isometric view. Stylized mobile game UI asset, vibrant colors, implying speed and agility. Isolated on a pure white background."

### 7. 스테이지 배경 (Stage Backgrounds) - [해야 할 일]
- **공통 스타일**: "Vertical scrolling background for a mobile game, top-down view, seamless texture, stylized 3D environment, vibrant colors, 8k resolution."
- **Stage 1 (Fire/Magma)**: "A volcanic landscape with flowing lava rivers, dark obsidian rocks, glowing embers, intense heat distortion, top-down view, seamless."
    - ![Stage 1 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838062157.png)
- **Stage 2 (Ice/Tundra)**: "A frozen tundra with cracked blue ice, snow-covered pine trees, frosty mist, sparkling snowflakes, top-down view, seamless."
    - ![Stage 2 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838100992.png)
- **Stage 3 (Water/Ocean)**: "A deep blue ocean surface with swirling whirlpools, coral reefs visible underwater, tropical islands, splashing waves, top-down view, seamless."
    - ![Stage 3 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838107624.png)
- **Stage 4 (Thunder/Storm)**: "A dark stormy sky with crackling lightning bolts, dark grey clouds, rain streaks, electric atmosphere, top-down view, seamless."
    - ![Stage 4 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838112826.png)
- **Stage 5 (Poison/Swamp)**: "A murky green swamp with bubbling toxic pools, overgrown thorny vines, purple fog, glowing mushrooms, top-down view, seamless."
    - ![Stage 5 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838117211.png)
- **Stage 6 (Acid/Cave)**: "A deep cavern with dripping green acid stalactites, glowing radioactive crystals, dark damp rocks, top-down view, seamless."
    - ![Stage 6 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838121010.png)
- **Stage 7 (Electric/Tech)**: "A futuristic tech floor with glowing circuit patterns, neon blue lines, metallic plates, sparking wires, top-down view, seamless."
    - ![Stage 7 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838125628.png)
- **Stage 8 (Rock/Desert)**: "A rugged desert canyon with red sandstone rocks, dry cracked earth, scattered boulders, dust swirls, top-down view, seamless."
    - ![Stage 8 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838131194.png)
- **Stage 9 (Laser/Factory)**: "A high-tech factory floor with moving conveyor belts, glowing red laser security grids, metallic pipes, industrial lighting, top-down view, seamless."
    - ![Stage 9 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838134173.png)
- **Stage 10 (Void/Glitch)**: "A surreal void dimension with floating digital fragments, purple nebula clouds, glitchy reality patches, abstract geometry, top-down view, seamless."
    - ![Stage 10 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838137838.png)
- **Stage 11 (Void Core)**: "The heart of the void, intense purple and magenta energy swirls, dark matter vortex, reality-bending distortions, top-down view, seamless."
    - ![Stage 11 Background](/Vertical_scrolling_background_for_a_mobile_game_A-1773838141039.png)
- **Stage 12 (Ancient/Clockwork)**: "An ancient mechanical world with giant brass gears, copper pipes, steam vents, intricate clockwork floor, warm golden lighting, top-down view, seamless."
    - ![Stage 12 Background](/Vertical_scrolling_background_for_a_mobile_game_T-1773838143937.png)

## 🎵 Sound Effects & Background Music (효과음 및 배경음악)

### Phase 9: Modern SFX Update (최신 트렌드 반영)
- **설명**: 기존의 고전적인 효과음을 최신 3D 게임 트렌드에 맞춰 더 입체적이고 만족스러운 사운드로 교체합니다.
- **구현 프롬프트**:
    - **사격**: "Modern sci-fi energy weapon firing sound, punchy, futuristic, high-fidelity, satisfying impact."
    - **적 피격**: "Crisp, modern hit marker sound, satisfying squishy, pop, or soft impact, cute and rewarding, 3D spatial audio feel, high-fidelity."
    - **아이템 획득**: "Modern sleek UI notification sound, bright, rewarding, high-tech chime, high-fidelity."
    - **피버 모드**: "Epic cinematic bass drop power-up sound, rising futuristic synth, intense energy surge, high-fidelity."
    - **보스 파괴**: "Massive, cinematic sci-fi explosion sound, deep sub-bass, satisfying shockwave, high-fidelity."

### 💡 사운드 디자인 컨셉
- **배경음악 (BGM)**: 게임의 진행 속도감과 긴장감을 높이는 업비트의 아케이드/칩튠 스타일. 스테이지 테마에 맞춰 분위기 변화(예: 보스전은 더 강렬하게).
- **효과음 (SFX)**: 캐릭터의 사격, 적 피격, 아이템 획득, 피버 모드 발동 등 게임 내 상호작용에 대한 즉각적이고 명확한 피드백.

### 🛠️ 추천 AI 도구
- **배경음악 (BGM)**: 
    - [Suno AI](https://suno.com/): 고품질의 완성된 곡 생성에 탁월.
    - [Udio](https://www.udio.com/): 창의적이고 다양한 장르의 음악 생성 가능.
- **효과음 (SFX)**:
    - [ElevenLabs Sound Effects](https://elevenlabs.io/sound-effects): 텍스트 프롬프트로 고품질 효과음 생성.
    - [Stable Audio](https://stableaudio.com/): 짧고 명확한 효과음 생성에 유용.
    - [MyEdit](https://myedit.online/): 간단한 효과음 편집 및 생성.

### 📝 생성 프롬프트 가이드 (최신 3D 게임 트렌드 반영)
- **BGM (메인 테마)**: "Modern upbeat electronic dance music for a 3D action mobile game, punchy bass, energetic synthwave, high-fidelity, loopable, high quality."
- **BGM (보스전)**: "Intense modern boss battle music, heavy bass drops, cinematic hybrid orchestral with aggressive cyber-electronic elements, high tension, epic, loopable."
- **SFX (사격)**: "Modern sci-fi energy weapon firing sound, punchy, futuristic, high-fidelity, satisfying impact."
- **SFX (적 피격)**: "Crisp, modern hit marker sound, satisfying squishy or metallic impact, 3D spatial audio feel, high-fidelity."
- **SFX (아이템 획득)**: "Modern sleek UI notification sound, bright, rewarding, high-tech chime, high-fidelity."
- **SFX (피버 모드 발동)**: "Epic cinematic bass drop power-up sound, rising futuristic synth, intense energy surge, high-fidelity."
- **SFX (보스 파괴)**: "Massive, cinematic sci-fi explosion sound, deep sub-bass, satisfying shockwave, high-fidelity."

### 8. 보스 탄환 (Boss Bullets) - [해야 할 일]
- **공통 스타일**: "A high-quality 3D rendered projectile for a mobile game, stylized, vibrant colors, glowing effect, isometric view, isolated on a pure white background."
- **화염 탄환**: "A high-quality 3D rendered fiery bullet with a burning flame trail, vibrant orange and red, isometric top-down view, isolated on white background."
- **얼음 탄환**: "A high-quality 3D rendered icy bullet with sharp crystal edges, frosty blue, isometric top-down view, isolated on white background."
- **독 탄환**: "A high-quality 3D rendered toxic bullet dripping with green acid, bubbling effect, vibrant green, isometric top-down view, isolated on white background."
- **전기 탄환**: "A high-quality 3D rendered electric bullet with crackling lightning sparks, glowing purple and blue, isometric top-down view, isolated on white background."
- **레이저 탄환**: "A high-quality 3D rendered long, thin laser beam projectile, glowing cyan, intense energy, isometric top-down view, isolated on white background."
