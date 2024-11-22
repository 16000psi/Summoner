# Example file showing a basic pygame "game loop"
import pygame
from cells import Cell

# pygame setup
pygame.init()
screen = pygame.display.set_mode((1280, 720))
clock = pygame.time.Clock()
running = True


CELL_SELECTED = False
GRID_COLUMNS_ROWS = 3
scroll_x, scroll_y = 0, 0

board = pygame.Surface((1280, 720))
cells = []


def initialise():
    left_offset = 200
    top_offset = 300

    for row in range(GRID_COLUMNS_ROWS):
        for column in range(GRID_COLUMNS_ROWS):
            cells.append(Cell(board, left_offset, top_offset, 40, 40))
            left_offset += 50
        top_offset += 50
        left_offset -= 150


def render():
    for cell in cells:
        cell.draw()

    screen.blit(board, (0, 0), (scroll_x, scroll_y, 1280, 720))

    if CELL_SELECTED:
        pygame.draw.rect(screen, "green", pygame.Rect(50, 50, 50, 50))

    if CELL_MOUSEOVER:
        pygame.draw.rect(screen, "green", pygame.Rect(200, 50, 50, 50))



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
