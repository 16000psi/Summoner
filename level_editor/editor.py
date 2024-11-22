# Example file showing a basic pygame "game loop"
import pygame
from cells import Cell

# pygame setup
pygame.init()
screen = pygame.display.set_mode((1280, 720))
clock = pygame.time.Clock()
running = True


GRID_COLUMNS_ROWS = 3


cells = []


def initialise():
    pygame.draw.circle(
        screen,
        "red",
        pygame.Vector2(screen.get_width() / 2, screen.get_height() / 2),
        40,
    )

    left_offset = 200
    top_offset = 300

    for row in range(GRID_COLUMNS_ROWS):
        for column in range(GRID_COLUMNS_ROWS):
            cells.append(Cell(screen, left_offset, top_offset, 40, 40))
            left_offset += 50
        top_offset += 50
        left_offset -= 150


def render():
    for cell in cells:
        cell.draw()

initialise()
while running:
    # poll for events
    # pygame.QUIT event means the user clicked X to close your window
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.MOUSEBUTTONDOWN:
            mouse_pos = pygame.mouse.get_pos()
            for cell in cells:
                cell.unselect()
            for cell in cells:
                if cell.check_click(mouse_pos):
                    cell.select()
                    break


    # fill the screen with a color to wipe away anything from last frame
    screen.fill("black")

    # RENDER YOUR GAME HERE

    render()

    # flip() the display to put your work on screen
    pygame.display.flip()

    clock.tick(60)  # limits FPS to 60

pygame.quit()
