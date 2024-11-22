from tortoise import fields
from tortoise.models import Model


class MapCell(Model):
    id = fields.IntField(pk=True)  # Primary Key
    x = fields.IntField()  # X coordinate
    y = fields.IntField()  # Y coordinate
    content = fields.TextField()  # Content as a string

    class Meta:
        table = "map_cell"  # Name of the database table
        unique_together = ("x", "y")  # Ensure no duplicate coordinates

    def __str__(self):
        return f"MapCell(x={self.x}, y={self.y}, content='{self.content}')"
