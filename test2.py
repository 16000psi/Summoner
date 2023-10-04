from demons import Imp, HornedDemon, Flamelurker, Infernal, Sedimentite, StormDemon, Voidwalker, Succubus, SoulEater, SpiderDemon, VoidTerror, AbyssalDemon, AlchemicalTrickster, DreamWeaver, PortaEntity, CrystalDemon, Spellthief, SceptreDemon, Mort, FleshTower, NoxiousSpirit, SentientOoze, Plaguebearer, Swarmsoul, Satyr, RuneDemon, FadedWarrior, Chupacabra, DrownedCourtier, TitanicVisage

from display import Display

demon_array = [DrownedCourtier(30), HornedDemon(30), Flamelurker(30)]


print(Display.hashmap_to_half_lines((demon_array[0].create_combat_hash_stat_report())))

demon_array[0].receive_xp_check_level_up(20000)


print(Display.hashmap_to_half_lines((demon_array[0].create_combat_hash_stat_report())))