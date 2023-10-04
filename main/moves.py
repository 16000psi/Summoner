class Move:
    def __init__(self, name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects):

        self.name = name
        
        self.target_base_power = target_base_power
        self.user_base_power = user_base_power

        self.target_attack_mod = target_attack_mod
        self.target_defence_mod = target_defence_mod
        self.target_special_attack_mod = target_special_attack_mod
        self.target_special_defence_mod = target_special_defence_mod
        self.target_speed_mod = target_speed_mod

        self.user_attack_mod = user_attack_mod
        self.user_defence_mod = user_defence_mod
        self.user_special_attack_mod = user_special_attack_mod
        self.user_special_defence_mode = user_special_defence_mod
        self.user_speed_mod = user_speed_mod

        self.accuracy = accuracy

        self.target_status_effects = target_status_effects
        self.user_status_effects = user_status_effects



class DestructionMove(Move):
    def __init__(self, name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects):
        super().__init__(name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects)

        self.type = "Destruction"

class VoidMove(Move):
    def __init__(self, name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects):
        super().__init__(name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects)

        self.type = "Void"

class ArcaneMove(Move):
    def __init__(self, name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects):
        super().__init__(name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects)

        self.type = "Arcane"

class DecayMove(Move):
    def __init__(self, name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects):
        super().__init__(name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects)

        self.type = "Decay"

class AncientMove(Move):
    def __init__(self, name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects):
        super().__init__(name, target_base_power, user_base_power, target_attack_mod, target_defence_mod, target_special_attack_mod, target_special_defence_mod, target_speed_mod, user_attack_mod, user_defence_mod, user_special_attack_mod, user_special_defence_mod, user_speed_mod, accuracy, target_status_effects, user_status_effects)

        self.type = "Ancient"


