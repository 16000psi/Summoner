import os
import sqlite3


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


def create_new_sqlite3_file_in_maps(file_name):
    """todo, allowed characters, file cannot be empty"""
    base_dir = get_base_directory()
    maps_dir = os.path.join(base_dir, "maps")

    # Ensure the maps directory exists
    os.makedirs(maps_dir, exist_ok=True)

    # Construct the full path for the SQLite file
    db_path = os.path.join(maps_dir, file_name + ".sqlite3")

    # Check if the file already exists
    if os.path.exists(db_path):
        raise FileExistsError(
            f"The file '{db_path}' already exists. Choose a different file name."
        )

    # Create the SQLite file
    try:
        conn = sqlite3.connect(db_path)
        print(f"SQLite database created at: {db_path}")
    except sqlite3.Error as e:
        print(f"An error occurred while creating the SQLite file: {e}")
    finally:
        conn.close()
