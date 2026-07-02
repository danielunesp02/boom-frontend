# Boom V2 Brand Foundation

## Decision

Start applying the Boom V2 identity incrementally through design tokens.

Do not redesign the whole app at once.

First target:

```text
Student Activity Player
```

## Why start with the player

The player is the most emotional and visible part of the student journey.

It must feel:

```text
premium
fun
touch-first
AI-supported
clear
recognizable
```

## Tokens introduced

```text
--boom-navy-950
--boom-purple-600
--boom-cyan-500
--boom-lime-400
--boom-lavender-100
--boom-gradient-primary
--boom-gradient-surface
--boom-radius-*
--boom-shadow-*
--boom-touch-target
```

## Visual identity direction

```text
deep navy as trust anchor
electric purple as primary action
cyan as intelligence/digital energy
lime as growth/progress/accent
soft neutrals for readability
large rounded cards
clear selected/correct/incorrect states
```

## Next brand tasks

```text
create SVG logo assets
create app icon
create subject icon set
create AI coach avatar
define typography stack
define product illustration language
create design-system primitives
```

## Implementation note

Current CSS token file:

```text
src/styles/boomBrand.css
```

The token file should later be imported globally by the app shell.
For now, the student player imports it directly.
