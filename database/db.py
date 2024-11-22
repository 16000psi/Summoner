import asyncio

from tortoise import Tortoise

from .models import MapCell


async def init():
    # Here we connect to a SQLite DB file.
    # also specify the app name of "models"
    # which contain models from "app.models"
    await Tortoise.init(
        db_url="sqlite://maps/db.sqlite3", modules={"models": ["database.models"]}
    )
    # Generate the schema

    await Tortoise.generate_schemas()

    cell = await MapCell.create(x=10, y=20, content="A mysterious object")
    # print(cell)


def initialise_tortoise():
    asyncio.run(init())
