

const marqueeText = 'SMILES · DENTAL CARE · IMPLANTS · WHITENING · ORTHODONTICS · WELLNESS · CONFIDENCE ·';
const Marquee = () => {
  return (
    <section className="marquee-wrap relative z-10" aria-label="Brand marquee">
      <div className="marquee-track">
        {[...Array(4)].map((_, index) => (
          <span key={index} className="marquee-item shrink-0">
            {marqueeText}
          </span>
        ))}
      </div>
    </section>
  );
}

export default Marquee