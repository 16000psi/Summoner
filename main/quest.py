class Quest:
    def __init__(self, name, slug):
        self.name = name
        self.slug = slug
        self.progress_level = 0

    def increment_progress(self, ammount):
        self.progress_level += ammount

    def make_progress_check(self, minimum_level, maximum_level):
        if (
            self.progress_level >= minimum_level
            and self.progress_level <= maximum_level
        ):
            return True
        else:
            return False

    def __str__(self):
        return f"({self.slug}) {self.name}: {self.progress_level}"
