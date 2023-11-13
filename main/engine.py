from .scenerealiser import SceneRealiser


class Engine:
    """
    Here lies the game loop. The fundamental data structure of the game
    is Scenes stored on a stack. The last scene in the stack is called
    in a loop, whilst the scenes themselves operate in the stack depending
    on which Decision object is called. See Scene and Decision.
    """
    scene_stack = []
    scene_stack_size = 0

    @staticmethod
    def realise_scene():
        """
        Calls SceneRealiser to process the top scene in the stack. Part
        of the game loop (main())
        """
        SceneRealiser.realise(Engine.scene_stack[len(Engine.scene_stack) - 1])

    @staticmethod
    def add_scene(scene):
        """
        Called as part of Decisions - add a scene to the top of the stack
        to be rendered on the next loop.
        """
        Engine.scene_stack.append(scene)
        Engine.scene_stack_size += 1

    @staticmethod
    def remove_scene():
        """
        Called as part of Decisions - removes a scene from the stack.
        """
        if Engine.scene_stack_size > 0:
            Engine.scene_stack.pop()
            Engine.scene_stack_size -= 1

    # TEST METHOD
    @staticmethod
    def print_scene_info():
        """
        Used for debugging, prints infromation about the scenes in the stack.
        """
        for i, scene in enumerate(Engine.scene_stack):
            print(f"Scene {i}: {scene.for_display_list}")

    @staticmethod
    def main():
        """
        The main game loop - calling this starts the game rendering the top
        scene in the stack.
        """
        print("something")

        while True:
            if Engine.scene_stack_size > 0:
                Engine.print_scene_info()
                Engine.realise_scene()
            else:
                break
