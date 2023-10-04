from main.display import Display

class TestUtilities:
    @staticmethod
    def set_display_dimensions(printable_lines, line_length):
        Display.printable_lines = printable_lines
        Display.line_length = line_length