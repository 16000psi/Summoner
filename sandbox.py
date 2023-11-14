from main.engine import Engine
from main.data.quests import example_quest
from main.data.areaseedbattles import *

example_quest.increment_progress(10)
Engine.print_scene_info()
area_chambers.process()
Engine.main()

