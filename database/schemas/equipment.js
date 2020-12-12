function newEquipmentObj(equipmentId, level = 1) {
  return {
    id: equipmentId,  
    level,
  }
}

module.exports = { newEquipmentObj };
