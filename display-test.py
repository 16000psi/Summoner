
from main.data.border import border


class Display:
    border = border

    @staticmethod
    def cut_line_into_background_border(line, background_line):
        return background_line[:10] + line + background_line[70:]

    @staticmethod
    def area():

        print(border)

        dummy_line = "123456789012345678901234567890123456789012345678901234567890"

        cut_border = [Display.cut_line_into_background_border(
            dummy_line, x) for x in border]

        print(cut_border)


Display.area()
