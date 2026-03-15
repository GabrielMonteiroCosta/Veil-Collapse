import { PixelGrid } from '@/components/PixelSprite'

// Color palette aliases
const _ = null
const SK = '#f4c48a' // skin
const SD = '#e0a870' // skin dark
const HR = '#c07820' // hair warm brown
const HD = '#8c5010' // hair dark
const EY = '#204090' // eyes blue
const MT = '#b06860' // mouth
const TN = '#3060c0' // tunic blue
const T2 = '#2048a0' // tunic dark
const BT = '#f0c040' // belt gold
const PN = '#203080' // pants
const P2 = '#162060' // pants dark
const BO = '#1a1a30' // boots
const SW = '#d8e8ff' // sword blade
const SL = '#b0c8ff' // sword glow
const SH = '#c09030' // sword hilt
const SG = '#403010' // sword guard

// Lumi — 14 wide × 24 tall, pixelSize = 4 → 56 × 96 px
export const lumiSprite: PixelGrid = [
  // row 0 — hair top
  [_, _, _, HR, HR, HR, HR, HR, HR, HR, _, _, _, _],
  // row 1 — hair
  [_, _, HR, HR, HR, HR, HR, HR, HR, HR, HR, _, _, _],
  // row 2 — hair shadow
  [_, HD, HD, HR, HR, HR, HR, HR, HR, HR, HR, HD, _, _],
  // row 3 — head top
  [_, _, SK, SK, SK, SK, SK, SK, SK, SK, SK, _, _, _],
  // row 4 — head (forehead)
  [_, _, SK, SK, SK, SK, SK, SK, SK, SK, SK, _, _, _],
  // row 5 — eyes
  [_, _, SK, EY, SK, SK, SK, EY, SK, SK, SK, _, _, _],
  // row 6 — nose
  [_, _, SK, SK, SD, SK, SK, SK, SD, SK, SK, _, _, _],
  // row 7 — mouth
  [_, _, SK, SK, SK, MT, MT, SK, SK, SK, _, _, _, _],
  // row 8 — chin
  [_, _, _, SK, SK, SK, SK, SK, SK, SK, _, _, _, _],
  // row 9 — neck + shoulders
  [_, TN, TN, TN, SK, SK, SK, SK, SK, TN, TN, TN, _, _],
  // row 10 — torso top + sword arm
  [SW, SL, TN, TN, TN, TN, TN, TN, TN, TN, T2, _, _, _],
  // row 11 — sword hilt
  [SH, SG, TN, TN, TN, TN, TN, TN, TN, TN, T2, _, _, _],
  // row 12 — torso
  [_, _, TN, TN, TN, TN, TN, TN, TN, TN, T2, _, _, _],
  // row 13 — torso lower
  [_, _, TN, TN, TN, TN, TN, TN, TN, TN, T2, _, _, _],
  // row 14 — belt
  [_, _, BT, BT, BT, BT, BT, BT, BT, BT, BT, _, _, _],
  // row 15 — upper leg separator
  [_, _, T2, T2, T2, _, _, T2, T2, T2, _, _, _, _],
  // row 16 — upper legs
  [_, _, PN, PN, PN, _, _, PN, PN, PN, _, _, _, _],
  // row 17 — mid legs
  [_, _, PN, PN, PN, _, _, PN, PN, PN, _, _, _, _],
  // row 18 — lower legs
  [_, _, P2, P2, PN, _, _, PN, P2, P2, _, _, _, _],
  // row 19 — boot top
  [_, _, BO, BO, BO, _, _, BO, BO, BO, _, _, _, _],
  // row 20 — boot
  [_, _, BO, BO, BO, BO, _, BO, BO, BO, BO, _, _, _],
  // row 21 — boot shadow
  [_, BO, BO, BO, BO, BO, _, BO, BO, BO, BO, BO, _, _],
]

// Aya colors
const AH = '#7b28c8' // hair purple
const AD = '#5a1090' // hair dark
const AL = '#c080ff' // hair highlight
const AE = '#a040ff' // eyes purple
const AD2= '#40108a' // dress dark
const AS = '#6020b8' // dress
const AC = '#d0a0ff' // dress accent
const AG = '#9050d0' // dress mid
const AM = '#e8a0a0' // mouth pink

// Aya — 14 wide × 24 tall
export const ayaSprite: PixelGrid = [
  // row 0 — long hair top
  [_, _, AL, AH, AH, AH, AH, AH, AH, AH, AL, _, _, _],
  // row 1 — hair
  [_, AL, AH, AH, AH, AH, AH, AH, AH, AH, AH, AL, _, _],
  // row 2 — hair shadow
  [AD, AH, AH, AH, AH, AH, AH, AH, AH, AH, AH, AH, AD, _],
  // row 3 — head
  [AD, _, SK, SK, SK, SK, SK, SK, SK, SK, SK, _, AD, _],
  // row 4 — head
  [AD, _, SK, SK, SK, SK, SK, SK, SK, SK, SK, _, AD, _],
  // row 5 — eyes
  [AD, _, SK, AE, SK, SK, SK, AE, SK, SK, SK, _, AD, _],
  // row 6 — nose
  [AD, _, SK, SK, SD, SK, SK, SK, SD, SK, SK, _, AD, _],
  // row 7 — mouth
  [_, _, _, SK, SK, AM, AM, SK, SK, SK, _, _, AD, _],
  // row 8 — chin
  [_, _, _, SK, SK, SK, SK, SK, SK, SK, _, _, _, _],
  // row 9 — neck + shoulders (hair falls down sides)
  [AD, AS, AS, AS, SK, SK, SK, SK, SK, AS, AS, AS, AD, _],
  // row 10 — dress top
  [AD, AS, AS, AG, AG, AG, AG, AG, AG, AG, AS, AS, AD, _],
  // row 11 — dress
  [AD, AS, AC, AG, AS, AS, AS, AS, AS, AG, AC, AS, AD, _],
  // row 12 — dress mid
  [AD, AS, AS, AS, AS, AS, AS, AS, AS, AS, AS, AS, AD, _],
  // row 13 — dress lower
  [AD, AD2, AS, AS, AS, AS, AS, AS, AS, AS, AS, AD2, AD, _],
  // row 14 — dress skirt
  [_, AD2, AS, AC, AS, AS, AS, AS, AS, AC, AS, AD2, _, _],
  // row 15 — skirt flare
  [_, _, AD2, AS, AS, AC, AC, AC, AS, AS, AD2, _, _, _],
  // row 16 — legs
  [_, _, _, SK, SK, SK, _, SK, SK, SK, _, _, _, _],
  // row 17 — legs
  [_, _, _, SK, SK, SK, _, SK, SK, SK, _, _, _, _],
  // row 18 — lower legs
  [_, _, _, SD, SK, SK, _, SK, SK, SD, _, _, _, _],
  // row 19 — shoes
  [_, _, _, AD, AD, AD, _, AD, AD, AD, _, _, _, _],
  // row 20 — shoes
  [_, _, _, AD, AD, AD, AD, AD, AD, AD, _, _, _, _],
  // row 21 — shoes shadow
  [_, _, AD, AD, AD, AD, AD, AD, AD, AD, AD, _, _, _],
]
