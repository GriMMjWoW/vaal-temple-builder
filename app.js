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
    Object.entries(room.stats).forEach(([statName, statData]) => {
      const { type, value } = statData;

      if (!total[statName]) {
        if (type === 'more') {
          total[statName] = { type, value: 1 };
        } else {
          total[statName] = { type, value: 0 };
        }
      }

      if (type === 'increased' || type === 'flat' || type === 'chance') {
        total[statName].value += value;
      }

      if (type === 'more') {
        total[statName].value *= 1 + value / 100;
      }
    });
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
