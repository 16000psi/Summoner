import pygame_menu


def generate_file_menu(callback):
    """
    Generate a Pygame menu for selecting a database file.

    Args:
        callback (Callable[[str], None]): A function to be called
        when a file is selected. This function should change the
        sqlite file that the database is reading from and reset
        the map accordingly.

    Returns:
        pygame_menu.Menu: A Pygame menu instance configured for file selection.
    """

    if not callable(callback):
        raise ValueError("The callback must be a callable function.")
    file_menu = pygame_menu.Menu(
        "Welcome",
        400,
        300,
        theme=pygame_menu.themes.THEME_BLUE,
        onclose=pygame_menu.events.BACK,
    )

    def on_file_selected(selected_item, value, **kwargs):
        callback(value)

    file_menu.add.text_input("Name :", default="John Doe")
    items = [
        ("a", "sqlite://maps/db.sqlite3"),
        ("b", "sqlite://maps/db_2.sqlite3"),
        ("c", "sqlite://maps/db_3.sqlite3"),
    ]
    file_menu.add.dropselect("File", items=items, onchange=on_file_selected)
    file_menu.disable()

    return file_menu
