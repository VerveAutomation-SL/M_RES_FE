import { Resort } from "./types";

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

export const resorts: Resort[] = [
    {
        id: 1,
        name: "Dhigurah Resort",
        location: "Dhigurah",
        restaurants: [
            { id: 1, restaurantName: "Ocean View", resort_id: 1, diningTables: 20 },
            { id: 2, restaurantName: "Sunset Grill", resort_id: 1, diningTables: 15 },
            { id: 3, restaurantName: "Coral Cafe", resort_id: 1, diningTables: 30 },
            { id: 4, restaurantName: "Beachside Bistro", resort_id: 1, diningTables: 22 },
            { id: 5, restaurantName: "Lagoon Lounge", resort_id: 1, diningTables: 18 }
        ],
        rooms: rooms["dhigurah"].map(room_number => ({
            id: room_number,
            room_number: room_number.toString(),
            status: 'available',
            resort_id: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 2,
        name: "Falhumaafushi Resort",
        location: "Falhumaafushi",
        restaurants: [
            { id: 3, restaurantName: "Island Feast", resort_id: 2, diningTables: 25 },
            { id: 4, restaurantName: "Lagoon Lounge", resort_id: 2, diningTables: 18 }
        ],
        rooms: rooms["falhumaafushi"].map(room_number => ({
            id: room_number,
            room_number: room_number.toString(),
            status: 'available',
            resort_id: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 3,
        name: "Sample Resort",
        location: "Sample Location",
        restaurants: [],
        rooms: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 4,
        name: "Test Resort",
        location: "Test Location",
        restaurants: [],
        rooms: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
]