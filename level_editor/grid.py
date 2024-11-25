from .cells import Cell


class Grid:
    def __init__(
        self, surface, side_size, left_offset, top_offset, map_cells_dict=None
    ):
        self.surface = surface
        self.side_size = side_size
        self.map_cells_dict = map_cells_dict
        self.left_offset = left_offset
        self.top_offset = top_offset
        self.cells = []
        self.cell_mouseover = False
        self.cell_mouseover_detail = None
        self.cell_selected = False
        self.cell_select_detail = None

    def create_grid(self):
        for row in range(self.side_size):
            for column in range(self.side_size):
                if f"{column}_{row}" in self.map_cells_dict:
                    self.cells.append(
                        Cell(
                            self.surface,
                            self.left_offset,
                            self.top_offset,
                            40,
                            40,
                            f"{column}, {row}",
                            self.map_cells_dict[f"{column}_{row}"],
                        )
                    )
                else:
                    self.cells.append(
                        Cell(
                            self.surface,
                            self.left_offset,
                            self.top_offset,
                            40,
                            40,
                            f"{column}, {row}",
                        )
                    )
                self.left_offset += 50
            self.top_offset += 50
            self.left_offset -= 50 * self.side_size

    def get_cells(self):
        return self.cells

    def clear_cells(self):
        self.cells.clear()

    def set_cell_mouseover(self, boolean):
        self.cell_mouseover = boolean

    def is_cell_mouseover(self):
        return self.cell_mouseover

    def handle_mouseover(self, mouse_position):
        for cell in self.get_cells():
            cell.set_mouseover(False)
            self.set_cell_mouseover(False)
            if cell.check_mouseover(mouse_position):
                self.set_mouseover_detail(cell.get_name())
                cell.set_mouseover(True)
                self.set_cell_mouseover(True)
                break

    def set_mouseover_detail(self, string):
        self.cell_mouseover_detail = string

    def get_mouseover_detail(self):
        return self.cell_mouseover_detail

    def set_cell_selected(self, boolean):
        self.cell_selected = boolean

    def is_cell_selected(self):
        return self.cell_selected

    def set_cell_selected_detail(self, string):
        self.cell_selected_detail = string

    def get_cell_selected_detail(self):
        return self.cell_selected_detail

    def handle_possible_cell_click(self, mouse_position):
        for cell in self.get_cells():
            cell.unselect()
            self.set_cell_selected(False)
        for cell in self.get_cells():
            if cell.check_mouseover(mouse_position):
                cell.select()
                self.set_cell_selected(True)
                self.set_cell_selected_detail(cell.get_name())
                break
