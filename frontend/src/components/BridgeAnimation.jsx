const BridgeAnimation = () => {
    return (
        <div className="bridge-container">
            <svg className="bridge-svg" viewBox="0 0 900 120" xmlns="http://www.w3.org/2000/svg">
                {/* Gradient Definitions */}
                <defs>
                    <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#2563eb" />
                        <stop offset="25%" stopColor="#7c3aed" />
                        <stop offset="50%" stopColor="#06b6d4" />
                        <stop offset="75%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                    <linearGradient id="pillarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                    <linearGradient id="towerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#7c3aed" />
                        <stop offset="100%" stopColor="#5b21b6" />
                    </linearGradient>
                </defs>

                {/* Bridge Towers (Suspension Bridge Style) */}
                <g className="bridge-pillar">
                    <rect x="250" y="20" width="16" height="80" rx="2" fill="url(#towerGradient)" />
                    <rect x="246" y="15" width="24" height="8" rx="2" fill="url(#towerGradient)" />
                </g>
                <g className="bridge-pillar">
                    <rect x="634" y="20" width="16" height="80" rx="2" fill="url(#towerGradient)" />
                    <rect x="630" y="15" width="24" height="8" rx="2" fill="url(#towerGradient)" />
                </g>

                {/* Main Suspension Cables (Catenary Curves) */}
                <path
                    className="bridge-path"
                    d="M 50 70 Q 258 25, 450 60 T 850 70"
                    strokeWidth="6"
                />

                {/* Bridge Deck (Road Surface) */}
                <path
                    className="bridge-path"
                    d="M 50 75 L 850 75"
                    strokeWidth="10"
                    strokeLinecap="butt"
                />

                {/* Vertical Suspender Cables */}
                <path className="bridge-cable" d="M 150 55 L 150 75" strokeWidth="1.5" />
                <path className="bridge-cable" d="M 200 48 L 200 75" strokeWidth="1.5" />
                <path className="bridge-cable" d="M 258 30 L 258 75" strokeWidth="2" />
                <path className="bridge-cable" d="M 320 38 L 320 75" strokeWidth="1.5" />
                <path className="bridge-cable" d="M 380 48 L 380 75" strokeWidth="1.5" />
                <path className="bridge-cable" d="M 450 60 L 450 75" strokeWidth="1.5" />
                <path className="bridge-cable" d="M 520 48 L 520 75" strokeWidth="1.5" />
                <path className="bridge-cable" d="M 580 38 L 580 75" strokeWidth="1.5" />
                <path className="bridge-cable" d="M 642 30 L 642 75" strokeWidth="2" />
                <path className="bridge-cable" d="M 700 48 L 700 75" strokeWidth="1.5" />
                <path className="bridge-cable" d="M 750 55 L 750 75" strokeWidth="1.5" />

                {/* Decorative Light Particles */}
                <circle className="bridge-particle" cx="258" cy="25" r="5" />
                <circle className="bridge-particle" cx="450" cy="60" r="4" />
                <circle className="bridge-particle" cx="642" cy="25" r="5" />
                <circle className="bridge-particle" cx="350" cy="40" r="3" />
                <circle className="bridge-particle" cx="550" cy="40" r="3" />

                {/* Additional glow particles */}
                <circle className="bridge-particle" cx="200" cy="48" r="3" opacity="0.7" />
                <circle className="bridge-particle" cx="700" cy="48" r="3" opacity="0.7" />
            </svg>
        </div>
    );
};

export default BridgeAnimation;
