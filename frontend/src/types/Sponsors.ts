enum Tiers {
  'Platinum',
  'Gold',
  'Silver',
  'Bronze',
}

interface Sponsor {
  tier: Tiers;
  image: { name: string; ref: string; downloadURL: string };
}

export { Tiers };
export default Sponsor;
