class Decision:
    def __init__(self, name, choice_description, preferred_key, action, *args):
        self.name = name
        self.choice_description = choice_description
        self.preferred_key = preferred_key
        self.action = action
        self.args = args

    def choose(self):
        print(self.action)
        print(self.args)
        self.action(*self.args) 
