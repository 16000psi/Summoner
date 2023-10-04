import unittest
from tests.utilities import TestUtilities
from main.display import Display

class TestDisplay(unittest.TestCase):
    def test_utility_set_display_dimensions_alteration(self):
        """ Tests that the test utility method set_display_dimensions correctly changes the line length and printable lines in the display object.  This method is necessary in order to make it easier to test the functions of the display object."""
        
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