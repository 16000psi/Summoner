import math

base_xp = 100
xp_growth_factor = 1.2

xp = 145
level = 2

if xp > math.floor(base_xp * (xp_growth_factor ** (level))):
    print(True)

else:
    print(False)

print([math.floor(base_xp * (xp_growth_factor ** x)) for x in range(1,31)])