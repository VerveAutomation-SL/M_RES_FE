export const roomNumbers = [
    // 100-130 range
    ...Array.from({ length: 31 }, (_, i) => 100 + i),
    // 200-218 range
    ...Array.from({ length: 19 }, (_, i) => 200 + i),
    // 300-343 range
    ...Array.from({ length: 44 }, (_, i) => 300 + i),
    // 600-693 range
    ...Array.from({ length: 94 }, (_, i) => 600 + i),
    // 800-820 range
    ...Array.from({ length: 21 }, (_, i) => 800 + i),
    // 840-897 range
    ...Array.from({ length: 58 }, (_, i) => 840 + i),
]

export const tabItems = {
    "dhigurah Resort": [
      {name: "All", href: "#all" },
      { name: "600-693", href: "#600-693" },
      { name: "800-820", href: "#800-820" },
      { name: "840-897", href: "#840-897" },
    ],
    "falhumaafushi Resort": [
      { name: "All", href: "#all" },
      { name: "100-130", href: "#100-130" },
      { name: "200-218", href: "#200-218" },
      { name: "300-343", href: "#300-343" },
    ],
  };

export const rooms = {
    "dhigurah Resort": [
        ...roomNumbers.filter((room) => room >= 600 && room <= 693),
        ...roomNumbers.filter((room) => room >= 800 && room <= 820),
        ...roomNumbers.filter((room) => room >= 840 && room <= 897),
    ],
    "falhumaafushi Resort": [
        ...roomNumbers.filter((room) => room >= 100 && room <= 130),
        ...roomNumbers.filter((room) => room >= 200 && room <= 218),
        ...roomNumbers.filter((room) => room >= 300 && room <= 343),
    ],
    "all": roomNumbers,
}

export const resorts = [
  {
    name: "dhigurah Resort",
    totalRooms: 50,
    booked: 20,
    available: 30,
  },
  {
    name: "falhumaafushi Resort",
    totalRooms: 40,
    booked: 15,
    available: 25,
  },
  {
    name: "Island Retreat Resort",
    totalRooms: 30,
    booked: 10,
    available: 20,
  },
  {
    name: "Lagoon View Resort",
    totalRooms: 12,
    booked: 3,
    available: 9,
  },
  {
    name: "Paradise Cove Resort",
    totalRooms: 18,
    booked: 6,
    available: 12,
  },
  {
    name: "Mountain View Resort",
    totalRooms: 10,
    booked: 2,
    available: 8,
  },
  {
    name: "Ocean Breeze Resort",
    totalRooms: 15,
    booked: 5,
    available: 10,
  },
  
  
];
