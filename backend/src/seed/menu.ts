type MenuProduct = {
  name: string;
  code?: string;
  category?: string;
  description?: string;
  variants: {
    name: string;
    price: string;
  }[];
};


export const menu: MenuProduct[] = [
  {
    name: "Mineralwasser",
    code: "G1",
    category: "Getränke",
    description: "Still oder sprudelnd",
    variants: [
      { name: "0,25l", price: "2.50" },
      { name: "0,5l", price: "3.50" },
    ],
  },

  {
    name: "Cola",
    code: "G2",
    category: "Getränke",
    description: "Classic Cola",
    variants: [
      { name: "0,25l", price: "3.00" },
      { name: "0,5l", price: "4.00" },
    ],
  },

  {
    name: "Schnitzel Wiener Art",
    code: "M1",
    category: "Hauptspeisen",
    description: "Paniertes Schweineschnitzel",
    variants: [
      { name: "mit Pommes", price: "12.90" },
      { name: "mit Reis", price: "12.90" },
    ],
  },

  {
    name: "Spaghetti Bolognese",
    code: "M2",
    category: "Hauptspeisen",
    description: "Hausgemachte Bolognese mit Rinderhack",
    variants: [
      { name: "Normal", price: "11.50" },
    ],
  },

  {
    name: "Gemischter Salat",
    code: "V1",
    category: "Vorspeisen",
    description: "Frischer Salat der Saison",
    variants: [
      { name: "klein", price: "4.90" },
      { name: "groß", price: "7.90" },
    ],
  },

  {
    name: "Apfelstrudel",
    code: "D1",
    category: "Dessert",
    description: "Mit Vanillesauce",
    variants: [
      { name: "Portion", price: "5.50" },
    ],
  },
];
