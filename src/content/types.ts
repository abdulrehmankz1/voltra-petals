export type Href = `#${string}`;

export type Link = { label: string; href: Href };

// A display heading, line by line: each line is masked separately so the motion layer can lift it (data-lines).
export type Lines = readonly string[];

// Eyebrow and heading that open a section, plus the optional lede under them.
export type SectionIntro = { eyebrow: string; title: Lines; lede?: string };

// Exactly three items: the stats, the phones, the key shares, the steps and the plans are each drawn for three (the
// bloom's petals), so a fourth or missing item would break the design rather than add a row.
export type Triple<T> = readonly [T, T, T];

export type Pair<T> = readonly [T, T];
