import pygame_menu

from database.utils import create_new_sqlite3_file_in_maps, list_sqlite3_files_in_maps


class FileMenu:
    def __init__(self, surface, initiation_callback):
        self.surface = surface
        self.available_files = None
        self.set_available_files()
        self.initiation_callback = initiation_callback
        self.file_menu = pygame_menu.Menu(
            "File / Map operations menu",
            1280,
            720,
            theme=pygame_menu.themes.THEME_DARK,
            onclose=pygame_menu.events.BACK,
        )
        self.file_name_label = self.file_menu.add.label(title="New file name:")
        self.file_name_input = self.file_menu.add.text_input(
            title="", textinput_id="file_name_input", default=""
        )

        self.new_map_button = self.file_menu.add.button(
            "Create new map", self.handle_file_creation
        )

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

    def handle_load(self):
        self.initiation_callback(self.load_target)
        self.load_menu.disable()
        self.disable()

    def open_load_menu(self):
        self.load_menu.enable()
        self.load_menu.mainloop(self.surface)

    def set_available_files(self):
        files = list_sqlite3_files_in_maps()
        items = [(file, f"sqlite://maps/{file}.sqlite3") for file in files]
        self.available_files = items

    def get_available_files(self):
        return self.available_files

    def handle_file_creation(self):
        file_name = self.file_menu.get_widget("file_name_input").get_value()
        create_new_sqlite3_file_in_maps(file_name)
        self.set_available_files()
        self.file_dropdown.update_items(self.get_available_files())
        self.file_menu.render()
        self.disable()

    def on_file_selected(self, selected_item, value, **kwargs):
        self.load_target = value

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
