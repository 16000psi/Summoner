import asyncio

from tortoise import Tortoise

from .models import MapCell


async def init(db_url):
    # Here we connect to a SQLite DB file.
    # also specify the app name of "models"
    # which contain models from "app.models"
    await Tortoise.init(
        db_url=db_url, modules={"models": ["database.models"]}
    )
    # Generate the schema

    await Tortoise.generate_schemas()

    # cell = await MapCell.create(x=1, y=1, content="A mysterious object")
    # print(cell)


def initialise_tortoise(db_url):
    asyncio.run(init(db_url))
