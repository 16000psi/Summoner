import pygame_menu

from database.utils import (
    copy_buffer_file_to_new_file_in_maps,
    copy_file_to_buffer_file,
    initialise_buffer_file,
    list_sqlite3_files_in_maps,
)


class FileMenu:
    def __init__(self, surface, initialisation_callback):
        self.surface = surface
        self.available_files = None
        self.set_available_files()
        self.initialisation_callback = initialisation_callback
        self.file_menu = pygame_menu.Menu(
            "File / Map operations menu",
            1280,
            720,
            theme=pygame_menu.themes.THEME_DARK,
            onclose=pygame_menu.events.BACK,
        )

        self.new_map_button = self.file_menu.add.button("NEW", self.handle_new_map)

        self.save_menu_button = self.file_menu.add.button("SAVE", self.open_save_menu)
        self.save_menu = pygame_menu.Menu(
            "File / Map operations menu",
            1280,
            720,
            theme=pygame_menu.themes.THEME_DARK,
            onclose=pygame_menu.events.BACK,
        )
        self.file_name_label = self.save_menu.add.label(title="Save as file name:")
        self.file_name_input = self.save_menu.add.text_input(
            title="", textinput_id="file_name_input", default=""
        )
        self.save_button = self.save_menu.add.button("Save...", self.handle_save)

        self.save_menu.disable()

        self.load_menu_button = self.file_menu.add.button("LOAD", self.open_load_menu)
        self.load_menu = pygame_menu.Menu(
            "File / Map operations menu",
            1280,
            720,
            theme=pygame_menu.themes.THEME_DARK,
            onclose=pygame_menu.events.BACK,
        )
        self.file_dropdown = self.load_menu.add.dropselect(
            "File",
            dropselect_id="file_list",
            items=self.get_available_files(),
            onchange=self.on_file_selected,
        )
        self.load_button = self.load_menu.add.button("Load Map...", self.handle_load)
        self.load_target = None
        self.load_menu.disable()

        self.disable()

    def handle_new_map(self):
        initialise_buffer_file()
        self.initialisation_callback()
        self.disable()

    def handle_load(self):
        copy_file_to_buffer_file(self.load_target)
        self.initialisation_callback()
        self.load_menu.disable()
        self.disable()

    def handle_save(self):
        file_name = self.file_name_input.get_value()
        copy_buffer_file_to_new_file_in_maps(file_name)
        self.set_available_files()
        self.file_dropdown.update_items(self.get_available_files())
        self.save_menu.disable()
        self.disable()

    def open_load_menu(self):
        self.load_menu.enable()
        self.load_menu.mainloop(self.surface)

    def open_save_menu(self):
        self.save_menu.enable()
        self.save_menu.mainloop(self.surface)

    def set_available_files(self):
        files = list_sqlite3_files_in_maps()
        items = [(file, f"sqlite://maps/{file}.sqlite3") for file in files]
        self.available_files = items

    def get_available_files(self):
        return self.available_files

    def on_file_selected(self, selected_item, value, **kwargs):
        self.load_target = selected_item[0][0]

    def enable(self):
        return self.file_menu.enable()

    def disable(self):
        return self.file_menu.disable()

    def is_enabled(self):
        return self.file_menu.is_enabled()

    def mainloop(self):
        return self.file_menu.mainloop(self.surface)

    def generate(self):
        return self.file_menu


class CellMenu:
    def __init__(self, surface):
        self.surface = surface
        self.cell = None
        self.menu = pygame_menu.Menu(
            "Cell Menu",
            120,
            120,
            theme=pygame_menu.themes.THEME_DARK,
            onclose=pygame_menu.events.BACK,
        )
        self.menu.disable()

    def set_cell(self, cell):
        self.cell = cell

    def enable(self):
        return self.menu.enable()

    def disable(self):
        return self.menu.disable()

    def is_enabled(self):
        return self.menu.is_enabled()

    def mainloop(self):
        return self.menu.mainloop(self.surface)

    def generate(self):
        return self.menu
