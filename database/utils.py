import os
import shutil
import sqlite3


def copy_sqlite3_file(source_path, destination_path):
    try:
        shutil.copyfile(source_path, destination_path)
        print(
            f"Successfully copied SQLite3 file from '{source_path}' to '{destination_path}'"
        )
    except FileNotFoundError:
        print(f"Error: Source file '{source_path}' not found.")
    except PermissionError:
        print(f"Error: Permission denied when accessing '{destination_path}'.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")


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


def initialise_buffer_file():
    base_dir = get_base_directory()
    maps_dir = os.path.join(base_dir, "maps")
    buffer_dir = os.path.join(maps_dir, "buffers")
    buffer_path = os.path.join(buffer_dir, "buffer.sqlite3")

    try:
        if os.path.exists(buffer_path):
            os.remove(buffer_path)
            print(f"Deleted the existing SQLite file at '{buffer_path}'")

        connection = sqlite3.connect(buffer_path)
        print(f"Initialized a new SQLite file at '{buffer_path}'")

        connection.close()
    except Exception as e:
        print(f"An error occurred: {e}")


def copy_file_to_buffer_file(file_name):
    base_dir = get_base_directory()
    maps_dir = os.path.join(base_dir, "maps")
    buffer_dir = os.path.join(maps_dir, "buffers")
    buffer_path = os.path.join(buffer_dir, "buffer.sqlite3")

    target_path = os.path.join(maps_dir, file_name + ".sqlite3")

    copy_sqlite3_file(target_path, buffer_path)


def copy_buffer_file_to_new_file_in_maps(file_name):
    """todo, allowed characters, file cannot be empty"""
    base_dir = get_base_directory()
    maps_dir = os.path.join(base_dir, "maps")
    buffer_dir = os.path.join(maps_dir, "buffers")
    buffer_path = os.path.join(buffer_dir, "buffer.sqlite3")

    target_path = os.path.join(maps_dir, file_name + ".sqlite3")

    # if os.path.exists(db_path):
    #     raise FileExistsError(
    #         f"The file '{db_path}' already exists. Choose a different file name."
    #     )

    copy_sqlite3_file(buffer_path, target_path)
