import os


def get_base_directory():
    """
    Returns the base directory of the project, where the script is run.
    """
    return os.getcwd()


def list_sqlite3_files_in_maps():
    """
    Lists all .sqlite3 files (without the extension) in the ./maps/
    directory relative to the base directory.
    """
    base_dir = get_base_directory()
    maps_dir = os.path.join(base_dir, "maps")

    if not os.path.exists(maps_dir):
        raise FileNotFoundError(f"'maps' directory not found at {maps_dir}")

    sqlite3_files = [
        os.path.splitext(f)[0]
        for f in os.listdir(maps_dir)
        if f.endswith(".sqlite3") and os.path.isfile(os.path.join(maps_dir, f))
    ]
    return sqlite3_files
