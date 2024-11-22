import pygame


class Cell:
    def __init__(self, surface, left, top, width, height):
        self.surface = surface
        self.left = left
        self.top = top
        self.width = width
        self.height = height
        self.rect = pygame.Rect(left, top, width, height)
        self.selected_cell = False
        self.mouseover = False

    def draw(self):
        if self.selected_cell:
            pygame.draw.rect(self.surface, "blue", self.rect)
        else:
            pygame.draw.rect(self.surface, "yellow", self.rect)

    def check_mouseover(self, mouse_position):
        return self.rect.collidepoint(mouse_position)

    def unselect(self):
        self.selected_cell = False

    def select(self):
        self.selected_cell = True

    def unset_mouseover(self):
        self.mouseover = False
        
    def set_mouseover(self):
        self.mouseover = True
