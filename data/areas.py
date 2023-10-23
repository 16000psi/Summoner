from main.area import Area

area1 = Area("first area", "go to first area", "you are too weak to enter", "you are inside first area", "1")
area2 = Area("second area", "go to second area", "you are too weak to enter", "you are inside second area", "2")
area3 = Area("third area", "go to third area", "you are too weak to enter", "you are inside third area", "3")

area1.define_connections([area2, area3])
area2.define_connections([area1, area3])
area3.define_connections([area2, area1])

