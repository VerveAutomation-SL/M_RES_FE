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
    dhigurah: [
      {name: "All", href: "#all" },
      { name: "600-693", href: "#600-693" },
      { name: "800-820", href: "#800-820" },
      { name: "840-897", href: "#840-897" },
    ],
    falhumaafushi: [
      { name: "All", href: "#all" },
      { name: "100-130", href: "#100-130" },
      { name: "200-218", href: "#200-218" },
      { name: "300-343", href: "#300-343" },
    ],
  };

export const rooms = {
    "dhigurah": [
        ...roomNumbers.filter((room) => room >= 600 && room <= 693),
        ...roomNumbers.filter((room) => room >= 800 && room <= 820),
        ...roomNumbers.filter((room) => room >= 840 && room <= 897),
    ],
    "falhumaafushi": [
        ...roomNumbers.filter((room) => room >= 100 && room <= 130),
        ...roomNumbers.filter((room) => room >= 200 && room <= 218),
        ...roomNumbers.filter((room) => room >= 300 && room <= 343),
    ],
    "all": roomNumbers,
}