# 🎮 Animal Rush: Squad Survival

![Animal Rush Icon](/icon.png)

A high-octane bullet hell game featuring a growing squad of animals, math-based progression, and 12 unique elemental bosses.

## 🕹️ 게임 방법 (How to Play)

1.  **이동 (Movement)**: 마우스나 손가락을 드래그하여 스쿼드를 좌우로 움직이세요.
2.  **자동 사격 (Auto-Fire)**: 스쿼드는 자동으로 가장 가까운 적을 향해 사격합니다. 스쿼드 인원수가 많아질수록 화력이 기하급수적으로 강해집니다!
3.  **수학 게이트 (Math Gates)**:
    - ![Gate Add](/assets/items/heart.png) **파란색 게이트 (+, x)**: 통과하면 스쿼드 인원수가 늘어납니다. 최대한 많은 인원을 확보하세요!
    - **빨간색 게이트 (-, /)**: 인원수를 줄입니다. 피하거나 총을 쏴서 파괴하세요.
4.  **피버 모드 (Fever Mode)**: 적을 처치하거나 아이템을 먹어 게이지를 채우면 피버 타임이 발동합니다. 공격 속도가 대폭 상승합니다!
5.  **보스 전투 (Boss Battle)**: 스테이지 끝에는 강력한 보스가 기다리고 있습니다. 보스의 패턴을 파악하고 약점 속성을 공략하세요.

## 🎁 아이템 특징 (Item Features)

| 아이템 | 이미지 | 설명 |
| :--- | :---: | :--- |
| **코인** | ![Coin](/assets/items/coin.png) | 상점에서 영구적인 업그레이드를 구매하는 데 사용됩니다. |
| **하트** | ![Heart](/assets/items/heart.png) | 스쿼드의 체력을 회복시킵니다. |
| **쉴드** | ![Shield](/assets/items/shield.png) | 적의 공격을 한 번 막아주는 보호막을 생성합니다. |
| **폭탄** | ![Bomb](/assets/items/black_bomb.png) | 화면상의 모든 적과 탄환을 제거합니다. |
| **자석** | ![Magnet](/assets/items/magnet.png) | 주변의 모든 아이템을 끌어당깁니다. |
| **빙결** | ![Freeze](/assets/items/freeze.png) | 일정 시간 동안 모든 적의 움직임을 멈춥니다. |
| **드론** | ![Drone](/assets/items/drone.png) | 플레이어 주변을 돌며 자동으로 지원 사격을 하는 드론을 추가합니다. |

### 🚀 특수 탄환 (Special Ammo)
*속성 탄환은 중첩이 가능하며, 여러 속성을 동시에 가질 수 있습니다!*

- 🔥 **화염 탄환**: ![Fire](/assets/bullets/fire_bullet.png) 적에게 지속적인 화상 데미지를 입힙니다.
- ❄️ **빙결 탄환**: ![Ice](/assets/bullets/ice_bullet.png) 적의 이동 속도를 늦춥니다.
- ☠️ **독 탄환**: ![Poison](/assets/bullets/poison_bullet.png) 적의 방어력을 무시하고 지속 데미지를 입힙니다.
- ⚡ **전기 탄환**: ![Electric](/assets/bullets/electric_bullet.png) 적을 잠시 마비시키고 주변 적에게 전이됩니다.
- 🎯 **유도 탄환**: ![Homing](/assets/items/homing_ammo.png) 가장 가까운 적을 자동으로 추적합니다.
- 🔦 **레이저 탄환**: ![Laser](/assets/bullets/laser_bullet.png) 모든 적을 관통하는 강력한 광선을 발사합니다.

## 🦁 캐릭터 성장 (Character Growth)

스쿼드의 인원수가 늘어날수록 캐릭터는 5단계에 걸쳐 진화하며 더 크고 화려해집니다!

![Cat Evolution](/assets/animals/cat/cat1.png) → ![Cat 3](/assets/animals/cat/cat3.png) → ![Cat 5](/assets/animals/cat/cat5.png)

*자세한 성장 단계는 `Character.md`를 확인하세요.*

## 👾 엘리멘탈 보스 (Elemental Bosses)

각 스테이지마다 고유한 속성을 가진 보스가 등장합니다.

| 스테이지 | 보스 이름 | 속성 | 특징 |
| :--- | :--- | :--- | :--- |
| 1 | **Frost Wyrm** | 얼음 | 플레이어를 빙결시켜 이동을 방해합니다. |
| 2 | **Magma Worm** | 화염 | 바닥에 지속 데미지를 주는 화염 지대를 생성합니다. |
| 3 | **Toxic Mutant** | 독 | 화면 전체에 독 가스를 뿌려 지속 데미지를 입힙니다. |
| 4 | **Thunder Beast** | 전기 | 빠르고 불규칙한 움직임으로 공격합니다. |
| 5 | **Water Kraken** | 물 | 플레이어를 뒤로 밀쳐내는 파도를 생성합니다. |

*보스별 상세 공략은 `Boss.md`를 확인하세요.*

## 💻 기술 사양 (Technical Details)

- **Engine**: Custom HTML5 Canvas Engine.
- **Language**: TypeScript + React.
- **Styling**: Tailwind CSS.
- **Icons**: Lucide-React.

---
Developed with ❤️ using Google AI Studio.
