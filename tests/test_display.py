import unittest
from tests.utilities import TestUtilities
from main.display import Display

class TestTestingUtilities(unittest.TestCase):
    def test_utility_set_display_dimensions_alteration(self):
        """ Tests that the test utility method set_display_dimensions correctly changes the line length and printable lines in the display object. This method is necessary in order to make it easier to test the functions of the display object."""

        TestUtilities.set_display_dimensions(1,1)
        new_printable_lines = Display.printable_lines
        new_line_length = Display.line_length
        self.assertEqual(new_printable_lines, 1)
        self.assertEqual(new_line_length, 1)
        TestUtilities.set_display_dimensions(100,100)
        new_printable_lines = Display.printable_lines
        new_line_length = Display.line_length
        self.assertEqual(new_printable_lines, 100)
        self.assertEqual(new_line_length, 100)

class TestTextToLines(unittest.TestCase):
    def test_removes_line_breaks(self):
        """ Tests that line breaks are replaced with the correct ammount of spaces """

        TestUtilities.set_display_dimensions(10,10)
        lb = Display.line_break_sequence
        input = "12345" + lb + "6789"
        desired = "12345     6789"
        self.assertEqual(Display.format_text(input), desired)
        input = "123456789012345" + lb + "6789"
        desired = "123456789012345     6789"
        self.assertEqual(Display.format_text(input), desired)

    def test_removes_line_breaks(self):
        """ Tests that double line breaks are replaced with the correct ammount of spaces """

        TestUtilities.set_display_dimensions(10,10)
        db = Display.double_line_break_sequence
        input = "12345" + db + "6789"
        desired = "12345               6789"
        self.assertEqual(Display.format_text(input), desired)
        input = "123456789012345" + db + "6789"
        desired = "123456789012345               6789"
        self.assertEqual(Display.format_text(input), desired)

    def test_removes_page_breaks(self):
        """ Tests that page breaks are replaced with the correct ammount of spaces """

        TestUtilities.set_display_dimensions(2,10)
        pb = Display.page_break_sequence
        input = "12345" + pb + "6789"
        desired = "12345               6789"
        self.assertEqual(Display.format_text(input), desired)
        input = "123456789012345" + pb + "6789"
        desired = "123456789012345     6789"
        self.assertEqual(Display.format_text(input), desired)

    def test_prevents_overflow(self):
        """ Tests that words that would otherwise overflow lines have enough spaces inserted infront of them that they start on the next line """
        TestUtilities.set_display_dimensions(10,10)
        input = "1234567 90123"
        desired = "1234567   90123"
        self.assertEqual(Display.format_text(input), desired)

    def test_combined_functionality(self):
        """ Tests that the function works with a combination of line breaks, double line breaks, page breaks and overflowing words """
        TestUtilities.set_display_dimensions(2,5)
        lb = Display.line_break_sequence
        db = Display.double_line_break_sequence
        pb = Display.page_break_sequence
        input = "123" + lb + "45 678" + db + "1" + pb + "woop"
        desired = "123  45   678       1         woop"
        self.assertEqual(Display.format_text(input), desired)

