from main.area import Area

area_chambers = Area(
    "Player Chambers",
    "go to your chambers",
    "you are too weak to enter",
    "You are inside your chambers. You have a bed, and a window.",
    "c"
)
area_great_hall = Area(
    "Great Hall",
    "enter the Great Hall",
    "you are too weak to enter",
    "You are inside the great hall. The fire is roaring.",
    "c"
)
area_courtyard = Area(
    "Courtyard",
    "enter the courtyard",
    "you are too weak to enter",
    "You are in the coartyard.  There are some lovely plants.",
    "b"
)
area_lounge = Area(
    "Lounge",
    "enter the lounge",
    "you are too weak to enter",
    "You are in the lounge. The furniture is incredibly dated.",
    "b"
)
area_cave = Area(
    "Cave",
    "Enter the cave",
    "you are too weak to enter",
    "You are in the cave. There is mould on the walls.",
    "b"
)
area_chambers.define_connections([area_great_hall])
area_great_hall.define_connections([
    area_lounge, area_courtyard, area_chambers
])
area_lounge.define_connections([area_great_hall])
area_courtyard.define_connections([area_great_hall, area_cave])
area_cave.define_connections([area_chambers])
