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

export const restaurants = [
    {
        name: "Restaurant A",
        outlets: [
            {
                name: "Outlet 1",
                location: "Dhigurah",
                cuisine: "Maldivian",
                rating: 4.5,
                description: "Authentic Maldivian cuisine with a modern twist.",
            },
            {
                name: "Outlet 2",
                location: "Falhumaafushi",
                cuisine: "Asian Fusion",
                rating: 4.7,
                description: "A blend of Asian flavors in a tropical setting.",
            },
            {
                name: "Outlet 3",
                location: "Dhigurah",
                cuisine: "Italian",
                rating: 4.2,
                description: "Traditional Italian dishes with fresh local ingredients.",
            },
            {
                name: "Outlet 4",
                location: "Falhumaafushi",
                cuisine: "Seafood Grill",
                rating: 4.8,
                description: "Fresh seafood grilled to perfection with a view.",
            }
        ]
    },
    {
        name: "Restaurant B",
        outlets: [
            {
                name: "Outlet 3",
                location: "Dhigurah",
                cuisine: "Italian",
                rating: 4.2,
                description: "Traditional Italian dishes with fresh local ingredients.",
            },
            {
                name: "Outlet 4",
                location: "Falhumaafushi",
                cuisine: "Seafood Grill",
                rating: 4.8,
                description: "Fresh seafood grilled to perfection with a view.",
            }
        ]
    },
    {
        name: "Restaurant C",
        outlets: [
            {
                name: "Outlet 5",
                location: "Dhigurah",
                cuisine: "Indian",
                rating: 4.6,
                description: "Spicy Indian dishes with a Maldivian touch.",
            },
            {
                name: "Outlet 6",
                location: "Falhumaafushi",
                cuisine: "Mediterranean",
                rating: 4.3,
                description: "Mediterranean flavors with a tropical ambiance.",
            }
        ]
    },
    {
        name: "Restaurant D",
        outlets: [
            {
                name: "Outlet 7",
                location: "Dhigurah",
                cuisine: "Japanese",
                rating: 4.9,
                description: "Sushi and sashimi made with the freshest fish.",
            },
            {
                name: "Outlet 8",
                location: "Falhumaafushi",
                cuisine: "Barbecue",
                rating: 4.4,
                description: "Barbecue specialties with a tropical twist.",
            }
        ]
    }
];