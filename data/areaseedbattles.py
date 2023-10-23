from .areas import *
from .battles import *

area1.define_available_battles([example_battle])
example_battle.define_lost_action(area1.process)
example_battle.define_won_action(area1.process)

