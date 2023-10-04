import re
import math

class Display:
    
    background_border = [
    "---------Replace these lines with border display. Length of each line is 80.----",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "--------------------------------------------------------------------------------",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "--------------------------------------------------------------------------------",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "--------------------------------------------------------------------------------",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "--------------------------------------------------------------------------------",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "--------------------------------------------------------------------------------",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "--------------------------------------------------------------------------------",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "--------------------------------------------------------------------------------",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "--------------------------------------------------------------------------------",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "--------------------------------------------------------------------------------",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "--------------------------------------------------------------------------------"
]
    empty_line = "~                           ~º~                            ~"
    line_length = 60 # must be even
    printable_lines = 16
    line_break_sequence = "/n"
    double_line_break_sequence = "/d"
    page_break_sequence = "/p"

    @staticmethod
    def format_text(text):
        """ This method takes an input texting and formats it, completing 3 tasks:

        - Deletes leading spaces from lines.
        - Replaces line_break_sequence, double_line_break_sequence and page_break sequence with line breaks, double breaks and page breaks respectively.
        - Makes sure there are no words overflowing lines, by adding spaces before words that would otherise overflow, *unless* the word is overflowing because a leading space was removed.

        IMPORTANT - The function returns just the text, it is not yet split up into lines or pages arrays.

        It works by iterating through the text.  Every time one of the above is detected, the string is modified and the loop resets reflecting the modified string length.  The iteration begins again from the point of the last modification. When the iteration gets to the end of the string without any changes, the loop exits.
        
        """
        if not isinstance(text, str):
            raise TypeError("Display.format_text(): input must be a string")
        
        def get_sequence_start_and_end_indexes(sequence):
            matches = re.finditer(sequence, text)
            indexes = {match.start(): match.end() for match in matches}
            return indexes
        
        # Create reference dictionaries for the index locations of all break sequences        
        line_break_positions = get_sequence_start_and_end_indexes(Display.line_break_sequence)
        double_break_positions = get_sequence_start_and_end_indexes(Display.double_line_break_sequence)
        page_break_positions = get_sequence_start_and_end_indexes(Display.page_break_sequence)

        # Any position where leading spaces were removed will be added here.  It is used to allow overflow for that index (as we know the line break seperates two words, so a space between is not necessary)
        ignore_overflow_indexes =[]

        target_index = 0
        final_index = len(text) - 1

        while target_index < final_index:

            for i in range(target_index, final_index + 1):

                # If end of line, check that leading character is not a space
                if (i + 1) % Display.line_length == 0 and i > 0 and i < final_index:

                    line_begin_character = text[i + 1] 

                    empty_line_pattern = r"\s{" + str(Display.line_length) + "}"

                    if line_begin_character == " " and not re.search(empty_line_pattern, text[i + 1 : i + Display.line_length + 1]):

                        text = text[:i + 1] + text[i + 2:]
                        ignore_overflow_indexes.append(i)

                        # Update index dictionaries to reflect subtracted space
                        line_break_positions = {int(key) - 1: value - 1 for key, value in line_break_positions.items()}
                        double_break_positions = {int(key) - 1: value - 1 for key, value in double_break_positions.items()}
                        page_break_positions = {int(key) - 1: value - 1 for key, value in page_break_positions.items()}

                        target_index = i
                        final_index = len(text) - 1

                        break


                # If line / double / page break index
                if i in line_break_positions or i in double_break_positions or i in page_break_positions:

                    spaces_added = 0
                    spaces_from_end_of_line = Display.line_length - (i % Display.line_length)

                    if i in line_break_positions:

                        text = text[:i] + f"{' ' * spaces_from_end_of_line}" + text[line_break_positions[i]:]

                        del line_break_positions[i]

                        spaces_added = spaces_from_end_of_line - len(Display.line_break_sequence)

                    elif i in double_break_positions:

                        text = text[:i] + f"{' ' * (spaces_from_end_of_line + Display.line_length)}" + text[double_break_positions[i]:]

                        del double_break_positions[i]

                        spaces_added = spaces_from_end_of_line + Display.line_length - len(Display.double_line_break_sequence)

                    elif i in page_break_positions:

                        line_number = (i // Display.line_length)
                        empty_lines_required = Display.printable_lines - (line_number % Display.printable_lines) - 1

                        text = text[:i] + f"{' ' * ((spaces_from_end_of_line + (Display.line_length * empty_lines_required)))}" + text[page_break_positions[i]:]

                    
                        del page_break_positions[i]

                        spaces_added = (spaces_from_end_of_line + (Display.line_length * empty_lines_required)) - len(Display.line_break_sequence) 


                    # Update index dictionaries to reflect added spaces
                    line_break_positions = {int(key) + spaces_added: value + spaces_added for key, value in line_break_positions.items()}
                    double_break_positions = {int(key) + spaces_added: value + spaces_added for key, value in double_break_positions.items()}
                    page_break_positions = {int(key) + spaces_added: value + spaces_added for key, value in page_break_positions.items()}

                    target_index = i
                    final_index = len(text) - 1


                    break

                # If end of line, check that word is not overflowing unless it has been set like that because of a leading space and index is ignored
                if i not in ignore_overflow_indexes and (i + 1) % Display.line_length == 0 and i > 0 and i < final_index:

                    line_ending_character = text[i]
                    line_begin_character = text[i + 1] 

                    if line_ending_character != " " and line_begin_character != " ":

                        spaces_to_add = 0

                        # Iterates to the last space. If there is not one for an entire line, stops looking and does nothing.
                        while spaces_to_add < Display.line_length:

                            if text[i - spaces_to_add] == " ":
                                break  

                            spaces_to_add += 1


                        if spaces_to_add < Display.line_length:

                            text = text[:i - spaces_to_add] + f"{' ' * spaces_to_add}" + text[i - spaces_to_add:]

                            spaces_added = spaces_to_add

                            # Update index dictionaries to reflect added spaces
                            line_break_positions = {int(key) + spaces_added: value + spaces_added for key, value in line_break_positions.items()}
                            double_break_positions = {int(key) + spaces_added: value + spaces_added for key, value in double_break_positions.items()}
                            page_break_positions = {int(key) + spaces_added: value + spaces_added for key, value in page_break_positions.items()}

                            target_index = i
                            final_index = len(text) - 1

                target_index = i

        return text

    @staticmethod
    def text_to_lines(text):
        """This method takes a string (you should use format_text first, unless you like mess) and returns a list of strings, each string representing a line."""

        if not isinstance(text, str):
            raise TypeError("Display.text_to_lines(): input must be a string")

        result = []
        total_lines = math.ceil(len(text) / Display.line_length)

        for i in range(total_lines):

            if i < total_lines - 1 :
                result.append(text[i * Display.line_length: (i + 1) * Display.line_length])
            else:
                result.append(text[i * Display.line_length:])

        return result
    
    @staticmethod
    def centre_justify_lines(text_lines_list):
        """ This method adds spaces to either side of lines which are below the length set in line_length incrementally.  This has the effect of centre justifying the lines."""

        if not isinstance(text_lines_list, list):
            raise TypeError("Display.centre_justify_lines(): Input must be a list")

        for item in text_lines_list:
            if not isinstance(item, str):
                raise TypeError("Display.centre_justify_lines(): All elements in the list must be strings")
        
        result = []

        for line in text_lines_list:
            line_stripped = line.rstrip()
            
            while len(line_stripped) < Display.line_length:
                if len(line_stripped) % 2 == 1:
                    line_stripped = line_stripped + " "
                else: line_stripped = " " + line_stripped
            result.append(line_stripped)
            
        return result
    
    @staticmethod
    def lines_to_pages(text_lines_list):
        """This method takes a list of lines and creates a nested list which each sublist representing a page, with ammount of lines set by printable_lines."""

        result = []
        total_pages = math.ceil(len(text_lines_list) / Display.printable_lines)
        for i in range(total_pages):

            if i < total_pages - 1:
                result.append(text_lines_list[i * Display.printable_lines : (i + 1) * Display.printable_lines])

            else:
                result.append(text_lines_list[i * Display.printable_lines:])

        while len(result[len(result) - 1]) < Display.printable_lines:

            result[len(result) - 1].append(f"{' ' * Display.line_length}")

        return result

    @staticmethod
    def set_page_in_border(page_of_lines):
        """This method takes the background_border and encorporates a given page into it,ready for printing. This method currently relies on line_length being 60 and printable_lines being 16, so if you need to change these you will also need to change this method (and the background_border)."""

        result = []
        for i,line in enumerate(Display.background_border):

            if i >= 3 and i <= 18:
                print(i)
                result.append(line[:10] + page_of_lines[i-3] + line[70:])
            else:
                result.append(line)

        return result

    @staticmethod
    def remove_empty_lines_in_text(text):

        """This method removes full lines of empty spaces from a string. It is intended for use at times where empty lines are meant to delimit different pieces of information, and having any more in would be confusing.  For example, it is used by format_multiple_texts_in_list_to_lines """
        
        temp_lines = [text[i:i+Display.line_length] for i in range(0, len(text), Display.line_length)]

        empty_line_pattern = r"\s{" + str(Display.line_length) + "}"
        temp_lines_without_empty = [line for line in temp_lines if not re.search(empty_line_pattern, line)]

        return "".join(temp_lines_without_empty)

    @staticmethod
    def format_multiple_texts_in_list_to_lines(text_list):
        """This method takes a list of text strings, formats them and then returns them as in the justified lines format.  Each text entry on the input will be seperated in the output by an empty line.  Any empty lines present in the input texts (and those generated by formatting, such as with a page_break_sequence) are removed during processing.
        
        This method is intended to be a versatile way to prepare multiple different messages for display at the same time."""
        
        formatted_items = [Display.format_text(entry) for entry in text_list]

        formatted_items_empty_lines_removed = [Display.remove_empty_lines_in_text(entry) for entry in formatted_items]

        formatted_items_trailing_whitespace_removed = [entry.rstrip() for entry in formatted_items_empty_lines_removed]

        items_to_lines = [Display.centre_justify_lines(Display.text_to_lines(text)) for text in formatted_items_trailing_whitespace_removed]

        items_with_seperating_newlines = []
        for i, item in enumerate(items_to_lines):
            items_with_seperating_newlines.append(item)
            if i < len(items_to_lines) - 1:
                items_with_seperating_newlines.append([f"{' ' * Display.line_length}"])

        flattened_lines_with_bumpers = [item for sublist in items_with_seperating_newlines for item in sublist]

        return flattened_lines_with_bumpers

    @staticmethod
    def hashmap_to_lines(dict):

        result = []

        for key, value in dict.items():
            value = str(value)
            dividing_string = ":  "
            truncate_dividing_string = "...:  "
            truncate_string = "..."

            # check if line will be longer than maximum
            if len(value) + len(key) + len(dividing_string) > Display.line_length:

                # if key and value are both over half a line's length
                if len(key) + len(dividing_string)> Display.line_length // 2 and len(value) > Display.line_length // 2:
                    key = key[:(Display.line_length // 2) - len(truncate_dividing_string)] + truncate_dividing_string
                    value = value[:(Display.line_length // 2) - len(truncate_string)] + truncate_string

                # if key is over half a line's length
                elif len(key) + len(dividing_string) > Display.line_length // 2:
                    key = key[:Display.line_length - len(truncate_dividing_string) - len(value)] + truncate_dividing_string
                    
                # if value is over half a lines length
                elif len(value) > Display.line_length // 2:
                    key = key + dividing_string
                    value = value[:Display.line_length - len(truncate_string) - len(key)] + truncate_string

            else:
                key = key + dividing_string

            while len(key) < Display.line_length - len(value):
                if len(key) % 2 == 0 and len(key) < Display.line_length - len(value) - 2:
                    key += "-"
                else:
                    key += " "

            result.append(key + value)

        return result
    
    @staticmethod
    def hashmap_to_half_lines(dict):

        result = []
        maximum_item_length = (Display.line_length - 4) // 2
        subline = []

        for i, (key, value) in enumerate(dict.items()):
            value = str(value)
            dividing_string = ":  "
            truncate_dividing_string = "...:  "
            truncate_string = "..."

            # check if line will be longer than maximum
            if len(value) + len(key) + len(dividing_string) > maximum_item_length:

                # if key and value are both over half a line's length
                if len(key) + len(dividing_string)> maximum_item_length // 2 and len(value) > maximum_item_length // 2:
                    key = key[:(maximum_item_length // 2) - len(truncate_dividing_string)] + truncate_dividing_string
                    value = value[:(maximum_item_length // 2) - len(truncate_string)] + truncate_string

                # if key is over half a line's length
                elif len(key) + len(dividing_string) > maximum_item_length // 2:
                    key = key[:maximum_item_length - len(truncate_dividing_string) - len(value)] + truncate_dividing_string
                    
                # if value is over half a lines length
                elif len(value) > maximum_item_length // 2:
                    key = key + dividing_string
                    value = value[:maximum_item_length - len(truncate_string) - len(key)] + truncate_string

            else:
                key = key + dividing_string

            while len(key) < maximum_item_length - len(value):
                if len(key) % 2 == 0 and len(key) < maximum_item_length - len(value) - 2:
                    key += "-"
                else:
                    key += " "

            pair = key + value

            if i % 2 == 0:
                subline.append(pair)
                if i == len(dict) - 1:
                    while len(pair) < Display.line_length:
                        pair += " "

                    result.append(pair)

            else:
                subline.append(pair)
                result.append("    ".join(subline))
                subline = []

        return result
 

    ## TEST METHODS

    @staticmethod
    def test(text):
        formatted = Display.format_text(text)
        lined = Display.text_to_lines(formatted)
        centred = Display.centre_justify_lines(lined)
      #  print(centred)
        paged = Display.lines_to_pages(centred)
        for page in paged:

        #    print(page)

            print(Display.set_page_in_border(page))

    @staticmethod
    def test2(page):
        bordered = Display.set_page_in_border(page)
        for line in bordered:
            print(line)

    @staticmethod
    def test3(text_list):
        formatted_texts = Display.format_multiple_texts_in_list_to_lines(text_list)
        print(formatted_texts)
    
    @staticmethod
    def test4(dict):
        lines = Display.hashmap_to_lines(dict)
        for line in lines:
            print(line)
    
dummy_dict = {
    "health": 700,
    "wealth": 574357,
    "depth": 65363,
    "Straight as an arrow": "absolutely",
    "1234567890123456789012345678901234567890123456789012345": 4978,
    "12345678901234": 12345678901234546789012323456789012324356789012334545677889,
    "verylong123445667788091234567890123456789012345678901234567890" : 123456789012345678901234567890123456789012345678901234567890,
 
}


# Display.test4(dummy_dict)


long_texting = "Lorem ipsum dolor sit/pamet, consectetur adipiscing elit. Nam tincidunt egestas augue, nec eleifend elit porttitor vitae. Mauris euismod, ex a semper vestibulum, lectus dui odales est, quis solliitudin lectus purus eget sem. In quam diam, porta eu diam vel, rhoncus gestas ligula. Nulla pretium quam quis ex fermentum condimentum. Ut nec mi tempor est consequat accumsan. Integer cursus nisl enim, sit amet laoreet leo tincidunt id. Phasellus et turpis quis u/rna varius molis. Nulla erat felis lacinia nec leo a, ornare luctus nibh. Pellentesque lacus magna, malesuada at imperdiet id, vehicula sit amet assa. Ut rhocus, felis vel tempus volutpat, leo ipsum aliquam ipsu, nec eleifend velit odio eu purus. Duis accumsan purus in pharetra dapibus. Maecenas mollis lobortis vestibulum. Nulla et mauris quis augue tincidunt viverra ut condimentum lectus. Praesent fringilla diam nunc, id egestas rna venenatis #non.Phasellus id orci scelerisque, ultrices massa attempor felis. Nam semper at/purpis consectetur aliquam.  Lorem ipsum dolor sit/pamet, consectetur adipiscing elit. Nam tincidunt egestas augue, nec eleifend elit porttitor vitae. Mauris euismod, ex a semper vestibulum, lectus dui odales est, quis solliitudin lectus purus eget sem. In quam diam, porta eu diam vel, rhoncus gestas ligula. Nulla pretium quam quis ex fermentum condimentum. Ut nec mi tempor est consequat accumsan. Integer cursus nisl enim, sit amet laoreet leo tincidunt id. Phasellus et turpis quis u/rna varius molis. Nulla erat felis lacinia nec leo a, ornare luctus nibh. Pellentesque lacus magna, malesuada at imperdiet id, vehicula sit amet assa. Ut rhocus, felis vel tempus volutpat, leo ipsum aliquam ipsu, nec eleifend velit odio eu purus. Duis accumsan purus in pharetra dapibus. Maecenas mollis lobortis vestibulum. Nulla et mauris quis augue tincidunt viverra ut condimentum lectus. Praesent fringilla diam nunc, id egestas rna venenatis #non.Phasellus id orci scelerisque, ultrices massa attempor felis. Nam semper at/purpis consectetur aliquam."

short_texting = "1234567890/p/n12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"

stupid_texting = "1234567890                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"

dummy_page = ['  amet, consectetur adipiscing elit. Nam tincidunt egestas  ', 'augue, nec eleifend elit porttitor vitae. Mauris euismod, ex', 'a semper vestibulum, lectus dui odales est, quis solliitudin', '  lectus purus eget sem. In quam diam, porta eu diam vel,   ', 'rhoncus gestas ligula. Nulla pretium quam quis ex fermentum ', '   condimentum. Ut nec mi tempor est consequat accumsan.    ', 'Integer cursus nisl enim, sit amet laoreet leo tincidunt id.', '  Phasellus et turpis quis u/rna varius molis. Nulla erat   ', ' felis lacinia nec leo a, ornare luctus nibh. Pellentesque  ', ' lacus magna, malesuada at imperdiet id, vehicula sit amet  ', '   assa. Ut rhocus, felis vel tempus volutpat, leo ipsum    ', '    aliquam ipsu, nec eleifend velit odio eu purus. Duis    ', 'accumsan purus in pharetra dapibus. Maecenas mollis lobortis', 'vestibulum. Nulla et mauris quis augue tincidunt viverra ut ', 'condimentum lectus. Praesent fringilla diam nunc, id egestas', ' rna venenatis #non.Phasellus id orci scelerisque, ultrices ']

multi_texts = ["tHIS IS THE first line", "this is the second line, it goes on for much longer for some reason so that you can see it overflowing later on lalalalalala la la lal la la lal ", "this is the third line, it contains a /n line break", "this is the fourth line, it contains a /d double break and a trailing line break/n", "this is the fifth line, it has a /p page break in, sorry bozo!gsdgdsgdsgsdgdsgsdgdsgdsg  gsdgds  sdg dsg sdgs"]
