// Deklaracija promenljive
const appState = {
  isLoggedIn: false,
  data: [],
};

// Funkcija stanja login-a
function handleLoggedInState() {
  const addPlayerContainer = document.getElementById('add-player-container');
  const logOutButton = document.getElementById('log-out-button');
  addPlayerContainer.style.display = appState.isLoggedIn ? 'block' : 'none';
}


// Funkcija kreiranja delete tastera
function createDeleteButton(row, index) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete...';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', () => {
    if( confirm(`Da li ste sigurni da zelite da uklonite igraca ?`)){
       appState.data.splice(index, 1); 
       row.remove();
    }
  });
  return deleteButton;
}
// Funkcija dodavanja igraca na tabeli
function populatePlayerTable() {
  const playerTable = document.getElementById('playerTable');
  playerTable.innerHTML = '';

  const headerRow = playerTable.insertRow();
  const headers = [
    'Rank', 
    'Name',
    'Position',
    'Team',
    'Games Played',
    'Points Average',
    'Rebounds Average',
    'Assists Average',
    'ESPN Rating',
  ];

  headers.forEach((headerText) => {
    const headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });
  appState.data.forEach((player, index) => {
    const row = playerTable.insertRow();
    const cells = [
      index + 1, 
      player.name,
      player.position,
      player.team,
      player.games_played,
      player.points_average,
      player.rebounds_average,
      player.assists_average,
      player.espn_ratining,
    ];

    cells.forEach((cellData) => {
      const cell = row.insertCell();
      cell.textContent = cellData;
    });

    const moreButton = document.createElement('button');
    moreButton.textContent = 'More...';
    moreButton.classList.add('more-button');
    moreButton.addEventListener('click', () => {
      displayPopup(player);
    });
    const moreCell = row.insertCell();
    moreCell.appendChild(moreButton);

    const deleteButton = createDeleteButton(row, index);
    const deleteCell = row.insertCell();
    deleteCell.appendChild(deleteButton);
    
  });
}

// Funkcija uchitavanja 
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('data.json');
    appState.data = await response.json();
    populatePlayerTable();
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  const menuButton = document.getElementById('menu-button');
  const menuContainer = document.getElementById('menu-container');
  const loginForm = document.getElementById('login-form');
  const loginFormm = document.getElementById('login-formm');
  const addPlayerForm = document.getElementById('add-player-form');
  const addPlayerContainer = document.getElementById('add-player-container');
  const logOutButton = document.getElementById('logOutButton');
  const searchPlayersStats = document.getElementById('searchPlayerStats');
  const searchedGames = document.getElementById('searchedGames');
  const searchedRebounds = document.getElementById('searchedRebounds');
  const searchedAssists = document.getElementById('searchedAssists');
  const searchedPoints = document.getElementById('searchedPoints');
  const closeLoginButton = document.getElementById('close-login-button');
  const closePlayerForm = document.getElementById('close-add-button');
 

  // Funkcija za pretrazivanje
  searchPlayersStats.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log(1);
    let searchedName = document.getElementById('player-name').value.trim();
    
    searchedName = removeSpace(searchedName);
    if (!searchedName) {
      alert('Please enter a valid player name.');
      return;
    }
    const getPlayerId = (playerName) => {
      const apiUrl = `https://www.balldontlie.io/api/v1/players?search=${playerName}`;
    
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(2);

        return response.json();

      })
      .then((data) => {
        getPlayerStats(data.data[0].id);
        console.log(2);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
    };

    // Funkcija zauklanjanje praznih mesta
    function removeSpace(searchedName) {
      const replace = searchedName.split(" ").join("_");
      return replace;
    } 

// Funkcija ucitavanja podataka o igracu
  const getPlayerStats = (playerID) => {
  const apiUrl = `https://www.balldontlie.io/api/v1/season_averages?season=2019&player_ids[]=${playerID}&player_ids[]=${playerID}`;
  let setState;
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    })
    .then((data) => {
      searchedGames.innerHTML = "Games played:";
      searchedPoints.innerHTML = "Points average:";
      searchedRebounds.innerHTML = "Rebounds average:";
      searchedAssists.innerHTML = "Assists average:";
      console.log(data.data);
      searchedGames.innerHTML += data.data[0].games_played;
      searchedPoints.innerHTML += data.data[0].pts;
      searchedRebounds.innerHTML += data.data[0].reb;
      searchedAssists.innerHTML += data.data[0].ast;
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
  };
  getPlayerId(searchedName);

});
// Ako korisnik nije ulogovan ukloni taster
  if(!appState.isLoggedIn){
    logOutButton.style.display = 'none';
  }
// Funkcija za menu taster
menuButton.addEventListener('click', () => {
  menuContainer.style.display = menuContainer.style.display === 'block' ? 'none' : 'block';
});

closePlayerForm.addEventListener('click', () => {
  addPlayerContainer.style.display = 'none';
});
 closeLoginButton.addEventListener('click', () => {
  menuContainer.style.display = menuContainer.style.display === 'block' ? 'none' : 'block';
});
// Funkcija za login
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if(username === 'admin' && password === 'admin') {
    appState.isLoggedIn = true;
    handleLoggedInState();
    menuContainer.style.display = 'none';
    if(appState.isLoggedIn){
      logOutButton.style.display = 'block';
      loginFormm.style.display = 'none';
    }
  }
});
// Funkcija za logout
logOutButton.addEventListener('click', async (e) => {
  appState.isLoggedIn = false;
  menuContainer.style.display = 'none';
  loginFormm.style.display = 'block';
  logOutButton.style.display = 'none';
  addPlayerContainer.style.display = 'none';
});
// Funkcija za dodavanje osnovnih informacija novih igraca
addPlayerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if(confirm(`Da li ste sigurni da zelite da dodate igraca ?`)){
 

  if (!appState.isLoggedIn) {
    alert('You must be logged in to add a player.');
    return;
  }

  const addPlayerContainer = document.getElementById('add-player-container');
  const playerName = document.getElementById('player_Name').value;
  const playerQuote = document.getElementById('playerQuote').value;
  const playerPosition = document.getElementById('playerPosition').value;
  const playerTeam = document.getElementById('playerTeam').value;
  const playerGames = document.getElementById('playerGames').value;
  const pointsAverage = document.getElementById('pointsAverage').value;
  const reboundsAverage = document.getElementById('reboundsAverage').value;
  const assistsAverage = document.getElementById('assistsAverage').value;
  const espnRatings = document.getElementById('espnRatings').value;
  const height = document.getElementById('height').value;
  const weight = document.getElementById('weight').value;
  const birthdate = document.getElementById('birthdate').value;
 
  const newPlayer = {
    name: playerName,
    quote: playerQuote,
    position: playerPosition,
    team: playerTeam,
    games_played: playerGames,
    points_average: pointsAverage,
    rebounds_average: reboundsAverage,
    assists_average: assistsAverage,
    espn_ratining: espnRatings,
    height: height,
    weight: weight,
    birthdate: birthdate
  };
  console.log(espnRatings)
  appState.data.push(newPlayer);


  populatePlayerTable();

  addPlayerForm.reset();

  }
});

// Funkcija za azuriranje tabele

function updateTable() {
  const playerTable = document.getElementById('playerTable');
  playerTable.innerHTML = '';

  data.forEach((player, index) => {});
}

});

// Funkcija za pokazivanje pop up prozora

function displayPopup(playerData) {
  const popupContainer = document.createElement('div');
  popupContainer.classList.add('popup-container');

  const popupContent = document.createElement('div');
  popupContent.classList.add('popup-content');

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');
  const dataContainer = document.createElement('div');
  dataContainer.classList.add('data-container');
  
  const closePopup= document.createElement('button');
  closePopup.classList.add('close-popup'); 

  const playerImage = document.createElement('img');
  playerImage.src = playerData.image;
  playerImage.alt = 'Player Image';
  imageContainer.appendChild(playerImage);
  
 
  dataContainer.innerHTML = `
    <p>Name: ${playerData.name}</p>
    <p>Standing: ${playerData.standings}</p>
    <p>Position: ${playerData.position}</p>
    <p>Team: ${playerData.team_fullname}</p>
    <p>Height: ${playerData.height}</p>
    <p>Weight: ${playerData.weight}</p>
    <p>Birthdate: ${playerData.birthdate}</p>
    <!-- Add more data as needed -->
  `;
  closePopup.innerHTML += 'X';
  popupContent.appendChild(imageContainer);
  popupContent.appendChild(dataContainer);
  popupContent.appendChild(closePopup);

  popupContainer.appendChild(popupContent);
  document.body.appendChild(popupContainer)
 
  popupContainer.addEventListener('click', (event) => {
      if (event.target === popupContainer) {
        document.body.removeChild(popupContainer);
      }
  });
  popupContent.addEventListener('click', (event) => {
    if (event.target === closePopup) {
      document.body.removeChild(popupContainer);
    }
  });
  const closePopupButton = document.getElementById('close-popup-button');

  // closePopupButton.addEventListener('click', (event) => {
  //   console.log(1);
  // });
}
populatePlayerTable();