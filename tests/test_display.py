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

class TestFormatText(unittest.TestCase):
    def test_non_string_input(self):
        """ Test that non-string inputs return a type error and only strings are accepted"""

        with self.assertRaises(TypeError):
            Display.format_text(123)
        with self.assertRaises(TypeError):
            Display.format_text(['failed'])
        try:
            Display.format_text("hello") 
        except TypeError:
            self.fail("Display.format_text() raised TypeError unexpectedly with a string input")

    def test_removes_line_breaks(self):
        """ Tests that line breaks are replaced with the correct ammount of spaces """

        TestUtilities.set_display_dimensions(10,10)
        lb = Display.line_break_sequence
        input_string = "12345" + lb + "6789"
        desired = "12345     6789"
        self.assertEqual(Display.format_text(input_string), desired)
        input_string = "123456789012345" + lb + "6789"
        desired = "123456789012345     6789"
        self.assertEqual(Display.format_text(input_string), desired)

    def test_removes_line_breaks(self):
        """ Tests that double line breaks are replaced with the correct ammount of spaces """

        TestUtilities.set_display_dimensions(10,10)
        db = Display.double_line_break_sequence
        input_string = "12345" + db + "6789"
        desired = "12345               6789"
        self.assertEqual(Display.format_text(input_string), desired)
        input_string = "123456789012345" + db + "6789"
        desired = "123456789012345               6789"
        self.assertEqual(Display.format_text(input_string), desired)

    def test_removes_page_breaks(self):
        """ Tests that page breaks are replaced with the correct ammount of spaces """

        TestUtilities.set_display_dimensions(2,10)
        pb = Display.page_break_sequence
        input_string = "12345" + pb + "6789"
        desired = "12345               6789"
        self.assertEqual(Display.format_text(input_string), desired)
        input_string = "123456789012345" + pb + "6789"
        desired = "123456789012345     6789"
        self.assertEqual(Display.format_text(input_string), desired)

    def test_prevents_overflow(self):
        """ Tests that words that would otherwise overflow lines have enough spaces inserted infront of them that they start on the next line """
        TestUtilities.set_display_dimensions(10,10)
        input_string = "1234567 90123"
        desired = "1234567   90123"
        self.assertEqual(Display.format_text(input_string), desired)

    def test_combined_functionality(self):
        """ Tests that the function works with a combination of line breaks, double line breaks, page breaks and overflowing words """
        TestUtilities.set_display_dimensions(2,5)
        lb = Display.line_break_sequence
        db = Display.double_line_break_sequence
        pb = Display.page_break_sequence
        input_string = "123" + lb + "45 678" + db + "1" + pb + "woop"
        desired = "123  45   678       1         woop"
        self.assertEqual(Display.format_text(input_string), desired)

class TestTextToLines(unittest.TestCase):
    def test_non_string_input(self):
        """ Test that non-string inputs return a type error and only strings are accepted"""

        with self.assertRaises(TypeError):
            Display.text_to_lines(123)
        with self.assertRaises(TypeError):
            Display.text_to_lines(['failed'])
        try:
            Display.text_to_lines("hello") 
        except TypeError:
            self.fail("Display.text_to_lines() raised TypeError unexpectedly with a string input")

    def test_complete_functionality(self):
        """ Tests that the method takes a string, and returns the correctly formatted list """

        TestUtilities.set_display_dimensions(10,10)
        input_string = '12345678901234567890'
        desired = ['1234567890', '1234567890']
        self.assertEqual(Display.text_to_lines(input_string), desired)

class TestCentreJustifyLines(unittest.TestCase):
    def test_input_only_list_of_strings(self):
        """ Test that the only allowed input is a list, and that any items in the list must be strings """

        with self.assertRaises(TypeError):
            Display.centre_justify_lines(123)
        with self.assertRaises(TypeError):
            Display.centre_justify_lines([123, 456, 789])
        with self.assertRaises(TypeError):
            Display.centre_justify_lines("hello")
        try:
            Display.centre_justify_lines(["hello", "world"]) 
        except TypeError:
            self.fail("Display.centre_justify_lines() raised TypeError unexpectedly with a string input")

    def test_complete_lines_unadjusted(self):
        """ Tests that lines aleady at len(line_length) are not modified """

        TestUtilities.set_display_dimensions(10,10)
        input_list = ['1234567890', '1234567890']
        desired = ['1234567890', '1234567890']
        self.assertEqual(Display.centre_justify_lines(input_list), desired)

    def test_incomplete_lines_adjusted(self):
        """ Tests that lines below len(line_length) are have spaces added to either side """

        TestUtilities.set_display_dimensions(10,10)
        input_list = ['123456789', '1']
        desired = ['123456789 ', '    1     ']
        self.assertEqual(Display.centre_justify_lines(input_list), desired)

        