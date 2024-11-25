import pygame


class Cell:
    def __init__(self, surface, left, top, width, height, name, content=None):
        self.surface = surface
        self.left = left
        self.top = top
        self.width = width
        self.height = height
        self.rect = pygame.Rect(left, top, width, height)
        self.selected_cell = False
        self.mouseover = False
        self.name = name
        self.content = content

    def draw(self):
        colour = self.get_colour()
        pygame.draw.rect(self.surface, colour, self.rect)

    def check_mouseover(self, mouse_position):
        return self.rect.collidepoint(mouse_position)

    def unselect(self):
        self.selected_cell = False

    def select(self):
        self.selected_cell = True

    def set_mouseover(self, boolean):
        self.mouseover = boolean

    def get_name(self):
        return self.name

    def get_colour(self):
        if self.content and self.selected_cell:
            return "red"
        elif self.content and self.mouseover:
            return "yellow"
        elif self.content:
            return "lightcoral"
        elif self.selected_cell:
            return "white"
        elif self.mouseover:
            return "gray50"
        else:
            return "gray14"
