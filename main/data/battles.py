from main.battle import Battle
from main.data.summoners import example_summoner

example_battle = Battle(
    example_summoner,
    "to challenge example summoner",
    "B",
    "grrrr you are in a battle with example summoner!",
    "woops, you lost your battle with example summoner.",
    "yey, you won your battle against example summoner!",
)
