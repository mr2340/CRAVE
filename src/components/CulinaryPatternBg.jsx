/**
 * CRAVE Culinary Pattern Overlay
 * Subtle vector doodle pattern with hand-drawn culinary elements:
 * Heirloom tomatoes, Tatashe peppers, firewood flame, garlic, herbs, cauldrons & cutlery.
 */
export default function CulinaryPatternBg({ opacity = 0.035, className = '', color = 'currentColor' }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity, color }}
      >
        <defs>
          <pattern
            id="crave-culinary-doodles"
            width="180"
            height="180"
            patternUnits="userSpaceOnUse"
          >
            {/* Tomato on vine */}
            <path
              d="M32 42 C24 36 16 46 20 56 C22 64 34 66 40 60 C48 52 40 36 32 42 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M30 36 C30 30 34 24 38 22 M30 36 C24 34 19 35 17 38 M32 36 C36 37 40 39 42 42"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Tatashe Pepper */}
            <path
              d="M125 32 C140 26 150 42 144 58 C138 72 122 78 112 68 C104 56 112 36 125 32 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M130 26 C134 18 142 16 148 15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Firewood Flame */}
            <path
              d="M90 92 C84 102 86 114 96 116 C106 118 112 106 106 96 C102 90 98 78 102 70 C94 76 92 84 90 92 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            {/* Garlic Clove */}
            <path
              d="M148 135 C142 124 154 114 160 116 C168 119 170 132 164 142 C156 148 146 144 148 135 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            {/* African Herb Sprig / Thyme */}
            <path
              d="M38 124 Q52 138 64 160"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M44 132 Q38 126 44 122 Q50 128 44 132 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M52 142 Q60 136 56 130 Q48 134 52 142 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M58 152 Q50 148 54 142 Q60 146 58 152 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            {/* Artisan Stew Cauldron */}
            <path
              d="M22 92 L64 92 C62 108 54 114 43 114 C32 114 24 108 22 92 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M18 92 L68 92"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M38 86 Q43 82 48 86"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Chef Knife Blade */}
            <path
              d="M112 148 L138 122 C142 118 146 124 142 128 L122 148 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />

            {/* Accent Botanical Sparkles & Seeds */}
            <circle cx="98" cy="36" r="1.5" fill="currentColor" />
            <circle cx="22" cy="154" r="1.5" fill="currentColor" />
            <circle cx="164" cy="82" r="1.5" fill="currentColor" />
            <circle cx="70" cy="50" r="1.2" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#crave-culinary-doodles)" />
      </svg>
    </div>
  );
}
