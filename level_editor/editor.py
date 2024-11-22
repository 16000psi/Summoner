# Example file showing a basic pygame "game loop"
import pygame
from cells import Cell

# pygame setup
pygame.init()
screen = pygame.display.set_mode((1280, 720))
clock = pygame.time.Clock()
running = True


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


initialise()


while running:
    # poll for events
    # pygame.QUIT event means the user clicked X to close your window
    for event in pygame.event.get():
        # if event.type == pygame.KEYDOWN and event.key:
        # print(event.key)
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.MOUSEBUTTONDOWN:
            mouse_pos_x, mouse_pos_y = pygame.mouse.get_pos()
            for cell in cells:
                cell.unselect()
            for cell in cells:
                if cell.check_click((mouse_pos_x + scroll_x, mouse_pos_y + scroll_y)):
                    cell.select()
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
