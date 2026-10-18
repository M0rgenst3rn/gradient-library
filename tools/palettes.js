// The source of the gradient library: categories with hand-picked palettes. tools/build-library.js turns
// them into gradients/library.js and the thumbnail sprites. Every palette here is original work.
//
// Palette line: "Name: #c1 #c2 #c3 …" (left to right). "#rrggbbaa" = colour with alpha. "@40" after a colour
// places it at 40 % (otherwise the stops are spread evenly).
// mode: "windows" = the full palette plus a few of its parts (2–4 neighbouring colours)
//       "full"    = only the palette as written (metals, film, toning – the order matters)
// map: true = made for Gradient Map (stops run dark → light).

module.exports = [
  // ------------------------------------------------------------------ Nature
  { id: "sunset", group: "Nature", name: "Sunset & Sunrise", mode: "windows", palettes: `
Coral Dusk: #2b1a4f #7a2e6b #d6455e #ff8a5b #ffd27a
Golden Hour: #4a1f0f #b34a1c #f08a2c #ffc14d #fff1b8
First Light: #1d2b53 #5b5c9c #c97ba6 #ffb3a7 #ffe9d6
Desert Evening: #261537 #6d2c5e #c5544f #f39a52 #fbd38d
Pink Horizon: #3a0f3d #92255f #f2547d #ff9a8b #ffe3c4
Afterglow: #0f1c3f #3b2f6b #a03f72 #f26b5b #fcb76b
Tropic Sunset: #2c0b4a #5d3fa0 #f25c70 #ffc477
Late Summer: #3d1d0e #a4401a #e8742a #f6b04a #fde5a2
Lilac Dawn: #3b3a73 #8a7cc7 #e3a8d1 #ffd8c2
Burning Sky: #1a0b14 #6a0f1f #c2261f #f2701d #ffc93c
Smoke Sunset: #2e2a3d #6b5872 #c2847f #f0b98a
Peach Morning: #ffb199 #ffcfa8 #fff0d4
Twilight Ember: #120c2c #44195c #a62c5b #ef5f3c
Salmon Haze: #f6826a #fbab87 #fdd7b6 #fff2e3
` },
  { id: "sky", group: "Nature", name: "Sky & Weather", mode: "windows", palettes: `
Clear Noon: #0b4f9c #2f86d6 #79bdf2 #cfeaff
Blue Hour: #070b2a #18286b #3b5bab #8aa5dd
Storm Front: #1b2129 #3a4552 #6b7a8a #a9b6c2
After Rain: #4d6a83 #8ba7bd #c9dbe6 #f1f6f9
High Altitude: #001a4d #00449e #3d8bff #b8dcff
Overcast: #646d76 #959ea6 #c4cbd1 #e9ecee
Rain Cloud: #2b3440 #4f5d6e #7d8ea0
Thunder Violet: #140e2e #352a6b #6a54b8 #b3a6ee
Snow Sky: #a9b8c8 #d5dee8 #f4f7fa
Monsoon: #263238 #37555f #5d8a8f #a7c7c3
Pastel Sky: #a6c8ff #c9b8ff #ffd1e8
Mist: #dfe7ec #eef2f4 #ffffff
` },
  { id: "ocean", group: "Nature", name: "Ocean & Tropics", mode: "windows", palettes: `
Deep Sea: #010b19 #03285a #0a5c8f #1aa0b8
Lagoon: #00546b #0089a3 #2ec4c4 #a8f0e0
Reef: #00334e #145a7a #19a3a0 #ffd27f
Caribbean: #0a6cf0 #12c2f2 #86f2e2
Kelp Forest: #0b2a24 #145a4b #2e8f6c #8ad1a2
Shallow Water: #5cc6d0 #9ce3dd #e4f9f1
Abyss: #000308 #031a33 #0b3d66
Sea Glass: #bfe6dd #9ad0c2 #6fb3a8 #3f8781
Surf: #08418a #0a74b0 #12aed2 #8edbea #d2f2f8
Tide Pool: #12324a #2a6f74 #6bb7a0 #e8d6a6
Bioluminescence: #000814 #001d3d #00a6a6 #7cffcb
Coral Water: #00a8b5 #6dd3c7 #ffb5a7 #ff7f6e
` },
  { id: "forest", group: "Nature", name: "Forest & Botanical", mode: "windows", palettes: `
Pine: #0c1f17 #1d4030 #3f6f4a #87a96b
Moss: #2b3a1a #4f6b2a #8aa046 #c9d77b
Fern: #13402b #2f7a43 #77b55a #d5ed9f
Rainforest: #00261b #00573f #2e8b57 #a3d977
Eucalyptus: #3c5a55 #6f918a #a9c3b9 #e3eee8
Olive Grove: #2e2e15 #5a5a26 #908f45 #c8c48a
Spring Leaf: #b1dd6a #5aa636
Lime Light: #dbf27e #8fdca8
Sage: #6b7f6a #9cae95 #cfdac6
Wet Forest: #0e1f24 #1e3d3f #2f5a58
Matcha Field: #36451c #6b8a2b #b3c96a #eef3d2
Bamboo: #4c6b1f #8fb339 #d9e7a1 #f6f8e4
` },
  { id: "earth", group: "Nature", name: "Desert & Earth", mode: "windows", palettes: `
Terracotta: #5a2a1c #9c4a2f #d0784c #f1b48a
Dune: #7a4e2d #b98149 #e3b47a #f7dfb6
Canyon: #3c1a12 #7d3423 #c25b36 #e9a165
Clay: #6e4b3a #a8735a #d9a78a #f2d6c4
Ochre: #6b4310 #a8711f #d9a441 #f2d38b
Sandstone: #c49a6c #ddb98f #f0dbbf
Basalt: #1f1c1a #3d3631 #6a5e55 #9c8f84
Red Earth: #2e0f0a #6b2117 #a8402a #d77a53
Savanna: #5e4b1e #a1863a #d6be6b #f3e3a8
Rust Valley: #3a1f14 #82391d #c9632b #e8a25a
Salt Flat: #d9d3c7 #ebe6dc #f8f6f1
Mesa: #4a2c2a #8c4f3d #c9845c #e7c08f
` },
  { id: "aurora", group: "Nature", name: "Aurora & Space", mode: "windows", palettes: `
Northern Lights: #020617 #0b2e4f #00a37a #6dffb0 #d6ffe8
Nebula: #0b0420 #3a0f5c #8b2a8f #e0558f #ffb48f
Galaxy Core: #050314 #2a1460 #6b3fd6 #c48cff #fff0ff
Deep Space: #000000 #0a0f2c #1c2a6b #3e56c2
Cosmic Teal: #03001e #1b1a5c #00c3a5 #c9fff2
Stardust: #0d0b26 #343a7a #8a8ed6 #e8e6ff
Solar Wind: #1a0533 #6a1b9a #ff6d00 #ffd180
Event Horizon: #000000 #1b0a2a #5c1f4a #ff7a3d
Polar Night: #01040f #0a1d3b #1a5c6b #47d6b3
Moonrise: #0e1a2e #34507a #9eb3d6 #f0f3ff
Supernova: #12002b #6d00a8 #ff2e93 #ffd166 #fffbe6
Interstellar: #050a14 #19304d #4f7aa6 #c2d9f0
` },
  { id: "fire", group: "Nature", name: "Fire & Lava", mode: "windows", palettes: `
Campfire: #1a0500 #6e1500 #d23a00 #ff8c1a #ffd966
Lava Flow: #0d0000 #4d0000 #b30f00 #ff4d00 #ffb300
Ember: #2b0a03 #7a1d0a #d6451c #ff9b54
Blue Flame: #05051f #1d2a8f #3d7fff #9ee7ff #ffffff
Inferno: #000000 #57001a #c4001f #ff5a00 #fff07a
Torch: #f4552f #f29a24 #ffd36a
Magma: #1c0b19 #5e0c3a #b3241f #f26a1b #ffcb47
Phoenix: #4a0012 #b8002e #ff5e3a #ffc36e
Hot Coal: #0f0503 #3d0c06 #8c1c0c #e0471a
Sparkler: #ff7b00 #ffb700 #fff3b0 #ffffff
` },
  { id: "ice", group: "Nature", name: "Ice & Frost", mode: "windows", palettes: `
Glacier: #0a2a43 #1c5d80 #63a9c9 #c4ecf7 #ffffff
Frozen Lake: #1b3a52 #4a7c99 #9cc5d9 #e6f4fa
Frost: #cfe8f5 #e8f5fb #ffffff
Arctic: #002b49 #00658f #39b3d6 #b6efff
Iceberg: #2d6e8e #7fb8cf #d3eef5
Polar: #e0f2ff #b5dcf5 #82b7da #4b88b3
Winter Morning: #8aa4c8 #c5d4ea #f3f6fb
Icicle: #003a63 #0d78b3 #6cc8f0 #effcff
Cold Steel: #36454f #6c7f8c #a7b6c0 #dde5ea
Snowfield: #f7fbff #e3edf7 #c9d8e8
` },
  { id: "flowers", group: "Nature", name: "Flowers & Blossom", mode: "windows", palettes: `
Cherry Blossom: #ffe6ec #ffbfd0 #ff8fab #e05780
Lavender Field: #3d2c6b #7b5ea7 #b49ad9 #e6d9fa
Peony: #6d0f3a #b8285f #f26a8d #ffc2d1
Sunflower: #5e3c00 #c98a00 #ffc300 #fff1a8
Lotus: #ffd6e8 #f7a8c8 #c86b98 #7a3a6b
Hydrangea: #4b5fbf #8b9de0 #c6b5f0 #f2d9f7
Poppy: #5c0000 #b3001b #ff3b3b #ff9f80
Wisteria: #4a3a75 #8a73c2 #c9b6ec #f3ecfd
Tulip: #b5004f #ff3d7f #ffb3c6 #fff0f5
Orchid: #4b0f4d #9b2a8f #e05fc2 #f9c2ec
Marigold: #a83c00 #f07800 #ffb000 #ffe08a
Rose Garden: #3a0818 #8e1b3a #d94a6a #f7a5b4
` },
  { id: "seasons", group: "Nature", name: "Seasons", mode: "windows", palettes: `
Spring Morning: #b9f3c9 #e8f9a0 #fff3b5 #ffd1dc
April Rain: #7fa9b8 #b4d3c9 #e7f0d4
Summer Pool: #0aa9d6 #46dac8 #fff3b8
Midsummer: #f79a42 #f9cf6a #19c99c #1786ad
Autumn Leaves: #3a1608 #86300a #d2611a #f69a33 #f9c95a
Harvest: #5b3a1a #a8652a #e0a24a #f3d27a
October: #2e1a0f #6b2f1a #b5543a #e89a5d
Pumpkin Spice: #7a2e0e #c45a1e #f08c3a #ffd6a5
Winter Night: #0b1026 #1f2f5c #5b7bb2 #d4e2f7
First Snow: #9fb4c7 #d7e3ee #ffffff
Holiday Red: #3b0a0a #8c1414 #d62828 #f77f7f
Evergreen: #0b2b1f #145a3a #2a8a57 #d9ead3
` },

  // ------------------------------------------------------------------ Retro & Vintage
  { id: "retro70", group: "Retro & Vintage", name: "70s Retro", mode: "windows", palettes: `
Disco Sunset: #5a2d0c #c75b12 #f59e1b #f7d154
Groovy: #6b2d1a #d9541e #f2a13c #f5d76e #9fb36b
Avocado Kitchen: #3d4a1e #7a8c2e #c0b04a #e8d48a
Shag Carpet: #4a2511 #8a4a1c #c98535 #e8c07a
Mustard & Rust: #a0461f #d9822b #e6b13a #f2d675
Brown Sugar: #2e1a10 #5e3820 #9c6a43 #d4ab7a
Funk Stripe: #e85d04 #f48c06 #faa307 #ffba08
Retro Teal: #00494d #00838a #e3a14b #d9542b
Polyester: #6d214f #b33951 #e3826f #f2c57c
Wood Panel: #3b2414 #6e4426 #a87444 #d6a86c
` },
  { id: "synthwave", group: "Retro & Vintage", name: "80s Synthwave", mode: "windows", palettes: `
Outrun: #0d0221 #2b0a5e #a0136e #ff2e88 #ffcf5c
Neon Grid: #090014 #24005c #6a00f4 #ff00c8 #ffa8f5
Miami Night: #120458 #7a04eb #ff00a0 #fe75fe
Retro Sun: #ffe600 #ff9a00 #ff2e63 #b300b3
Laser: #001aff #9d00ff #ff00e1
Arcade: #0b0033 #370665 #f72585 #fbb13c
Chrome Dusk: #1b1036 #4e2a84 #c64b8c #ffb3c1
Night Drive: #0a0f29 #1e3b70 #e8336d #fdd85d
Cassette: #f53fa8 #7a4b9e #2f82be
Hot Pink Horizon: #2d00f7 #8900f2 #e500a4 #ff7d00
` },
  { id: "y2k", group: "Retro & Vintage", name: "90s & Y2K", mode: "windows", palettes: `
Bubblegum: #f99ad2 #c6a6f7 #8fd2f7
Cyber Pearl: #e8f0ff #c9d6ff #e2c9ff #ffd9f0
Frosted Tips: #a7c2f5 #c8e6f6 #f4f9ff
Translucent Blue: #0c4fc9 #4a66ec #79b0f4
Lime Pop: #c6ff00 #64dd17 #00c853
Glitter Gel: #ff6ec7 #7873f5 #4adede
Pager: #a2dc62 #14d8ad #0f9fa0
Mall Fountain: #45b6fe #8be0ff #fffbcc
Butterfly Clip: #f8aebf #fdc4a6 #fff0c9
Dial-Up: #2b3b4f #3f6f86 #55a4ad
Chrome Lilac: #bdbbbe #ded7f5 #9d9ac2
Inflatable: #f9f871 #ff9671 #ff6f91 #845ec2
` },
  { id: "vaporwave", group: "Retro & Vintage", name: "Vaporwave", mode: "windows", palettes: `
Aesthetic: #f774c9 #19c7f2 #2df2a6 #b46ef2 #f9f2a0
Palm Mall: #ff6ad5 #c774e8 #ad8cff #8795e8 #94d0ff
Marble Bust: #f9c6f5 #c7d3ff #a5f2f3
Dream Pool: #5ce1e6 #a28aff #ffaee8
Sunset Statue: #ff8fd8 #ffc6a8 #fff1a8
Lo-Fi: #2d1e48 #66408a #d28ad3 #ffd3f4
Hologram Mall: #78f5ff #c8a2ff #ff9ed8
Retro OS: #008080 #c0c0c0 #ff00ff
` },
  { id: "vintage", group: "Retro & Vintage", name: "Vintage Print", mode: "windows", palettes: `
Faded Poster: #2e3c45 #696f5e #c69b82 #dcbfaa #f9e6d6
Old Map: #4a3b2a #8c7351 #c7ad7f #efe2c2
Press Ink: #1c3354 #457896 #a5d3d6 #eef6ec
Stencil Print Pink & Blue: #ff48b0 #ff8fc8 #a3c7ff #0078bf
Stencil Print Sunshine: #ffe800 #ff9e3d #ff665e
Letterpress: #222222 #8a3b2e #e9dcc3
Tin Sign: #1f4e5f #3f8f8f #e9c46a #e76f51
Postcard: #dc7c62 #efc98f #84ae98 #3f4159
Matchbox: #bd1722 #f8edd3 #0b2f47
Advert: #ad2e24 #f2b134 #f5e6c5
Linen: #a89f91 #cfc5b3 #ece4d4
Gazette: #3a3a3a #8f8a80 #e2ddd2
` },
  { id: "film", group: "Retro & Vintage", name: "Film Looks", mode: "full", map: true, palettes: `
Warm Negative: #1d1410 #4e3427 #a77a5a #e8c49b #fff4e0
Cool Slide: #071824 #1c4a5e #6e9fa5 #d7e6dc #fbfff6
Faded Matte: #2a2a33 #55505a #8f8590 #c9bfbd #ece4d9
Cross Process: #102b1d #2f6b3b #b0b84a #f3e48a #fffbe0
Teal & Orange: #06222b #1a5a63 #8f8f7f #e0a86b #fff1dc
Expired Film: #2b1d33 #5d4766 #a78a8f #e6c7a8 #fff0d6
Bleached: #121212 #3f4245 #8a8d88 #cfd0c5 #f5f5ee
Golden Print: #241505 #5c3a12 #b07b3a #edc88a #fff6e1
Daylight Stock: #0d1b2a #2a4c6b #8aa4a8 #e7d9b9 #fffaf0
Tungsten Night: #050a1f #13306b #4f6fb3 #b8c7e6 #f2f5ff
Instant Print: #1f2a2e #4b6264 #a2a98f #ecdcbc #fffaf2
Super 8: #1c120a #5a3a1e #b8873e #f2d37a #fff7d6
Portrait Film: #1d1513 #57423b #a88878 #ecd2c0 #fff8f1
Green Shadows: #0d1a14 #2b4a3a #7f8f74 #e0d7b5 #fffbee
Magenta Cast: #1f0f1c #55304d #a07a94 #e9cfd8 #fff6f8
Slide Film Vivid: #050b1c #123c72 #4f8f9a #f2c96a #fffbea
Night Stock: #04060c #14213d #3f5f8a #c9a87a #fff1dc
Faded Summer: #3a3330 #6f6560 #a99e94 #e6d6c3 #fbf3e8
Bleached Cyan: #0a1416 #2f4a4f #7f9c9a #cfe0d9 #f6fbf8
Low Contrast Warm: #3a2f28 #6b584b #a68e78 #dbc5a8 #f5e9d6
Toy Camera: #000000 #1e2a5e #b8325f #f2c94c #fffde8
Warm Consumer Film: #120a05 #4a2a14 #a7683a #f0c27f #fff6e0
` },
  { id: "sepia", group: "Retro & Vintage", name: "Old Paper & Sepia", mode: "windows", palettes: `
Parchment: #6b5536 #a68a5b #d8c49b #f4ead5
Sepia Print: #2b1d12 #6b4f35 #b09272 #e8dcc8
Coffee Stain: #3b2615 #7a5535 #c09a6b #ecdcc0
Antique Book: #4a3424 #8b6b4a #c8ad85 #f0e4cc
Tea Dyed: #8c6a45 #c4a57d #ebdcc2
Aged Photo: #1e1611 #4d3b2c #9b8166 #ddcbb2 #f7efe2
Kraft: #8a6a45 #b38f62 #d9bd93
Ivory: #e9dfc8 #f5efe1 #fffaf0
` },

  // ------------------------------------------------------------------ Modern & UI
  { id: "modern", group: "Modern & UI", name: "Modern UI", mode: "windows", palettes: `
Electric Violet: #3f6fe0 #7a5ae6 #b04fe0
Plum Glow: #5a19c4 #3b5ff0 #1fa2f2
Fresh Mint: #0f8f86 #2fd08a #a6f27a
Velvet Sky: #6a12e8 #b31ee8 #f04fc8
Royal Night: #0e0d2b #2c2a66 #5b4fa8
Juicy Orange: #f2780e #f9a62a #fdd45a
Blush: #e8919f #f6c2c6 #fde7e3
Azure Pop: #0b5fe0 #12a6f0 #6fe3f7
Candy Coral: #f5624f #ff8f6b #ffc29a
Ultra Indigo: #351f6e #9a3f7a #e8796c #fbb98a
Berry Pop: #4413d6 #7a2ce0 #c23fd9
Seafoam: #2fd889 #2ce6c2 #9af2ec
Sunkissed: #f2c76a #f7a37e #f2858f
Vivid Sky: #3a9cf2 #1fd2f2 #9af7f2
Magenta Wave: #e8418f #f45f6e #f99a6a
Deep Ocean UI: #03082b #0a2f6e #1561a6
Citrus Punch: #f08a1f #f7c12a #e9f05a
Grape Soda: #b46cf0 #e46fd2 #f99ab4
Arctic Mint: #7ff0b4 #86d6ee #b9c8fb
Peach Fuzz: #fde8d4 #f8c2a6 #f29a8f
Sapphire Flow: #0a1a5c #1f4fd0 #4fb0f2
Coral Reef UI: #ff6f61 #ffa07a #ffd29a
Lilac Pop: #8a5cf6 #c084fc #f0abfc
Emerald City: #064e3b #059669 #34d399
Sunrise UI: #f43f5e #fb923c #fde047
` },
  { id: "soft", group: "Modern & UI", name: "Soft Pastel Blur", mode: "windows", palettes: `
Cloud Candy: #f6c3e8 #c8c3f2 #a9c6ec
Morning Haze: #fbfaf8 #eceef0 #dfe4ea
Pastel Dream: #fbdde0 #eca3ae #c6d2f6
Soft Lilac: #ddc4f7 #b4c4f6 #92c6f2
Milk Tea: #f5e3d3 #e8cfc0 #d9b9a7
Baby Blue: #dbeafe #bfdbfe #e9d5ff
Lemon Cream: #fff9c4 #ffe0b2 #ffccbc
Mint Milk: #e2f6a0 #a6e6b2 #d6f3e6
Rose Water: #fff1f2 #fecdd3 #fda4af
Iris Mist: #c2c9e6 #dfe3f2 #f6f6fb
Apricot Silk: #ffe5d0 #ffc9a9 #ffb3c1
Glacier Pastel: #cfe9ff #e2f4f4 #fff6e5
` },
  { id: "moody", group: "Modern & UI", name: "Dark & Moody", mode: "windows", palettes: `
Midnight: #000000 #0b132b #1c2541 #3a506b
Noir Plum: #0d0208 #2c0a2b #5a1846 #8a2a5e
Charcoal Ember: #121212 #2b1d1a #5c2a1d #a4402a
Obsidian: #050505 #1a1a1a #303030
Night Forest: #030c07 #0d2518 #1c4131 #2f664c
Velvet: #12022c #26074a #3d0f6a #5a1f95
Graphite Blue: #0f1419 #1b2631 #2c3e50 #45617a
Bordeaux: #1a0006 #4a0012 #7d0a24
Smoky Teal: #050f10 #0e2a2c #1d4e52 #3a7c7f
Deep Rust: #120806 #3a1610 #6b2a1a
Ink: #070710 #141432 #2a2a5c
Shadow Rose: #1a0f14 #3d2230 #6e3b51 #a0607a
` },
  { id: "bold", group: "Modern & UI", name: "Bold & Pop", mode: "windows", palettes: `
Hot Mess: #f5087f #f98a12 #3fd6c9
Pop Art: #ff1744 #ffea00 #2979ff
Electric Lime: #c6ff00 #00e5ff
Flamingo: #ff2a68 #ff5e3a
Cobalt Flash: #0011ff #00e5ff
Tangerine Dream: #f5690a #e8137a #9b1fd6
Acid: #b4ff00 #ff00b4
Signal: #ff3d00 #ffc400
Ultraviolet: #5b00ff #ff00d4
Volt: #faff00 #00ff87
Punch: #f2288a #7012b3 #3c12a0 #4762e8 #50c3ea
Carnival: #f70a6f #f75a12 #f9bb17 #8040e6 #3d84f7
` },
  { id: "clean", group: "Modern & UI", name: "Clean & Corporate", mode: "windows", palettes: `
Trust Blue: #0a2540 #0f4c81 #2f80c4 #8cc0ea
Slate Teal: #154c5a #3f7f78 #74ad86
Fintech: #1b3a6e #27508f #3f6fb3
Clinic: #e3f1ef #87c6bd #12857a
Steel Gray: #2b3b4c #75828e #bcc2c6
Calm Navy: #131c2e #22374f #3a5677
Mint Office: #e6f2e6 #a8d3a8 #4a9c4f
Sky Brand: #2290ad #4fb6cf #8ad9ea
Graphite: #222426 #34373a #474b4f
Silver Lining: #f3f5f8 #d9dfea #c1cadb
Ocean Brand: #1b2a7e #2d7fb0 #2ccbc6
Sober Green: #0b3d2e #1e6b52 #5aa88a
` },
  { id: "neutral", group: "Modern & UI", name: "Minimal Neutrals", mode: "windows", palettes: `
Greige: #8e8478 #b5aba0 #d9d2c9 #f2eee9
Linen White: #f5f0e8 #ebe3d7 #ddd1c1
Stone: #5f5a54 #8a837b #b8b0a6 #e3ddd5
Oat Milk: #e8dccb #f3ebdf #fbf7f1
Concrete: #6e6e6e #9a9a9a #c8c8c8
Warm Sand: #c2a98b #dcc6aa #f2e6d6
Ash: #3b3b3b #6b6866 #a39f9b #d6d3cf
Cashmere: #a6917d #cbb8a5 #ebdfd3
Pebble: #7d7f7c #a7aaa5 #d0d3cd
Bone: #d8d0c0 #e9e3d6 #f7f4ee
` },

  // ------------------------------------------------------------------ Light & Materials
  { id: "metals", group: "Light & Materials", name: "Metals", mode: "full", palettes: `
Gold Bar: #6b4a0f #b8860b #f5d061 #fff6c9 #d4a017 #7a5410
Polished Gold: #8a6212 #e6be5a #fff3c4 #c99a2e #fbe7a1 #8a6212
Brushed Gold: #a07c32 #d9b65c #f2dc9a #c9a24e #e8cd84
Rose Gold: #8c4f45 #d39b8d #f6d5cb #c4847a #eabbb0
Silver: #5a5d63 #a9adb5 #f2f4f7 #8c9097 #d8dbe0 #6b6f76
Chrome: #1c1f26 #8a96a8 #f4f8ff #3a4352 #c9d3e0 #ffffff #4b5566
Platinum: #7f8590 #c9ced6 #f7f9fb #b2b8c1 #e4e8ec
Bronze: #4a2c10 #8c5a2b #d79a5b #f2c48d #a46a35
Copper: #5c2711 #a8522a #e98b5a #ffd0a8 #b85f33
Brass: #5e4a12 #a68a2e #e3cd73 #b89b3c #f0e3a5
Gunmetal: #1f2326 #3b4247 #6f787e #a7b0b6 #4a5257
Titanium: #46494d #878c91 #c5c9cd #eef0f2 #9da2a7
Pewter: #4f5154 #7d8083 #b3b5b7 #8a8d90
Antique Gold: #3d2b10 #7a5c24 #b89548 #e3c98a #8a6a30
Iron: #262626 #4a4a4a #7a7a7a #555555
Champagne: #b49b74 #e2cfae #fbf2e0 #d6bf95
White Gold: #b9ab8c #e6dcc4 #fffbf0 #cfc2a3 #efe6d0
Yellow Gold Bevel: #5a3c06 #c9961e #ffe9a0 #8a6410 #f2cf6b #6b4a0a
Dark Chrome: #050608 #3a4250 #c8d2e2 #1a1e26 #7d8798 #0c0e12
Blue Steel: #1c2733 #50637a #b9c8d8 #344559 #8ea3b8
Burnished Copper: #3b170b #8a3f1f #d8875a #6b2c14 #b8643b
Satin Silver: #8f949b #c3c7cd #e6e8eb #b0b5bc
Gold Leaf: #8f6a1f #e7c868 #fff2be #d1aa45 #f6e19a
Oxidized Bronze: #2c3b33 #5d6b4f #a08a5a #6f7a5c #c4a86f
Mirror: #0e1116 #8d97a6 #ffffff #4a5361 #e2e8f0 #ffffff #6b7584
Rose Chrome: #4a2a2c #b78a8c #ffe9ea #8c5f62 #e8c3c5
Anodized Purple: #24123d #6a3fa0 #c7a6f2 #4b2a7a #9a74d6
` },
  { id: "gems", group: "Light & Materials", name: "Gemstones & Minerals", mode: "windows", palettes: `
Emerald: #013220 #046c45 #10a670 #7de2b4
Sapphire: #03123d #0a2f8a #1f5fd6 #8ab4ff
Ruby: #2b0007 #7a0014 #c80f2e #ff6b81
Amethyst: #200a3b #4c1d95 #8b5cf6 #d8c6ff
Topaz: #6b3400 #d97a00 #ffb84d #ffe6b3
Opal: #e9f7ff #f9e4ff #fff6d9 #d9fff2
Turquoise: #00474f #008b8b #40e0d0 #b2fff5
Jade: #0b3d2c #2e7d5b #6bbf8e #c9ead6
Malachite: #002b1a #00664d #1fae7a #9ff2c8
Lapis: #0b1350 #1a3399 #3d5fcc #d4af37
Rose Quartz: #f7cad0 #f9dce0 #fdf0f2
Citrine: #8a4f00 #e09b00 #ffd34d #fff3c2
Obsidian Glass: #000000 #1a1424 #3d2f52
Moonstone: #dfe7f2 #eef1f8 #ffffff #d6e4f0
` },
  { id: "holo", group: "Light & Materials", name: "Holographic & Iridescent", mode: "full", palettes: `
Hologram: #a6f7cf #f6fbd3 #f9c6ef #b9c6f7 #a6f7cf
Oil Slick: #23074d #1b6f91 #3fc28a #e6e65a #d6458a #23074d
Pearl: #f5f5f5 #f9e6ff #e6f4ff #fff8e1 #f5f5f5
Prism Foil: #f79ca2 #f9cfe8 #a891d0 #8af2b5 #93cff0
Soap Bubble: #dcc6f6 #c6e6f6 #ddf28f #f6c6e6
Holo Silver: #d7d2e8 #c4f0ec #f6e3c5 #e6c8ee #d7d2e8
Beetle Shell: #0b3d2e #1d7a63 #3a4fb0 #7a2e8f #0b3d2e
Iridescent Dark: #1a1033 #20506b #4c2a85 #1f7a6b #1a1033
Unicorn: #ffb3e6 #c5a3ff #a3e4ff #c2ffd6 #fff6a3
Mother of Pearl: #eef0f4 #e2f3f0 #f4e9f2 #f3f0e4 #eef0f4
Rainbow Foil: #f76fc2 #f9b872 #eef291 #61ef85 #8fe2f6 #b998f2
Nacre: #fdfbfb #e4efe9 #ebedfb #fbe9e9
Opal Fire: #fef6f0 #ffd3e6 #c9f0ff #d8ffd4 #fff3b8 #fef6f0
Dragonfly: #0c4a4f #19a7a0 #5a6fd6 #9b4fc2 #0c4a4f
Chameleon: #2d6a3e #2a8f8a #5b5fc7 #b34d8f #2d6a3e
Peacock: #08343f #0e7c7b #2f5d9c #6a2c8a #08343f
Holo Gold: #f6d77a #ffc7d9 #c9e8ff #f9ecb0 #f6d77a
Aurora Foil: #7ff2d3 #8ab6ff #d79cff #ff9fcf #7ff2d3
Petrol Puddle: #1b1b2f #283e6b #2f7f6f #8f8a2b #6b2f5f #1b1b2f
Dichroic: #ff4fa3 #ffd54f #4fffd6 #4f7dff #ff4fa3
Labradorite: #1f2a33 #2d5f73 #4f8fa6 #5f7f4f #2a3a4a
Ice Holo: #e6fbff #d6e4ff #f2dcff #dcfff4 #e6fbff
` },
  { id: "neon", group: "Light & Materials", name: "Neon & Glow", mode: "windows", palettes: `
Neon Pink: #1a0010 #b0006a #ff2ec4 #ffc2f0
Neon Blue: #000a1f #003cff #00b2ff #b8f2ff
Neon Green: #001a07 #00b347 #39ff14 #d5ffc7
Neon Orange: #1f0a00 #ff5e00 #ffa31a #ffe3b8
Cyber Glow: #0d0322 #130b4c #2a4288 #9fcad1 #c9e8dc
Club Light: #160a73 #96108c #f53f6c #f7c929
UV Glow: #0b001a #3d00b3 #a100ff #e7b3ff
Night City: #050816 #3b129c #ef2a8a #4dbfe8
Plasma: #0a0033 #6600ff #ff00cc #ffcc00
Electric Teal: #00141a #008f8f #00ffd5 #d6fff8
Radioactive: #0a1400 #3d6600 #b3ff00 #f5ffcc
Neon Sign: #ff00c1 #9600ff #4900ff #00b8ff #00fff9
` },
  { id: "light", group: "Light & Materials", name: "Light Leaks & Glass", mode: "windows", palettes: `
Light Leak Red: #ff3b1f00 #ff3b1f99 #ffb34766 #fff0c200
Light Leak Gold: #ffb30000 #ffb300aa #fff3c066
Warm Flare: #ff7a0000 #ff7a0088 #ffd27aaa #ffffff00
Frosted Glass: #ffffff40 #ffffff10 #ffffff30
Glass Blue: #8fd3ff66 #d6f0ff33 #ffffff55
Sun Rays: #fff7d600 #fff7d6cc #ffffffff
Lens Haze: #c6e2ff00 #c6e2ff66 #ffffff99
Prism Leak: #ff6ec700 #ff6ec788 #ffd16f88 #7ee8ff88 #7ee8ff00
Golden Haze: #fff1c1 #ffd98a #ffb36b
Window Light: #fffbea #fff3c9 #ffe4a3 #fffbea
` },

  // ------------------------------------------------------------------ Photo tools
  { id: "duotone", group: "Photo Tools", name: "Duotone", mode: "full", map: true, palettes: "" },
  { id: "toning", group: "Photo Tools", name: "B&W Toning", mode: "full", map: true, palettes: `
Classic Sepia: #1a1006 #4d3218 #9c7650 #e0c9a6 #fffaf0
Selenium: #0f0d14 #3a2f3d #7a6a73 #c8bdbd #faf7f4
Cyanotype: #001730 #0b3d6b #3a78a8 #a6c8e0 #f2f8fc
Platinum: #141210 #3d3833 #85796d #cfc3b4 #fbf8f2
Gold Tone: #120e14 #3b3348 #7e7891 #d6cbb0 #fffaf0
Copper Tone: #1a0d08 #522a1a #a06246 #e6b89c #fff3ea
Split Tone Teal Gold: #05161c #1f4a52 #8a8a7a #e6c78f #fff9ec
Split Tone Blue Peach: #0b1430 #354a7a #9a96a6 #f0c2a8 #fff6f0
Kallitype: #1c0f0a #4e2c1c #96684a #dfc3a2 #fbf4e9
Van Dyke: #140904 #3b2010 #7a4a2a #c79a74 #f5e6d3
Cool Silver: #08090b #2b3036 #6f7882 #bcc4cc #f7f9fb
Lith Print: #0d0603 #3a1a0d #915838 #e8b892 #fff4e6
Warm Silver: #0e0c0a #36302b #7d736a #cfc5b9 #fbf9f5
Infrared: #0a0010 #4a1450 #b85c8f #f5c6d6 #fff8fb
Bronze Tone: #120b06 #3e2a18 #86663f #d9bd8a #fffaee
Blue Hour Tone: #060a14 #1e2c4a #5d7196 #b8c3d6 #f6f8fc
Rose Tone: #160a0d #4a2a33 #93707b #dcc3c6 #fff8f8
Olive Tone: #0e0f08 #353826 #75785a #c4c3a5 #fafaf0
Sepia Soft: #2a1f17 #5c4636 #9c8269 #d9c6ab #fbf5ea
Split Tone Green Pink: #08140f #2f4f40 #8a8f88 #e8c3c9 #fff5f6
Split Tone Purple Gold: #120b1f #3f2f5c #8f8095 #e6cf9a #fffaea
Deep Selenium: #050307 #2a1e2c #6a5866 #bdaeb0 #f8f4f2
Charcoal Paper: #0f0f0f #333230 #6e6b66 #b5b0a8 #f2efe9
Moonlight: #02040a #172238 #4a5f80 #a9b7cc #eef3fa
` },
  { id: "cinema", group: "Photo Tools", name: "Cinematic Grades", mode: "full", map: true, palettes: `
Blockbuster: #031418 #0e3b44 #5c7a74 #d9a066 #ffe9c9
Night Blue: #000814 #0b1f3a #2e4b72 #8aa1c1 #e8eef7
Desert War: #1d1408 #4f3a1c #a1814f #e5cf98 #fff7e0
Neo Noir: #000000 #1a0d24 #5a2c4f #e05a5a #fff0e8
Pastel Comedy: #2a2b40 #6c6f9c #e3a6b8 #ffe2c6 #fffaf2
Bleach Bypass: #0b0c0c #33393a #7d8584 #c5c9c4 #f4f5f1
Tropical Thriller: #021a14 #0b4a3a #4f8f6b #e8c56b #fff7d6
Retro Western: #1c0e06 #5a2b12 #b0652e #efc27e #fff4dc
Sci-Fi Green: #000a05 #0f2a1c #3f6b4f #b5d1a0 #f2ffe8
Winter Drama: #04070d #1c2a38 #5f7486 #b8c7d1 #f5f8fa
Dream Sequence: #140a2a #4a2f6b #b47fb8 #ffd0d0 #fffaf6
Vintage TV: #101010 #3f3b2f #8c8668 #d9d3a8 #faf8ea
Teal Shadows Pink Lights: #021619 #155a5c #7f8d8a #f2b6b0 #fff4f0
Amber Night: #050302 #2b1608 #7a4515 #e09a46 #fff0d4
Cold War: #05070a #222b33 #5f6f78 #b6c0bf #f2f4f0
Golden Lights: #0b0a10 #2f2b40 #7a6f6a #e8c27a #fff8e6
Horror Green: #020503 #0f2414 #3c5c3a #a7b88a #f0f5e6
Romance: #1a0c12 #4f2a38 #a26f7c #f2c9c4 #fff7f2
Noir Gold: #000000 #1a140a #5a4520 #c9a35a #fff6dc
Urban Night: #03050b #10233b #2f6f8a #e07a5f #ffe9d6
Summer Haze: #2a2420 #6a5a4c #b49a7c #f4d9b0 #fff8ec
Ocean Thriller: #01080c #06303f #2a7a85 #a8d6c9 #f2fffa
` },
  { id: "fades", group: "Photo Tools", name: "Transparent Fades", mode: "full", palettes: `
Black Fade: #000000ff #00000000
White Fade: #ffffffff #ffffff00
Soft Shadow: #000000b3 #00000040@45 #00000000
Vignette Band: #00000000 #00000000@55 #000000cc
Top Light: #ffffffcc #ffffff00@60
Sunset Fade: #f7785eff #fbb07d80@50 #fbb07d00
Ocean Fade: #0c4fc9ff #4a66ec80@50 #79b0f400
Purple Fade: #3c129cff #7012b380@50 #ef2a8a00
Gold Fade: #b8860bff #f5d06180@50 #fff6c900
Fog Bottom: #e6ebef00 #e6ebef99@60 #e6ebefff
Night Overlay: #0b132b00 #0b132bcc
Warm Overlay: #ffb34700 #ffb3478c
Teal Overlay: #00838a00 #00838a99
Pink Glow Fade: #ff2ec4ff #ff2ec400
Teal Fade: #0f8f86ff #0f8f8600
Red Fade: #c8102eff #c8102e00
Lilac Fade: #b46cf0ff #b46cf000
Gold Glow Fade: #f9d06fff #f9d06f00
Edge Darken: #000000aa #00000000@30 #00000000@70 #000000aa
Bottom Shade: #00000000@40 #000000d9
Cream Fade: #fbf2deff #fbf2de00
Navy Fade: #0c1b3dff #0c1b3d00
Haze Band: #ffffff00 #ffffff99@50 #ffffff00
` },
  { id: "skin", group: "Photo Tools", name: "Skin Tones", mode: "windows", palettes: `
Porcelain: #f6e1d3 #efcfbd #e3b9a3
Rosy Fair: #f3d5c6 #e8b5a2 #d99a85
Warm Beige: #e8c2a0 #d6a582 #c18a65
Golden Olive: #d9b38c #c49a6c #a8804f
Honey: #d6a26f #bf8752 #9f6a3c
Caramel: #b98058 #9e6640 #7d4e2f
Bronze Skin: #a46b45 #8a5535 #6b3f25
Deep Umber: #7a4b32 #5e3624 #432519
Ebony: #5a3828 #432a1f #2c1b14
Cool Rose: #f0d0cb #dcaea8 #c48a85
Blush Cheek: #f7d9cf #f2b8aa #e8968a
Shadow Contour: #c49a85 #9c7462 #6e4f43
` },

  // ------------------------------------------------------------------ Art & Style
  { id: "art", group: "Art & Style", name: "Art Movements", mode: "windows", palettes: `
Bauhaus: #1d1d1b #e3000f #ffcc00 #0050a0 #f2f2f2
Memphis: #ff4f9a #ffd400 #00b3b3 #3a3a8c
Art Deco: #0d0d0d #1f3b2d #b08d57 #efe2c4
Mid-Century: #2e4656 #366386 #8bb8d2 #f0ab36 #e9632a
Pop Art Dots: #ff2052 #ffe500 #00a6ff
Swiss Style: #e30613 #ffffff #000000
Impressionist: #6c8ebf #b8c9e6 #f2d7a7 #e8a07c
Nouveau: #3c4a2b #7b8a4f #d1b77d #f3e6c4
Constructivist: #121212 #c8102e #f2e8d5
De Stijl: #dd0100 #fac901 #225095
Fauvist: #e0404c #efa366 #31988b #284651
Ukiyo: #1b3a4b #f2e3c6 #d1495b #edae49
` },
  { id: "food", group: "Art & Style", name: "Food & Drink", mode: "windows", palettes: `
Espresso: #1b0f08 #3e2416 #7a4b2e #c79a72
Latte: #6f4e37 #a67b5b #d7b899 #f3e5d0
Berry Smoothie: #4a0d3f #8e1b6b #d6458f #ffb3d1
Citrus: #ff7b00 #ffb700 #ffe94d #c6f26a
Matcha Latte: #4e6b2e #8fa65a #cfd9a5 #f4f1e1
Red Wine: #1f0010 #4c0020 #7d1235 #b3445e
Watermelon: #ff4f5e #ff8a8a #c8f7c5 #2d6a4f
Blueberry: #1c1f4a #3b3f8c #6f74d1 #c7c9ff
Peach Iced Tea: #ffb38a #ffd3a3 #fff1d6
Mango: #ff8c00 #ffb627 #ffe066
Chocolate: #1e0f0a #3b1f14 #6b3b25 #a46a46
Mint Chip: #bdf2cf #72e6ae #3b2622
Lemonade: #fdf3a4 #f9e761 #f2cf3d
Cotton Candy: #ffbcd9 #c5b8ff #a0e7ff
` },
  { id: "rainbow", group: "Art & Style", name: "Rainbow & Spectrum", mode: "full", palettes: `
Spectrum: #ff0000 #ff8000 #ffff00 #00ff00 #00ffff #0000ff #8000ff #ff00ff
Soft Rainbow: #f99ea6 #fbbab3 #fbd9c2 #e3eecd #b9e6d6 #c8cde8
Pride: #e40303 #ff8c00 #ffed00 #008026 #004dff #750787
Hue Wheel: #ff0000 #ffff00 #00ff00 #00ffff #0000ff #ff00ff #ff0000
Pastel Spectrum: #ffd1d1 #ffe8c7 #fffbc7 #d6ffd1 #d1f0ff #e3d1ff
Deep Spectrum: #8b0000 #b35900 #a68a00 #006b2e #004d99 #4b0082
Warm Spectrum: #ff004d #ff6a00 #ffc300 #fff1a8
Cool Spectrum: #00f5d4 #00bbf9 #4361ee #7209b7
Neon Spectrum: #ff006e #ff7b00 #ffea00 #39ff14 #00f0ff #8f00ff
Muted Rainbow: #c96b6b #d9a066 #d6c86b #7fae7f #6b9ac9 #9a7fc0
Sunset Spectrum: #3b1c6e #b3367a #f26a4f #f9b14a #f9e27a
Ocean Spectrum: #0b1f5c #1452a6 #1f9bc2 #3fd2b0 #b9f27a
Retro Rainbow: #d6452c #ee8a2f #f2c04a #6aa84f #3d78b5 #7a4fa0
Candy Rainbow: #ff8fb1 #ffc38f #fff18f #9ff2a6 #8fd6ff #c49fff
Dark Rainbow: #4a0d1e #5a3a0d #3d4a0d #0d4a2f #0d2f4a #2f0d4a
Infrared Spectrum: #1a0033 #5c0099 #cc0066 #ff6600 #ffcc00 #ffffcc
Thermal: #000033 #4b0082 #c71585 #ff4500 #ffd700 #ffffff
Earth Spectrum: #6b2f1f #a8652a #c9a646 #6f8f45 #3f6f7a #4f4f7f
Pastel Wheel: #ffc9c9 #fff0c2 #d3f8c8 #c6ecfb #e0cffc #ffc9c9
` },
  { id: "mono", group: "Art & Style", name: "Monochrome", mode: "full", palettes: "" },
  { id: "grays", group: "Art & Style", name: "Black, White & Grays", mode: "full", map: true, palettes: `
Pure Black to White: #000000 #ffffff
Soft Contrast: #1a1a1a #e6e6e6
Warm Gray: #1c1916 #4d4741 #8f877e #d6cfc6 #f7f4f0
Cool Gray: #12161a #3f4851 #838e99 #cbd3da #f4f7f9
Charcoal: #111111 #2e2e2e #5a5a5a
Silver Mist: #8c9aa6 #c3ccd2 #eef1f2
Midnight Gray: #000000 #1f2122 #3d4042
Paper White: #e8e6e1 #f7f6f3 #ffffff
Smoke: #38373b #57544b #77735f
Graphite Fade: #0f0f0f #545454 #a8a8a8
Studio Backdrop: #2a2a2a #4a4a4a #6e6e6e
Fog Gray: #a3a8ad #c9cdd1 #edeff1
Lead: #1e2124 #3c4147 #5d646b
Newsprint: #2b2b2b #7a7874 #d9d6cf
High Key: #cfcfcf #ececec #ffffff
Low Key: #000000 #0d0d0d #262626
Blue Black: #000000 #0a0f1a #1c2638
Brown Black: #000000 #140d08 #2b1d14
Gray Ramp Five: #000000 #404040 #808080 #bfbfbf #ffffff
` },
];
