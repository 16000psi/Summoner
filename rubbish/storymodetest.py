class Summoner:
    def __init__(self, name):
        self.name = name

class Player(Summoner):
    def __init__(self, name, level):
        super().__init__(name)
        self.story_level = level



class Area:
    def __init__(self, req_level, visit_text, inside_text):
        self.req_level = req_level
        self.visit_text = visit_text
        self.inside_text = inside_text
        self.links_to = []

    def define_connections(self, area_list):
        self.links_to = area_list

    def process(self, player):

        print(self.inside_text)
        visitable = []
        options = ""
        for i, area in enumerate(self.links_to):
            if area.req_level <= player.story_level:
                options += f"press {i} to visit {area.visit_text}, "
                visitable.append(area)
                
        print(options)
        print (f"press 0 - {len(visitable) - 1} to select an area")
        selection = input("What is your selection")

        try:
            selection = int(selection)

        except:
            return self.process(player)

        if selection < 0 or selection > (len(visitable) - 1):
            return self.process(player)

        return visitable[selection].process(player)
            


area1 = Area(0, "go to area 1", "you are in area 1")
area2 = Area(1, "go to area 2", "you are in area 2")
area3 = Area(2, "go to area 3", "you are in area 3")
area4 = Area(3, "go to area 4", "you are in area 4")


area1.define_connections([area2,area3,area4])
area2.define_connections([area1,area3,area4])
area3.define_connections([area2,area1,area4])
area4.define_connections([area2,area3,area1])

testPlayer = Player("dave", 1)
area1.process(testPlayer)
