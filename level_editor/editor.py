import asyncio

import pygame

from database.db import initialise_tortoise
from database.models import MapCell

from .buttons import Button
from .grid import Grid
from .menus import generate_file_menu

pygame.init()
pygame.font.init()
my_font = pygame.font.SysFont("Comic Sans MS", 30)
screen = pygame.display.set_mode((1280, 720))
clock = pygame.time.Clock()
running = True


scroll_x, scroll_y = 0, 0

board = pygame.Surface((10000, 10000))

grid = None


DB_URL = "sqlite://maps/db.sqlite3"


def initialise(db_url=DB_URL):
    global grid
    if grid:
        grid.clear_cells()
    initialise_tortoise(db_url)
    map_cells_dict = asyncio.run(MapCell.get_map_cells_dict())
    grid = Grid(
        surface=board,
        side_size=100,
        left_offset=200,
        top_offset=300,
        map_cells_dict=map_cells_dict,
    )

    grid.create_grid()


file_menu = generate_file_menu(initialise)

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


def render():
    for cell in grid.get_cells():
        cell.draw()

    screen.blit(board, (0, 0), (scroll_x, scroll_y, 1280, 720))

    if grid.is_cell_selected():
        pygame.draw.rect(screen, "green", pygame.Rect(950, 30, 300, 650))
        cell_title = my_font.render(
            grid.get_cell_selected_detail(), False, "Green", "Blue"
        )
        screen.blit(cell_title, (970, 50))

    if grid.is_cell_mouseover():
        coordinate_text = my_font.render(
            grid.get_mouseover_detail(), False, "Green", "Blue"
        )
        screen.blit(coordinate_text, (30, 630))

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
        file_menu.mainloop(screen)

    screen.fill("black")
    render()
    pygame.display.flip()
    clock.tick(60)

pygame.quit()
