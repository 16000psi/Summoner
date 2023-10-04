import random
import math

class Demon:

    # randomness modifier - maximum deviation from base stat value, as a fraction of 1
    stat_randomness_modifier = 0.2
    # the maximum possible level of a demon
    maximum_level = 30
    # starting point for xp growth calculation
    base_xp = 100
    # determines the increase in xp required per level
    xp_growth_factor = 1.2

    # minimum hp
    hp_buffer_value = 10


    def __init__(self, level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed):

        self.level = level
        self.xp = 0

        self.species = None
        self.type = None
        self.nickname = None


        # This is where the base stats are generated.  The base stats are passed when initialising a demon, and have deviation applied based on Demon.stat_randomness_modifier.        

        self.base_hp = math.floor(base_hp * (1 + random.uniform(-Demon.stat_randomness_modifier, Demon.stat_randomness_modifier)))
        self.base_attack = math.floor(base_attack * (1 + random.uniform(-Demon.stat_randomness_modifier, Demon.stat_randomness_modifier)))
        self.base_defence = math.floor(base_defence * (1 + random.uniform(-Demon.stat_randomness_modifier, Demon.stat_randomness_modifier)))
        self.base_special_attack = math.floor(base_special_attack * (1 + random.uniform(-Demon.stat_randomness_modifier, Demon.stat_randomness_modifier)))
        self.base_special_defence = math.floor(base_special_defence * (1 + random.uniform(-Demon.stat_randomness_modifier, Demon.stat_randomness_modifier)))
        self.base_speed = math.floor(base_speed * (1 + random.uniform(-Demon.stat_randomness_modifier, Demon.stat_randomness_modifier)))

        self.max_hp = self.derive_stat_from_level(self.base_hp) + Demon.hp_buffer_value
        self.attack = self.derive_stat_from_level(self.base_attack)
        self.defence = self.derive_stat_from_level(self.base_defence)
        self.special_attack = self.derive_stat_from_level(self.base_special_attack)
        self.special_defence = self.derive_stat_from_level(self.base_special_defence)
        self.speed = self.derive_stat_from_level(self.base_speed)

        self.hp = self.max_hp


    # XP / level methods

    def derive_stat_from_level(self, base_stat):

        """This method is used on initialisation and when leveling up.  It is applied to each stat and calculates the stat as a fraction of the base stat. It cannot return less than 1."""

        
        stat_per_level = base_stat / Demon.maximum_level

        result = math.floor(stat_per_level * self.level)
        
        if result < 1:
            result = 1

        return result

    def receive_xp_check_level_up(self, xp):

        """Receives XP, adds to total. Checks if level up, calls level_up if so, removes xp required to level up from self.xp, and returns true.  Returns false if no level up. Relies on base_xp and xp_growthfactor to check for level up."""

        self.xp += xp

        target_xp = math.floor(Demon.base_xp * (Demon.xp_growth_factor ** (self.level))) 

        if self.xp > target_xp and self.level < Demon.maximum_level:

            self.xp -= target_xp
            self.level_up()

            return True
        
        return False

    def level_up(self):

        """Called by receive_xp_check_level_up if leveled up. Adds a level and recalculates stats."""

        self.level += 1

        self.max_hp = self.derive_stat_from_level(self.base_hp) + Demon.hp_buffer_value
        self.attack = self.derive_stat_from_level(self.base_attack)
        self.defence = self.derive_stat_from_level(self.base_defence)
        self.special_attack = self.derive_stat_from_level(self.base_special_attack)
        self.special_defence = self.derive_stat_from_level(self.base_special_defence)
        self.speed = self.derive_stat_from_level(self.base_speed)


    # Reporting methods

    def create_full_hash_stat_report(self):
        return {
            "species": self.species,
            "type": self.type,
            "level": self.level,
            "xp": self.xp,
            "nickname": self.nickname,
            "basehp" : self.base_hp,
            "baseAtt" : self.base_attack,
            "baseDef" : self.base_defence,
            "baseSpAtt" : self.base_special_attack,
            "baseSpDef" : self.base_special_defence,
            "baseSpeed" : self.base_speed,
            "hp" : self.hp,
            "maxhp" : self.max_hp,
            "attack" : self.attack,
            "defence" : self.defence,
            "spAtt" : self.special_attack,
            "spDef" : self.special_defence,
            "speed" : self.speed
        }

    def create_combat_hash_stat_report(self):
        return {
            "level": self.level,
            "xp": self.xp,
            "hp" : self.hp,
            "maxhp" : self.max_hp,
            "attack" : self.attack,
            "defence" : self.defence,
            "spAtt" : self.special_attack,
            "spDef" : self.special_defence,
            "speed" : self.speed
        }


    def check_if_alive(self):
        if self.hp > 0:
            return True
        else:
            return False


    # Combat methods 

    def kill(self):
        self.hp = 0


"""Demon types"""

class DestructionDemon(Demon):
    def __init__(self, level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed):
        super().__init__(level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed)

        self.type = "Destruction"

class VoidDemon(Demon):
    def __init__(self, level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed):
        super().__init__(level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed)

        self.type = "Void"

class ArcaneDemon(Demon):
    def __init__(self, level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed):
        super().__init__(level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed)

        self.type = "Arcane"

class DecayDemon(Demon):
    def __init__(self, level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed):
        super().__init__(level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed)

        self.type = "Decay"

class AncientDemon(Demon):
    def __init__(self, level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed):
        super().__init__(level, base_hp, base_attack, base_defence, base_special_attack, base_special_defence, base_speed)

        self.type = "Ancient"


"""Individual Demons"""

# Destruction demons

class Imp(DestructionDemon):
    def __init__(self, level):
        super().__init__(level, 70, 92, 45, 132, 98, 116)
        self.species = "Imp"


class HornedDemon(DestructionDemon):
    def __init__(self, level):
        super().__init__(level, 110, 140, 92, 60, 60, 92)
        self.species = "Horned Demon"


class Flamelurker(DestructionDemon):
    def __init__(self, level):
        super().__init__(level, 60, 125, 120, 92, 50, 105)
        self.species = "Flamelurker"


class Infernal(DestructionDemon):
    def __init__(self, level):
        super().__init__(level, 92, 87, 113, 81, 103, 76)
        self.species = "Infernal"


class Sedimentite(DestructionDemon):
    def __init__(self, level):
        super().__init__(level, 160, 110, 65, 65, 110, 40)
        self.species = "Sedimentite"


class StormDemon(DestructionDemon):
    def __init__(self, level):
        super().__init__(level, 80, 92, 100, 120, 60, 100)
        self.species = "Storm Demon"


# Void demons

class Voidwalker(VoidDemon):
    def __init__(self, level):
        super().__init__(level, 130, 95, 75, 92, 88, 72)
        self.species = "Voidwalker"


class Succubus(VoidDemon):
    def __init__(self, level):
        super().__init__(level, 105, 100, 70, 88, 92, 97)
        self.species = "Succubus"


class SoulEater(VoidDemon):
    def __init__(self, level):
        super().__init__(level, 75, 78, 48, 156, 90, 92)
        self.species = "Soul Eater"


class SpiderDemon(VoidDemon):
    def __init__(self, level):
        super().__init__(level, 102, 145, 130, 26, 33, 120)
        self.species = "Spider Demon"


class VoidTerror(VoidDemon):
    def __init__(self, level):
        super().__init__(level, 103, 110, 78, 119, 63, 78)
        self.species = "Void Terror"


class AbyssalDemon(VoidDemon):
    def __init__(self, level):
        super().__init__(level, 85, 115, 87, 103, 92, 76)
        self.species = "Abyssal Demon"


# Arcane demons

class AlchemicalTrickster(ArcaneDemon):
    def __init__(self, level):
        super().__init__(level, 70, 60, 92, 100, 117, 113)
        self.species = "Alchemical Trickster"


class DreamWeaver(ArcaneDemon):
    def __init__(self, level):
        super().__init__(level, 85, 80, 80, 95, 80, 130)
        self.species = "Dream Weaver"


class PortaEntity(ArcaneDemon):
    def __init__(self, level):
        super().__init__(level, 170, 50, 100, 50, 70, 110)
        self.species = "Portal Entity"


class CrystalDemon(ArcaneDemon):
    def __init__(self, level):
        super().__init__(level, 100, 90, 120, 67, 130, 50)
        self.species = "Crystal Demon"


class Spellthief(ArcaneDemon):
    def __init__(self, level):
        super().__init__(level, 70, 74, 67, 78, 134, 132)
        self.species = "Spellthief"


class SceptreDemon(ArcaneDemon):
    def __init__(self, level):
        super().__init__(level, 100, 30, 110, 125, 150, 40)
        self.species = "Sceptre Demon"


# Decay demons

class Mort(DecayDemon):
    def __init__(self, level):
        super().__init__(level, 98, 88, 88, 97, 79, 103)
        self.species = "Mort"


class FleshTower(DecayDemon):
    def __init__(self, level):
        super().__init__(level, 240, 100, 30, 100, 60, 20)
        self.species = "Flesh Tower"


class NoxiousSpirit(DecayDemon):
    def __init__(self, level):
        super().__init__(level, 92, 97, 92, 115, 51, 107)
        self.species = "Noxious Spirit"


class SentientOoze(DecayDemon):
    def __init__(self, level):
        super().__init__(level, 130, 103, 103, 103, 75, 40)
        self.species = "Sentient Ooze"


class Plaguebearer(DecayDemon):
    def __init__(self, level):
        super().__init__(level, 169, 57, 92, 93, 76, 68)
        self.species = "Plaguebearer"


class Swarmsoul(DecayDemon):
    def __init__(self, level):
        super().__init__(level, 40, 180, 45, 57, 119, 112)
        self.species = "Swarmsoul"


# Ancient demons

class Satyr(AncientDemon):
    def __init__(self, level):
        super().__init__(level, 95, 120, 60, 80, 88, 112)
        self.species = "Satyr"


class RuneDemon(AncientDemon):
    def __init__(self, level):
        super().__init__(level, 103, 65, 156, 58, 88, 68)
        self.species = "Rune Demon"


class FadedWarrior(AncientDemon):
    def __init__(self, level):
        super().__init__(level, 143, 133, 129, 58, 39, 52)
        self.species = "Faded Warrior"


class Chupacabra(AncientDemon):
    def __init__(self, level):
        super().__init__(level, 66, 139, 134, 32, 50, 133)
        self.species = "Chupacabra"


class DrownedCourtier(AncientDemon):
    def __init__(self, level):
        super().__init__(level, 99, 134, 34, 126, 74, 92)
        self.species = "Drowned Courtier"


class TitanicVisage(AncientDemon):
    def __init__(self, level):
        super().__init__(level, 92, 78, 109, 68, 110, 99)
        self.species = "Titanic Visage"

