/**
 * theme.js — Color Themes Configuration for Arrow Puzzle
 * 
 * 4 Distinct Themes:
 * - Midnight (Deep Cosmic Blue & Electric Cyan)
 * - Neon (Cyberpunk Violet & Hot Pink)
 * - Ocean (Deep Sea Abyss & Aquamarine)
 * - Aurora (Northern Lights Emerald & Mystic Gold)
 */

export const THEMES = {
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    description: 'Deep cosmic void with electric cyan arrows',
    previewColor: '#06b6d4',
    bgGradient: 'from-[#080c18] via-[#0a0f24] to-[#0f1738]',
    boardBg: '#090d1f',
    glassBorder: 'border-cyan-500/20',
    arrowDefault: '#22d3ee', // Cyan-400
    arrowHead: '#06b6d4',
    arrowBlocked: '#f43f5e', // Rose
    arrowHint: '#fbbf24',    // Amber
    glowColor: 'rgba(6, 182, 212, 0.45)',
    accentGradient: 'from-cyan-500 via-blue-500 to-violet-600',
    accentText: 'text-cyan-400',
    dotColor: 'rgba(100, 200, 255, 0.14)',
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    description: 'Cyberpunk radiance with vibrant magenta and lime',
    previewColor: '#f43f5e',
    bgGradient: 'from-[#120424] via-[#1a0736] to-[#25094d]',
    boardBg: '#15062a',
    glassBorder: 'border-fuchsia-500/25',
    arrowDefault: '#fb7185', // Rose-400
    arrowHead: '#f43f5e',
    arrowBlocked: '#ef4444',
    arrowHint: '#34d399',    // Emerald green
    glowColor: 'rgba(244, 63, 94, 0.45)',
    accentGradient: 'from-fuchsia-500 via-pink-500 to-rose-600',
    accentText: 'text-fuchsia-400',
    dotColor: 'rgba(244, 114, 182, 0.15)',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Bioluminescent deep sea with marine aquamarine',
    previewColor: '#38bdf8',
    bgGradient: 'from-[#021827] via-[#04243a] to-[#063352]',
    boardBg: '#031c2e',
    glassBorder: 'border-sky-500/25',
    arrowDefault: '#38bdf8', // Sky-400
    arrowHead: '#0284c7',
    arrowBlocked: '#f87171',
    arrowHint: '#2dd4bf',    // Teal
    glowColor: 'rgba(56, 189, 248, 0.45)',
    accentGradient: 'from-sky-500 via-teal-500 to-blue-600',
    accentText: 'text-sky-400',
    dotColor: 'rgba(56, 189, 248, 0.14)',
  },
  aurora: {
    id: 'aurora',
    name: 'Aurora',
    description: 'Northern lights mystic emerald and solar gold',
    previewColor: '#34d399',
    bgGradient: 'from-[#041a14] via-[#07261d] to-[#0c382b]',
    boardBg: '#051f18',
    glassBorder: 'border-emerald-500/25',
    arrowDefault: '#34d399', // Emerald-400
    arrowHead: '#059669',
    arrowBlocked: '#f87171',
    arrowHint: '#fbbf24',    // Gold
    glowColor: 'rgba(52, 211, 153, 0.45)',
    accentGradient: 'from-emerald-500 via-teal-500 to-amber-500',
    accentText: 'text-emerald-400',
    dotColor: 'rgba(52, 211, 153, 0.14)',
  },
};

export const THEME_IDS = Object.keys(THEMES);

export function getTheme(id) {
  return THEMES[id] || THEMES.midnight;
}
