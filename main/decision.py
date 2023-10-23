class Decision:
    def __init__(self, name, choice_description, preferred_key, action, *args):
        self.name = name
        self.choice_description = choice_description
        self.preferred_key = preferred_key
        self.action = action
        self.args = args

    def choose(self):
        self.action(*self.args) 
        print(self.args)
