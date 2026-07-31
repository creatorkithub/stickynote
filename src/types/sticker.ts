export type StickerBadgeType =
    | 'check'
    | 'cross'
    | 'thumbs-up'
    | 'thumbs-down'
    | 'smile'
    | 'sad'
    | 'question'
    | 'alert'
    | 'star-bronze'
    | 'star-silver'
    | 'star-gold'
    | 'heart'
    | 'zap'
    | 'bulb'
    | 'arrow-straight'
    | 'arrow-curved'
    | 'arrow-stepped'
    | 'arrow-dot';

export interface CanvasSticker {
    id?: number;
    badgeType: StickerBadgeType;
    x: number;
    y: number;
    size: number;
    rotation: number;
    zIndex: number;
    updatedAt: number;
}

export interface BadgeDefinition {
    type: StickerBadgeType;
    label: string;
    bgHex: string;
    textHex: string;
    iconSvg: string; // SVG path or path string
    isArrow?: boolean;
}

export const BADGE_DEFINITIONS: Record<StickerBadgeType, BadgeDefinition> = {
    'check': {
        type: 'check',
        label: 'Approved / Done',
        bgHex: '#4CAF50',
        textHex: '#FFFFFF',
        iconSvg: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'
    },
    'cross': {
        type: 'cross',
        label: 'Rejected / Cancel',
        bgHex: '#E53935',
        textHex: '#FFFFFF',
        iconSvg: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
    },
    'thumbs-up': {
        type: 'thumbs-up',
        label: 'Thumbs Up',
        bgHex: '#8BC34A',
        textHex: '#FFFFFF',
        iconSvg: 'M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z'
    },
    'thumbs-down': {
        type: 'thumbs-down',
        label: 'Thumbs Down',
        bgHex: '#E91E63',
        textHex: '#FFFFFF',
        iconSvg: 'M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z'
    },
    'smile': {
        type: 'smile',
        label: 'Happy',
        bgHex: '#FFC107',
        textHex: '#FFFFFF',
        iconSvg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z'
    },
    'sad': {
        type: 'sad',
        label: 'Sad',
        bgHex: '#448AFF',
        textHex: '#FFFFFF',
        iconSvg: 'M12 2C6.47 2 2 6.48 2 12s4.47 10 10 10 10-4.48 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm7 0c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-3.5 3c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z'
    },
    'question': {
        type: 'question',
        label: 'Question',
        bgHex: '#0288D1',
        textHex: '#FFFFFF',
        iconSvg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z'
    },
    'alert': {
        type: 'alert',
        label: 'Important',
        bgHex: '#FF9800',
        textHex: '#FFFFFF',
        iconSvg: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
    },
    'star-bronze': {
        type: 'star-bronze',
        label: 'Bronze Rating',
        bgHex: '#A17A5A',
        textHex: '#FFFFFF',
        iconSvg: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
    },
    'star-silver': {
        type: 'star-silver',
        label: 'Silver Rating',
        bgHex: '#9E9E9E',
        textHex: '#FFFFFF',
        iconSvg: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
    },
    'star-gold': {
        type: 'star-gold',
        label: 'Gold Rating',
        bgHex: '#D4AF37',
        textHex: '#FFFFFF',
        iconSvg: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
    },
    'heart': {
        type: 'heart',
        label: 'Love / Favorite',
        bgHex: '#FF4081',
        textHex: '#FFFFFF',
        iconSvg: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
    },
    'zap': {
        type: 'zap',
        label: 'Lightning / Fast',
        bgHex: '#00BFA5',
        textHex: '#FFFFFF',
        iconSvg: 'M7 2v11h3v9l7-12h-4l4-8z'
    },
    'bulb': {
        type: 'bulb',
        label: 'Idea / Lightbulb',
        bgHex: '#00BCD4',
        textHex: '#FFFFFF',
        iconSvg: 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z'
    },
    'arrow-straight': {
        type: 'arrow-straight',
        label: 'Straight Arrow',
        bgHex: '#0288D1',
        textHex: '#FFFFFF',
        iconSvg: 'M5 19L19 5M19 5H9M19 5V15',
        isArrow: true
    },
    'arrow-curved': {
        type: 'arrow-curved',
        label: 'Curved Arrow',
        bgHex: '#00A76F',
        textHex: '#FFFFFF',
        iconSvg: 'M4 20C10 20 20 20 20 10M20 10L14 14M20 10L14 6',
        isArrow: true
    },
    'arrow-stepped': {
        type: 'arrow-stepped',
        label: 'Stepped Arrow',
        bgHex: '#6E32C9',
        textHex: '#FFFFFF',
        iconSvg: 'M4 20H12V8H20M20 8L15 3M20 8L15 13',
        isArrow: true
    },
    'arrow-dot': {
        type: 'arrow-dot',
        label: 'Dot Connector',
        bgHex: '#FF7043',
        textHex: '#FFFFFF',
        iconSvg: 'M4 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm2-2l13-9M19 8V15M19 8H12',
        isArrow: true
    }
};
