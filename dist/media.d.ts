/**
 * Shared demo media. Files live in `public/media/`, credits in `public/media/CREDITS.md`.
 * Portraits are 400 px squares; photos are 1600 px on the long side.
 */
export interface MediaPerson {
    id: string;
    name: string;
    role?: string;
    src: string;
}
export interface MediaPhoto {
    id: string;
    alt: string;
    src: string;
    width: number;
    height: number;
}
export declare const people: readonly [{
    readonly id: "emma-collins";
    readonly name: "Emma Collins";
    readonly role: "Product designer";
    readonly src: "/media/people/emma-collins.jpg";
}, {
    readonly id: "marcus-johnson";
    readonly name: "Marcus Johnson";
    readonly role: "Frontend engineer";
    readonly src: "/media/people/marcus-johnson.jpg";
}, {
    readonly id: "jasmine-brooks";
    readonly name: "Jasmine Brooks";
    readonly role: "Design lead";
    readonly src: "/media/people/jasmine-brooks.jpg";
}, {
    readonly id: "olivia-bennett";
    readonly name: "Olivia Bennett";
    readonly role: "Platform engineer";
    readonly src: "/media/people/olivia-bennett.jpg";
}, {
    readonly id: "sofia-ramirez";
    readonly name: "Sofia Ramirez";
    readonly role: "Operations lead";
    readonly src: "/media/people/sofia-ramirez.jpg";
}, {
    readonly id: "ryan-sullivan";
    readonly name: "Ryan Sullivan";
    readonly role: "Account executive";
    readonly src: "/media/people/ryan-sullivan.jpg";
}, {
    readonly id: "hannah-walsh";
    readonly name: "Hannah Walsh";
    readonly role: "Customer success";
    readonly src: "/media/people/hannah-walsh.jpg";
}, {
    readonly id: "chloe-nguyen";
    readonly name: "Chloe Nguyen";
    readonly role: "Data analyst";
    readonly src: "/media/people/chloe-nguyen.jpg";
}, {
    readonly id: "ava-mitchell";
    readonly name: "Ava Mitchell";
    readonly role: "Marketing manager";
    readonly src: "/media/people/ava-mitchell.jpg";
}, {
    readonly id: "daniel-kim";
    readonly name: "Daniel Kim";
    readonly role: "Backend engineer";
    readonly src: "/media/people/daniel-kim.jpg";
}, {
    readonly id: "jordan-reyes";
    readonly name: "Jordan Reyes";
    readonly role: "Support specialist";
    readonly src: "/media/people/jordan-reyes.jpg";
}, {
    readonly id: "mateo-alvarez";
    readonly name: "Mateo Alvarez";
    readonly role: "Mobile engineer";
    readonly src: "/media/people/mateo-alvarez.jpg";
}, {
    readonly id: "tyler-hayes";
    readonly name: "Tyler Hayes";
    readonly role: "Sales lead";
    readonly src: "/media/people/tyler-hayes.jpg";
}, {
    readonly id: "andre-williams";
    readonly name: "Andre Williams";
    readonly role: "Finance partner";
    readonly src: "/media/people/andre-williams.jpg";
}, {
    readonly id: "nathan-cole";
    readonly name: "Nathan Cole";
    readonly role: "Engineering manager";
    readonly src: "/media/people/nathan-cole.jpg";
}, {
    readonly id: "diane-foster";
    readonly name: "Diane Foster";
    readonly role: "Chief operating officer";
    readonly src: "/media/people/diane-foster.jpg";
}];
export declare const photos: readonly [{
    readonly id: "lounge-chair";
    readonly alt: "A woven oak lounge chair with a sheepskin and linen cushion on a concrete floor";
    readonly src: "/media/photos/lounge-chair.jpg";
    readonly width: 1280;
    readonly height: 1600;
}, {
    readonly id: "table-lamp";
    readonly alt: "A white mushroom table lamp glowing beside books and a small vase";
    readonly src: "/media/photos/table-lamp.jpg";
    readonly width: 1600;
    readonly height: 900;
}, {
    readonly id: "linen-throw";
    readonly alt: "Folded natural linen throws with fringed edges in soft window light";
    readonly src: "/media/photos/linen-throw.jpg";
    readonly width: 1067;
    readonly height: 1600;
}, {
    readonly id: "glass-carafe";
    readonly alt: "A hand pouring water from a ribbed glass carafe into tumblers";
    readonly src: "/media/photos/glass-carafe.jpg";
    readonly width: 1280;
    readonly height: 1600;
}, {
    readonly id: "stoneware-cups";
    readonly alt: "Two speckled stoneware cups with a lid on a pale table";
    readonly src: "/media/photos/stoneware-cups.jpg";
    readonly width: 1067;
    readonly height: 1600;
}, {
    readonly id: "stacked-bowls";
    readonly alt: "Two stacked speckled ceramic bowls against a dark wall";
    readonly src: "/media/photos/stacked-bowls.jpg";
    readonly width: 1600;
    readonly height: 1067;
}, {
    readonly id: "ceramic-lamp";
    readonly alt: "A sculptural ceramic lamp with a linen shade on a walnut sideboard";
    readonly src: "/media/photos/ceramic-lamp.jpg";
    readonly width: 1067;
    readonly height: 1600;
}, {
    readonly id: "living-room";
    readonly alt: "A bright living room with timber beams, arched windows, and cream sofas";
    readonly src: "/media/photos/living-room.jpg";
    readonly width: 1200;
    readonly height: 1600;
}, {
    readonly id: "sunroom";
    readonly alt: "A sunroom with a round dining table, plants, and windows on three sides";
    readonly src: "/media/photos/sunroom.jpg";
    readonly width: 1600;
    readonly height: 1067;
}, {
    readonly id: "home-office";
    readonly alt: "A home office with a wooden desk and deep green walls";
    readonly src: "/media/photos/home-office.jpg";
    readonly width: 1600;
    readonly height: 1200;
}, {
    readonly id: "reading-chair";
    readonly alt: "A grey armchair and ottoman with a knit throw in a dark green room";
    readonly src: "/media/photos/reading-chair.jpg";
    readonly width: 1600;
    readonly height: 900;
}, {
    readonly id: "bedroom";
    readonly alt: "A made bed with striped linen pillows against an oak headboard";
    readonly src: "/media/photos/bedroom.jpg";
    readonly width: 1067;
    readonly height: 1600;
}, {
    readonly id: "restaurant";
    readonly alt: "A warm restaurant dining room with woven pendant lights and a tree";
    readonly src: "/media/photos/restaurant.jpg";
    readonly width: 1067;
    readonly height: 1600;
}, {
    readonly id: "wine-bar";
    readonly alt: "A glass carafe of red wine on a bar table in low evening light";
    readonly src: "/media/photos/wine-bar.jpg";
    readonly width: 1600;
    readonly height: 1067;
}, {
    readonly id: "concert-hall";
    readonly alt: "Curved stainless steel panels of the Walt Disney Concert Hall against a blue sky";
    readonly src: "/media/photos/concert-hall.jpg";
    readonly width: 1600;
    readonly height: 1143;
}, {
    readonly id: "curved-facade";
    readonly alt: "A white tiled building facade with curved balconies";
    readonly src: "/media/photos/curved-facade.jpg";
    readonly width: 1600;
    readonly height: 1067;
}, {
    readonly id: "pool-house";
    readonly alt: "A modern glass house beside a long pool under a clear sky";
    readonly src: "/media/photos/pool-house.jpg";
    readonly width: 1600;
    readonly height: 900;
}, {
    readonly id: "terracotta-waves";
    readonly alt: "Wavy terracotta walls rising toward a blue sky";
    readonly src: "/media/photos/terracotta-waves.jpg";
    readonly width: 1067;
    readonly height: 1600;
}, {
    readonly id: "mountain-ridges";
    readonly alt: "Layered mountain ridges under a warm evening sky";
    readonly src: "/media/photos/mountain-ridges.jpg";
    readonly width: 1600;
    readonly height: 1068;
}, {
    readonly id: "alpine-lake";
    readonly alt: "A calm alpine lake reflecting a rocky peak at golden hour";
    readonly src: "/media/photos/alpine-lake.jpg";
    readonly width: 1067;
    readonly height: 1600;
}, {
    readonly id: "coastline";
    readonly alt: "A long coastline with waves rolling onto a beach below green cliffs";
    readonly src: "/media/photos/coastline.jpg";
    readonly width: 1200;
    readonly height: 1600;
}, {
    readonly id: "sea-at-dusk";
    readonly alt: "A calm sea at dusk with a low island on the horizon";
    readonly src: "/media/photos/sea-at-dusk.jpg";
    readonly width: 1067;
    readonly height: 1600;
}, {
    readonly id: "lisbon-tram";
    readonly alt: "A yellow tram on a street lined with historic buildings in Lisbon";
    readonly src: "/media/photos/lisbon-tram.jpg";
    readonly width: 1600;
    readonly height: 1064;
}, {
    readonly id: "lisbon-bridge";
    readonly alt: "The 25 de Abril Bridge crossing the Tagus in Lisbon";
    readonly src: "/media/photos/lisbon-bridge.jpg";
    readonly width: 1600;
    readonly height: 1166;
}, {
    readonly id: "lisbon-rooftops";
    readonly alt: "Terracotta rooftops of Lisbon running down to the river";
    readonly src: "/media/photos/lisbon-rooftops.jpg";
    readonly width: 1280;
    readonly height: 1600;
}, {
    readonly id: "salmon-dinner";
    readonly alt: "Seared salmon with a bright herb salsa and a glass of red wine";
    readonly src: "/media/photos/salmon-dinner.jpg";
    readonly width: 1067;
    readonly height: 1600;
}, {
    readonly id: "chef-plating";
    readonly alt: "A chef spooning sauce onto a plated dish in a dark kitchen";
    readonly src: "/media/photos/chef-plating.jpg";
    readonly width: 1600;
    readonly height: 1600;
}];
export type PersonId = (typeof people)[number]["id"];
export type PhotoId = (typeof photos)[number]["id"];
/** Looks up a person by id. */
export declare function person(id: PersonId): MediaPerson;
/** Looks up a photo by id. */
export declare function photo(id: PhotoId): MediaPhoto;
/** Square 400 px avatar path for a person id, for `src` props. */
export declare const avatar: (id: PersonId) => string;
/** 800 × 1000 portrait crop of the same photo, for image-led layouts. */
export declare const portrait: (id: PersonId) => string;
/** The first `count` people, for avatar stacks and lists. */
export declare const peopleSample: (count: number) => ({
    readonly id: "emma-collins";
    readonly name: "Emma Collins";
    readonly role: "Product designer";
    readonly src: "/media/people/emma-collins.jpg";
} | {
    readonly id: "marcus-johnson";
    readonly name: "Marcus Johnson";
    readonly role: "Frontend engineer";
    readonly src: "/media/people/marcus-johnson.jpg";
} | {
    readonly id: "jasmine-brooks";
    readonly name: "Jasmine Brooks";
    readonly role: "Design lead";
    readonly src: "/media/people/jasmine-brooks.jpg";
} | {
    readonly id: "olivia-bennett";
    readonly name: "Olivia Bennett";
    readonly role: "Platform engineer";
    readonly src: "/media/people/olivia-bennett.jpg";
} | {
    readonly id: "sofia-ramirez";
    readonly name: "Sofia Ramirez";
    readonly role: "Operations lead";
    readonly src: "/media/people/sofia-ramirez.jpg";
} | {
    readonly id: "ryan-sullivan";
    readonly name: "Ryan Sullivan";
    readonly role: "Account executive";
    readonly src: "/media/people/ryan-sullivan.jpg";
} | {
    readonly id: "hannah-walsh";
    readonly name: "Hannah Walsh";
    readonly role: "Customer success";
    readonly src: "/media/people/hannah-walsh.jpg";
} | {
    readonly id: "chloe-nguyen";
    readonly name: "Chloe Nguyen";
    readonly role: "Data analyst";
    readonly src: "/media/people/chloe-nguyen.jpg";
} | {
    readonly id: "ava-mitchell";
    readonly name: "Ava Mitchell";
    readonly role: "Marketing manager";
    readonly src: "/media/people/ava-mitchell.jpg";
} | {
    readonly id: "daniel-kim";
    readonly name: "Daniel Kim";
    readonly role: "Backend engineer";
    readonly src: "/media/people/daniel-kim.jpg";
} | {
    readonly id: "jordan-reyes";
    readonly name: "Jordan Reyes";
    readonly role: "Support specialist";
    readonly src: "/media/people/jordan-reyes.jpg";
} | {
    readonly id: "mateo-alvarez";
    readonly name: "Mateo Alvarez";
    readonly role: "Mobile engineer";
    readonly src: "/media/people/mateo-alvarez.jpg";
} | {
    readonly id: "tyler-hayes";
    readonly name: "Tyler Hayes";
    readonly role: "Sales lead";
    readonly src: "/media/people/tyler-hayes.jpg";
} | {
    readonly id: "andre-williams";
    readonly name: "Andre Williams";
    readonly role: "Finance partner";
    readonly src: "/media/people/andre-williams.jpg";
} | {
    readonly id: "nathan-cole";
    readonly name: "Nathan Cole";
    readonly role: "Engineering manager";
    readonly src: "/media/people/nathan-cole.jpg";
} | {
    readonly id: "diane-foster";
    readonly name: "Diane Foster";
    readonly role: "Chief operating officer";
    readonly src: "/media/people/diane-foster.jpg";
})[];
