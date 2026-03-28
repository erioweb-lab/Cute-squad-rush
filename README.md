# 🎮 Animal Rush: Squad Survival

A high-octane bullet hell game featuring a growing squad of animals, math-based progression, and 12 unique elemental bosses.

## 🚀 Game Overview

In **Animal Rush**, you control a squad of animals (Cats, Dogs, or Rabbits). Your goal is to navigate through a dangerous field of slimes, pass through math gates to multiply your squad size, and survive intense boss encounters.

## 🕹️ 게임 방법 (How to Play)

1.  **이동**: 마우스나 손가락을 드래그하여 스쿼드를 좌우로 움직이세요.
2.  **사격**: 스쿼드가 자동으로 사격합니다. 스쿼드가 커질수록 더 많은 총알을 발사합니다!
3.  **수학 게이트**: 파란색 게이트(+, x)를 통과하여 스쿼드 크기를 늘리세요. 스쿼드를 줄이는 빨간색 게이트(-, /)는 피하거나 사격하여 파괴하세요.
4.  **피버 모드**: 아이템을 수집하여 피버 게이지를 채우세요. 피버 타임 동안에는 연사 속도가 두 배가 됩니다!
5.  **보스 전투**: 몇 스테이지마다 강력한 엘리멘탈 보스가 등장합니다. 각 보스는 속성(불, 얼음, 독 등)에 따른 고유한 공격 패턴을 가지고 있습니다.
6.  **코인**: 적과 보스를 처치하여 코인을 획득하세요. 코인을 사용하여 상점에서 스쿼드와 스킬을 업그레이드할 수 있습니다.

## 🛠️ Game Mechanics

### Squad Growth
- **CAT_SIZE**: Your base character size.
- **Formation**: Your squad automatically arranges itself in a tight formation.
- **Max Count**: Your squad can grow up to 120 members for maximum firepower.

### Items & Power-ups
- 🛡️ **Shield**: Protects you from one hit.
- 💣 **Bomb**: Clears all enemies on screen.
- 🧲 **Magnet**: Pulls all items towards you.
- ❄️ **Freeze**: Slows down all enemies for a short duration.
- 🔥 **Fire/Poison/Ice Ammo**: Changes your bullet type to deal elemental damage.

## 👾 Elemental Bosses

| Stage | Boss Name | Element | Special Ability |
| :--- | :--- | :--- | :--- |
| 1 | **Frost Wyrm** | ICE | Freezes players on hit |
| 2 | **Magma Worm** | FIRE | Leaves burning trails |
| 3 | **Toxic Mutant** | POISON | Deals damage over time |
| 4 | **Thunder Beast** | ELECTRIC | Fast, erratic movements |
| 5 | **Water Kraken** | WATERFALL | Pushes players back |
| ... | ... | ... | ... |
| Final | **Void Entity** | ALL | Uses all elemental powers |

## 🎨 Asset Generation (GEMS)

This game uses AI-generated assets. For the best results when creating your own characters, follow the guide in `image.md`.

### Boss Generation Prompts
All bosses are generated using **Gemini** with prompts focusing on:
- **3D Render Style**: Octane render for realistic lighting.
- **High Detail**: Volumetric lighting and cinematic composition.
- **Solid Background**: Essential for clean extraction.

## 💻 Technical Details

- **Engine**: Custom HTML5 Canvas Engine.
- **Language**: TypeScript + React.
- **Styling**: Tailwind CSS.
- **Icons**: Lucide-React.

---
Developed with ❤️ using Google AI Studio.
