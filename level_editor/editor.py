# Example file showing a basic pygame "game loop"
import asyncio

import pygame

from database.db import initialise_tortoise
from database.models import MapCell

from .cells import Cell

initialise_tortoise()

# pygame setup
pygame.init()
pygame.font.init()
my_font = pygame.font.SysFont("Comic Sans MS", 30)
screen = pygame.display.set_mode((1280, 720))
clock = pygame.time.Clock()
running = True

# Fetch all MapCell records


async def get_map_cells():
    cells = await MapCell.all()
    return cells


CELL_MOUSEOVER = False
CELL_MOUSEOVER_DETAIL = None
CELL_SELECT_DETAIL = None
CELL_SELECTED = False
GRID_COLUMNS_ROWS = 100
scroll_x, scroll_y = 0, 0

board = pygame.Surface((10000, 10000))
cells = []


def initialise():
    map_cells = asyncio.run(get_map_cells())
    map_cells_dict = {f"{map_cell.x}_{map_cell.y}": map_cell for map_cell in map_cells}
    left_offset = 200
    top_offset = 300

    for row in range(GRID_COLUMNS_ROWS):
        for column in range(GRID_COLUMNS_ROWS):
            if f"{column}_{row}" in map_cells_dict:
                cells.append(
                    Cell(
                        board,
                        left_offset,
                        top_offset,
                        40,
                        40,
                        f"{column}, {row}",
                        map_cells_dict[f"{column}_{row}"],
                    )
                )
            else:
                cells.append(
                    Cell(board, left_offset, top_offset, 40, 40, f"{column}, {row}")
                )
            left_offset += 50
        top_offset += 50
        left_offset -= 50 * GRID_COLUMNS_ROWS


def render():
    for cell in cells:
        cell.draw()

    screen.blit(board, (0, 0), (scroll_x, scroll_y, 1280, 720))

    if CELL_SELECTED:
        pygame.draw.rect(screen, "green", pygame.Rect(950, 30, 300, 650))
        cell_title = my_font.render(CELL_SELECT_DETAIL, False, "Green", "Blue")
        screen.blit(cell_title, (970, 50))

    if CELL_MOUSEOVER:
        # pygame.draw.rect(screen, "green", pygame.Rect(30, 630, 50, 50))

        coordinate_text = my_font.render(CELL_MOUSEOVER_DETAIL, False, "Green", "Blue")
        screen.blit(coordinate_text, (30, 630))


initialise()


while running:
    # poll for events
    # pygame.QUIT event means the user clicked X to close your window
    # Get mouse position
    mouse_pos_x, mouse_pos_y = pygame.mouse.get_pos()
    displaced_mouse_position = (mouse_pos_x + scroll_x, mouse_pos_y + scroll_y)
    for cell in cells:
        cell.unset_mouseover()
        CELL_MOUSEOVER = False
        if cell.check_mouseover(displaced_mouse_position):
            CELL_MOUSEOVER_DETAIL = cell.get_name()
            cell.set_mouseover()
            CELL_MOUSEOVER = True
            break

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.MOUSEBUTTONDOWN:
            for cell in cells:
                cell.unselect()
                CELL_SELECTED = False
            for cell in cells:
                if cell.check_mouseover(displaced_mouse_position):
                    cell.select()
                    CELL_SELECTED = True
                    CELL_SELECT_DETAIL = cell.get_name()
                    break

    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT]:
        scroll_x -= 5  # Move left
    if keys[pygame.K_RIGHT]:
        scroll_x += 5  # Move right
    if keys[pygame.K_UP]:
        scroll_y -= 5  # Move up
    if keys[pygame.K_DOWN]:
        scroll_y += 5  # Move down

    # Prevent scrolling beyond the surface edges
    # scroll_x = max(0, min(scroll_x, board.get_width() - screen.get_width()))
    # scroll_y = max(0, min(scroll_y, board.get_height() - screen.get_height()))

    # fill the screen with a color to wipe away anything from last frame
    screen.fill("black")

    # RENDER YOUR GAME HERE

    render()

    # flip() the display to put your work on screen
    pygame.display.flip()

    clock.tick(60)  # limits FPS to 60

pygame.quit()
