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
