async function loadRooms() {
  const response = await fetch('data/rooms.json');
  return response.json();
}

function generateTemple(rooms, count = 4) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
    result.push(randomRoom);
  }
  return result;
}

function calculateTempleStats(rooms) {
  const total = {};

  rooms.forEach(room => {
    for (const stat in room.stats) {
      const { type, value } = room.stats[stat];

      if (!total[stat]) {
        total[stat] = { type, value: type === 'more' ? 1 : 0 };
      }

      if (type === 'increased' || type === 'flat' || type === 'chance') {
        total[stat].value += value;
      }

      if (type === 'more') {
        total[stat].value *= 1 + value / 100;
      }
    }
  });

  return total;
}


async function simulate() {
  const data = await loadRooms();

  const templeRooms = generateTemple(data.rooms);
  const stats = calculateTempleStats(templeRooms);

  document.getElementById('roomsOutput').textContent =
    JSON.stringify(templeRooms, null, 2);

  document.getElementById('statsOutput').textContent =
    JSON.stringify(stats, null, 2);
}

document
  .getElementById('simulateBtn')
  .addEventListener('click', simulate);
