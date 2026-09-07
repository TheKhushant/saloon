type Feature = {
  id: string;
  title: string;
  description: string;
  backLabel: string;
  icon: JSX.Element;
};

const features: Feature[] = [
  {
    id: "barbers",
    title: "Expert Barbers",
    description: "Certified professionals with 5+ years experience",
    backLabel: "5+ yrs exp",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="icon-barbers" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F0D6AC" />
            <stop offset="1" stopColor="#C89A5B" />
          </linearGradient>
        </defs>
        {/* open scissor blades */}
        <path d="M9.6 9.6 L20.5 3" stroke="url(#icon-barbers)" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M9.6 14.4 L20.5 21" stroke="url(#icon-barbers)" strokeWidth="1.7" strokeLinecap="round" />
        {/* finger rings */}
        <circle cx="5.6" cy="6.4" r="3.05" stroke="url(#icon-barbers)" strokeWidth="1.7" />
        <circle cx="5.6" cy="17.6" r="3.05" stroke="url(#icon-barbers)" strokeWidth="1.7" />
        {/* pivot */}
        <circle cx="9.6" cy="12" r="1.15" fill="url(#icon-barbers)" />
        {/* trimmed hair strands, catching the cut */}
        <path d="M13.5 12 L21.5 12" stroke="url(#icon-barbers)" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
        <path d="M15.5 12 L19 9" stroke="url(#icon-barbers)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        <path d="M15.5 12 L19 15" stroke="url(#icon-barbers)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "products",
    title: "Premium Products",
    description: "Using top-tier grooming & hair care brands",
    backLabel: "Top brands",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="icon-products" x1="6" y1="2" x2="18" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F0D6AC" />
            <stop offset="1" stopColor="#C89A5B" />
          </linearGradient>
        </defs>
        {/* dropper cap */}
        <path d="M10.4 2 h3.2 l0.5 3.2 h-4.2 Z" fill="url(#icon-products)" />
        <rect x="11.2" y="1.2" width="1.6" height="1.4" rx="0.4" fill="url(#icon-products)" />
        {/* bottle body */}
        <path
          d="M9.8 5.2 H14.2 L15.6 9 C16.6 11.6 17 13 17 15.2 C17 18.7 14.8 21 12 21 C9.2 21 7 18.7 7 15.2 C7 13 7.4 11.6 8.4 9 Z"
          stroke="url(#icon-products)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* liquid fill */}
        <path
          d="M8.1 15.4 C8.1 18 9.8 19.7 12 19.7 C14.2 19.7 15.9 18 15.9 15.4 C15.9 14.5 15.75 13.7 15.4 12.7 H8.6 C8.25 13.7 8.1 14.5 8.1 15.4 Z"
          fill="url(#icon-products)"
          opacity="0.85"
        />
        {/* glass highlight */}
        <path d="M9.6 10.5 C8.9 12.2 8.6 13.4 8.5 14.6" stroke="#ffffff" strokeWidth="0.9" strokeLinecap="round" opacity="0.55" />
        {/* sparkle */}
        <path d="M18.6 4.6 L19.2 6.1 L20.7 6.7 L19.2 7.3 L18.6 8.8 L18 7.3 L16.5 6.7 L18 6.1 Z" fill="url(#icon-products)" />
      </svg>
    ),
  },
  {
    id: "hours",
    title: "Flexible Hours",
    description: "Open 7 days a week with evening appointments",
    backLabel: "7 days/wk",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="icon-hours" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F0D6AC" />
            <stop offset="1" stopColor="#C89A5B" />
          </linearGradient>
        </defs>
        {/* clock face */}
        <circle cx="11.5" cy="12.5" r="8.3" stroke="url(#icon-hours)" strokeWidth="1.6" />
        {/* hour ticks */}
        <path d="M11.5 5.6 v1.4 M11.5 19.4 v-1.4 M4.6 12.5 h1.4 M18.4 12.5 h-1.4" stroke="url(#icon-hours)" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
        {/* hands, set to an evening hour */}
        <path d="M11.5 12.5 V8.1" stroke="url(#icon-hours)" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M11.5 12.5 L14.6 14.6" stroke="url(#icon-hours)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="11.5" cy="12.5" r="1" fill="url(#icon-hours)" />
        {/* orbiting sparkle, signalling round-the-clock availability */}
        <path d="M19.6 4.4 L20.1 5.7 L21.4 6.2 L20.1 6.7 L19.6 8 L19.1 6.7 L17.8 6.2 L19.1 5.7 Z" fill="url(#icon-hours)" />
      </svg>
    ),
  },
  {
    id: "customized",
    title: "Customized Service",
    description: "Personalized treatments for your needs",
    backLabel: "Just for you",
    icon: (
      <svg viewBox="0 0 24 24" fill="none">
        <defs>
          <linearGradient id="icon-customized" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#F0D6AC" />
            <stop offset="1" stopColor="#C89A5B" />
          </linearGradient>
        </defs>
        {/* fingerprint mark, signalling a service tailored to the individual */}
        <path d="M12 3.4 C7.5 3.4 4 6.9 4 11 v2.4" stroke="url(#icon-customized)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M12 3.4 C16.5 3.4 20 6.9 20 11 c0 2.1 -0.3 3.8 -1 5.4" stroke="url(#icon-customized)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M7.6 6.8 C8.9 5.7 10.4 5.1 12 5.1 C15.3 5.1 18 7.8 18 11.1 C18 13.6 17.6 15.6 16.7 17.6" stroke="url(#icon-customized)" strokeWidth="1.3" strokeLinecap="round" opacity="0.85" />
        <path d="M6 9.3 C6 6.9 8.7 7 9.6 7.9 C10.4 6.6 13.4 6.9 14.4 8.7 C15.6 10.9 15.6 13.8 14.3 16.9" stroke="url(#icon-customized)" strokeWidth="1.3" strokeLinecap="round" opacity="0.75" />
        <path d="M8.4 10 C8.9 9.2 10.6 8.9 11.4 9.9 C12.5 11.3 12.6 13.6 11.5 16.4" stroke="url(#icon-customized)" strokeWidth="1.3" strokeLinecap="round" opacity="0.65" />
        <path d="M9.6 13.4 C9.9 12.8 10.6 12.7 11 13.1" stroke="url(#icon-customized)" strokeWidth="1.3" strokeLinecap="round" opacity="0.55" />
        {/* signature sparkle */}
        <path d="M19 15.4 L19.5 16.7 L20.8 17.2 L19.5 17.7 L19 19 L18.5 17.7 L17.2 17.2 L18.5 16.7 Z" fill="url(#icon-customized)" />
      </svg>
    ),
  },
];

const styles = `
.why-choose {
  padding: 64px 32px 76px;
  background: #F8F4EE;
}
.why-choose__heading {
  text-align: center;
  font-family: "Playfair Display", Georgia, serif;
  font-weight: 700;
  font-size: 34px;
  margin: 0 0 44px;
  color: #211d1a;
}
.why-choose__heading span {
  color: #7A5A38;
}
.why-choose__grid {
  max-width: 1180px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}
@media (max-width: 900px) {
  .why-choose__grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 520px) {
  .why-choose__grid { grid-template-columns: 1fr; }
}
.why-choose__card {
  background: #ffffff;
  border: 1px solid #E6DED2;
  border-radius: 16px;
  padding: 32px 22px;
  text-align: center;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
}
.why-choose__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 24px rgba(42, 36, 32, 0.08);
}
.why-choose__flip {
  width: 84px;
  height: 84px;
  margin: 0 auto;
  perspective: 700px;
  filter: drop-shadow(0 6px 14px rgba(122, 90, 56, 0.28));
}
.why-choose__flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
}
.why-choose__card:hover .why-choose__flip-inner,
.why-choose__card:focus-within .why-choose__flip-inner {
  transform: rotateY(180deg) scale(1.04);
}
.why-choose__flip-face {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
}
.why-choose__flip-front {
  background:
    radial-gradient(circle at 32% 28%, rgba(220, 178, 120, 0.22), rgba(220, 178, 120, 0) 55%),
    radial-gradient(circle at 50% 50%, #3a352f 0%, #201d1a 78%);
  border: 1px solid rgba(200, 154, 91, 0.35);
  color: #ffffff;
}
.why-choose__flip-front::after {
  content: "";
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  border: 1px solid rgba(240, 214, 172, 0.16);
  pointer-events: none;
}
.why-choose__flip-front svg {
  width: 34px;
  height: 34px;
  position: relative;
  z-index: 1;
}
.why-choose__flip-back {
  background:
    radial-gradient(circle at 30% 25%, rgba(255, 255, 255, 0.35), rgba(255, 255, 255, 0) 55%),
    linear-gradient(160deg, #A67C52, #7A5A38);
  color: #ffffff;
  transform: rotateY(180deg);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 6px;
  line-height: 1.3;
}
.why-choose__title {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 18px;
  margin: 16px 0 8px;
  color: #211d1a;
}
.why-choose__desc {
  font-size: 13px;
  line-height: 1.55;
  color: #8A8078;
  margin: 0;
}
@media (prefers-reduced-motion: reduce) {
  .why-choose__flip-inner, .why-choose__card { transition: none; }
}
`;

type WhyChooseUsProps = {
  salonName?: string;
};

export default function WhyChooseUs({ salonName = "Glam Aura" }: WhyChooseUsProps) {
  return (
    <section className="why-choose" aria-labelledby="why-choose-heading">
      <style>{styles}</style>
      <h2 id="why-choose-heading" className="why-choose__heading">
        Why Choose <span>{salonName}</span>
      </h2>

      <div className="why-choose__grid">
        {features.map((feature) => (
          <div className="why-choose__card" key={feature.id}>
            <div className="why-choose__flip">
              <div className="why-choose__flip-inner">
                <div className="why-choose__flip-face why-choose__flip-front">
                  {feature.icon}
                </div>
                <div className="why-choose__flip-face why-choose__flip-back">
                  {feature.backLabel}
                </div>
              </div>
            </div>
            <h3 className="why-choose__title">{feature.title}</h3>
            <p className="why-choose__desc">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
