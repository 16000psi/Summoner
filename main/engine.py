from .scenerealiser import SceneRealiser
class Engine:

    scene_stack = []
    scene_stack_size = 0

    @staticmethod
    def realise_scene():
        SceneRealiser.process(Engine.scene_stack[len(Engine.scene_stack) - 1])

    @staticmethod
    def add_scene(scene):
        Engine.scene_stack.append(scene)
        Engine.scene_stack_size += 1

    @staticmethod
    def remove_scene():
        if Engine.scene_stack_size > 0:
            Engine.scene_stack.pop()
            Engine.scene_stack_size -= 1

    @staticmethod
    def main():

        while True:
            print(Engine.scene_stack)
            if Engine.scene_stack_size > 0:
                Engine.realise_scene()
            else: 
                break

