import asyncio

from tortoise import Tortoise

from .models import MapCell

DB_URL = "sqlite://maps/buffers/buffer.sqlite3"


async def init():
    # Here we connect to a SQLite DB file.
    # also specify the app name of "models"
    # which contain models from "app.models"
    await Tortoise.init(db_url=DB_URL, modules={"models": ["database.models"]})
    # Generate the schema

    await Tortoise.generate_schemas()

    # cell = await MapCell.create(x=2, y=2, content="A mysterious object")
    # print(cell)


def initialise_tortoise():
    asyncio.run(init())
