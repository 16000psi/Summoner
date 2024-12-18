import asyncio

import pygame

from database.db import initialise_tortoise
from database.models import MapCell
from database.utils import initialise_buffer_file

from .grid import Grid
from .menus import CellMenu, FileMenu
from .ui import Button, TextOverlay

pygame.init()
pygame.font.init()
my_font = pygame.font.SysFont("Comic Sans MS", 30)
screen = pygame.display.set_mode((1280, 720))
clock = pygame.time.Clock()
running = True


scroll_x, scroll_y = 0, 0

board = pygame.Surface((10000, 10000))

grid = None


DB_URL = "sqlite://maps/buffers/buffer.sqlite3"

cell_menu = CellMenu(screen)


def initialise():
    global grid
    if grid:
        grid.clear_cells()
    initialise_tortoise()
    map_cells_dict = asyncio.run(MapCell.get_map_cells_dict())
    grid = Grid(
        surface=board,
        side_size=100,
        left_offset=200,
        top_offset=300,
        map_cells_dict=map_cells_dict,
        cell_menu=cell_menu,
    )

    grid.create_grid()


file_menu = FileMenu(screen, initialise)


menu_button = Button(
    surface=screen,
    x=30,
    y=30,
    width=100,
    height=50,
    font=my_font,
    text="menu",
    text_color="black",
    button_color="blue",
    highlight_color="red",
    onclick=file_menu.enable,
)

selected_cell_overlay = TextOverlay(
    surface=screen,
    x=950,
    y=30,
    width=300,
    height=720,
    font=my_font,
    text_color="green",
    background_color="blue",
)

coordinate_text_overlay = TextOverlay(
    surface=screen,
    x=30,
    y=630,
    width=0,
    height=0,
    font=my_font,
    text_color="green",
    background_color="blue",
)


def render():
    for cell in grid.get_cells():
        cell.draw()

    screen.blit(board, (0, 0), (scroll_x, scroll_y, 1280, 720))

    # if grid.is_cell_selected():
    #     selected_cell_overlay.draw_with_text(grid.get_cell_selected_detail())

    if grid.is_cell_mouseover():
        coordinate_text_overlay.draw_with_text(grid.get_mouseover_detail())

    menu_button.render_button()


initialise()


while running:
    mouse_pos_x, mouse_pos_y = pygame.mouse.get_pos()
    displaced_mouse_position = (mouse_pos_x + scroll_x, mouse_pos_y + scroll_y)
    grid.handle_mouseover(displaced_mouse_position)

    menu_button.mouseover_check((mouse_pos_x, mouse_pos_y))

    events = pygame.event.get()
    for event in events:
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.MOUSEBUTTONDOWN and menu_button.is_mouseover():
            menu_button.check_click()

        elif event.type == pygame.MOUSEBUTTONDOWN and not menu_button.is_mouseover():
            grid.handle_possible_cell_click(displaced_mouse_position)

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        scroll_x -= 5
    if keys[pygame.K_RIGHT]:
        scroll_x += 5
    if keys[pygame.K_UP]:
        scroll_y -= 5
    if keys[pygame.K_DOWN]:
        scroll_y += 5

    if file_menu.is_enabled():
        file_menu.mainloop()

    if cell_menu.is_enabled():
        cell_menu.mainloop()

    screen.fill("black")
    render()
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
