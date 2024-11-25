import pygame


class TextOverlay:
    def __init__(
        self,
        surface,
        x,
        y,
        width,
        height,
        font,
        text_color,
        background_color,
        text=None,
    ):
        self.surface = surface
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.font = font
        self.text = text
        self.text_color = text_color
        self.background_color = background_color
        pass

    def set_text(self, string):
        self.text = string

    def get_text(self):
        return self.text

    def draw_overlay(self):
        pygame.draw.rect(
            self.surface, "green", pygame.Rect(self.x, self.y, self.width, self.height)
        )
        text = self.font.render(
            self.get_text(), False, self.text_color, self.background_color
        )
        self.surface.blit(text, (self.x, self.y))

    def draw_with_text(self, string):
        self.set_text(string)
        self.draw_overlay()


class Button:
    def __init__(
        self,
        surface,
        x,
        y,
        width,
        height,
        font,
        text,
        text_color,
        button_color,
        highlight_color,
        onclick,
        *args,
        **kwargs
    ):
        self.surface = surface
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.font = font
        self.text = text
        self.text_color = text_color
        self.button_color = button_color
        self.highlight_color = highlight_color
        self.on_click = onclick
        self.bounding_box = self.get_bounding_box()
        self.mouseover = False
        self.args = args
        self.kwargs = kwargs

    def get_bounding_box(self):
        return pygame.Rect(self.x, self.y, self.width, self.height)

    def render_button(self):
        text = self.font.render(self.text, False, self.text_color)
        text_rect = text.get_rect(
            center=(self.x + self.width // 2, self.y + self.height // 2)
        )

        pygame.draw.rect(
            self.surface, self.get_color(), (self.x, self.y, self.width, self.height)
        )
        self.surface.blit(text, text_rect)

    def set_mouseover(self, boolean):
        self.mouseover = boolean

    def get_color(self):
        if self.mouseover:
            return self.highlight_color
        else:
            return self.button_color

    def is_mouseover(self):
        return self.mouseover

    def mouseover_check(self, mouse_position):
        if self.bounding_box.collidepoint(mouse_position):
            self.set_mouseover(True)
        else:
            self.set_mouseover(False)

    def handle_click(self):
        self.on_click(*self.args, **self.kwargs)

    def check_click(self):
        if self.is_mouseover():
            self.handle_click()
