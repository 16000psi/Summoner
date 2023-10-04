class Summoner:
    def __init__(self, name, demon_inventory):
        self.name = name
        self.demon_inventory = demon_inventory

    def check_if_all_demons_dead(self):

        for demon in self.demon_inventory:

            if demon.check_if_alive:
                return False
            
        return True
    
