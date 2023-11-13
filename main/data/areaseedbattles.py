from .areas import *
from .battles import *
from .quests import *

area1.define_available_battles([example_battle])
area2.define_appearance_conditions([lambda: example_quest.make_progress_check(10, 20)])
area2.define_entrance_conditions([lambda: example_quest.make_progress_check(15, 20)])
example_battle.define_lost_action(area1.process)
example_battle.define_won_action(area1.process)

