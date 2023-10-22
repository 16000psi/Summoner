class SceneRealiser:
    @staticmethod
    def process(scene):

        print(scene)

        print(scene.for_display_list)
        
        for i, decision in enumerate(scene.decisions_list):
            print(f"press {i} to {decision.choice_description}")

        choice = input("Select something \n")

        try:
            choice = int(choice)
        except:
            return

        if choice < 0 or choice > len(scene.decisions_list)-1:
            return 

        else:
            scene.decisions_list[choice].choose()
