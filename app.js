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
  formatStats(stats);

}


document
  .getElementById('simulateBtn')
  .addEventListener('click', simulate);

}


function formatStats(stats) {
  const lines = [];

  for (const stat in stats) {
    const { type, value } = stats[stat];

    if (type === 'increased') {
      lines.push(`+${value}% increased ${stat}`);
    }

    if (type === 'flat') {
      lines.push(`+${value} ${stat}`);
    }

    if (type === 'chance') {
      const capped = Math.min(value, 100);
      lines.push(`${capped}% chance ${stat}`);
    }

    if (type === 'more') {
      const percent = Math.round((value - 1) * 100);
      lines.push(`${percent}% more ${stat}`);
    }
  }

  return lines.join('\n');
}
