from tortoise import fields
from tortoise.models import Model


class MapCell(Model):
    id = fields.IntField(pk=True)
    x = fields.IntField()
    y = fields.IntField()
    content = fields.TextField()

    class Meta:
        table = "map_cell"
        unique_together = ("x", "y")

    def __str__(self):
        return f"MapCell(x={self.x}, y={self.y}, content='{self.content}')"

    @classmethod
    async def get_map_cells_dict(cls):
        map_cells = await cls.all()
        map_cells_dict = {
            f"{map_cell.x}_{map_cell.y}": map_cell for map_cell in map_cells
        }
        return map_cells_dict
