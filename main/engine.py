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

    @classmethod
    def realise_scene(cls):
        """
        Calls SceneRealiser to process the top scene in the stack. Part
        of the game loop (main())
        """
        SceneRealiser.realise(cls.scene_stack[len(cls.scene_stack) - 1])

    @classmethod
    def add_scene(cls, scene):
        """
        Called as part of Decisions - add a scene to the top of the stack
        to be rendered on the next loop.
        """
        cls.scene_stack.append(scene)
        cls.scene_stack_size += 1

    @classmethod
    def remove_scene(cls):
        """
        Called as part of Decisions - removes a scene from the stack.
        """
        if cls.scene_stack_size > 0:
            cls.scene_stack.pop()
            cls.scene_stack_size -= 1

    # TEST METHOD
    @classmethod
    def print_scene_info(cls):
        """
        Used for debugging, prints infromation about the scenes in the stack.
        """
        for i, scene in enumerate(cls.scene_stack):
            print(f"Scene {i}: {scene.for_display_list}")

    @classmethod
    def main(cls):
        """
        The main game loop - calling this starts the game rendering the top
        scene in the stack.
        """
        print("something")

        while True:
            if cls.scene_stack_size > 0:
                cls.realise_scene()
            else:
                break
