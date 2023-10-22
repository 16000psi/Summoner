from .engine import Engine 
from .decision import Decision
from .scene import Scene

class Area:
    def __init__(self, title, visit_text, inside_text, preferred_key):
        self.title = title
        self.visit_text = visit_text
        self.inside_text = inside_text
        self.preferred_key = preferred_key
        self.links_to = []
        

    def define_connections(self, area_list):
        self.links_to = area_list

    def process(self):

        for_display = [self.visit_text]
        options = []

        for  area in self.links_to:

            name = area.title
            choice_description = area.visit_text
            preferred_key = area.preferred_key
            action = area.process
            
            options.append(Decision(name, choice_description, preferred_key, action))

        Engine.remove_scene()
        Engine.add_scene(Scene(for_display, options))

area1 = Area("first area", "go to first area", "you are inside first area", "1")
area2 = Area("second area", "go to second area", "you are inside second area", "2")
area3 = Area("third area", "go to third area", "you are inside third area", "3")

area1.define_connections([area2, area3])
area2.define_connections([area1, area3])
area3.define_connections([area2, area1])

area1.process()
Engine.main()
