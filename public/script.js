// Define an object to manage the app state
// import axios from 'axios';
const appState = {
  isLoggedIn: false,
  data: [],
};


function handleLoggedInState() {
  const addPlayerContainer = document.getElementById('add-player-container');
  const logOutButton = document.getElementById('log-out-button'); // Add this line

  if (appState.isLoggedIn) {
    addPlayerContainer.style.display = 'block';
    logOutButton.style.display = 'block'; // Show the Log Out button
  } else {
    addPlayerContainer.style.display = 'none';
    logOutButton.style.display = 'none'; // Hide the Log Out button
  }
}
// Function to create a delete button for a row
function createDeleteButton(row, index) {
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete...';
  deleteButton.classList.add('delete-button');
  deleteButton.addEventListener('click', () => {
    // Handle row deletion here
    appState.data.splice(index, 1); // Remove the corresponding data entry
    row.remove(); // Remove the row from the table
  });
  return deleteButton;
}

// Function to populate the player table
function populatePlayerTable() {
  const playerTable = document.getElementById('playerTable');
  playerTable.innerHTML = ''; // Clear the table

  // Create a table header row
  const headerRow = playerTable.insertRow();
  const headers = [
    'Rank', // Add more headers for each column
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
      index + 1, // Rank
      player.name,
      player.position,
      player.team,
      player.games_played,
      player.points_average,
      player.rebounds_average,
      player.assists_average,
      player.espn_ratin,
    ];

    cells.forEach((cellData) => {
      const cell = row.insertCell();
      cell.textContent = cellData;
    });

    // Add More button
    const moreButton = document.createElement('button');
    moreButton.textContent = 'More...';
    moreButton.classList.add('more-button');
    moreButton.addEventListener('click', () => {
      displayPopup(player);
    });
    const moreCell = row.insertCell();
    moreCell.appendChild(moreButton);

    if (appState.isLoggedIn) {
      // Add Delete button
      const deleteButton = createDeleteButton(row, index);
      const deleteCell = row.insertCell();
      deleteCell.appendChild(deleteButton);
    } else if(!appState.isLoggedIn){
      
    }
    
  });
}

// Function to handle logged-in state changes
function handleLoggedInState() {
  const addPlayerContainer = document.getElementById('add-player-container');
  addPlayerContainer.style.display = appState.isLoggedIn ? 'block' : 'none';
}

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

  searchPlayersStats.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    // Get the user's input from the form
    let searchedName = document.getElementById('player-name').value.trim();
    
    searchedName = removeSpace(searchedName);
    // Check if the user provided a player name
    if (!searchedName) {
      // Handle the case where the input is empty or invalid
      alert('Please enter a valid player name.');
      return;
    }
    const getPlayerId = (playerName) => {
      // Construct the API URL with the player name as a query parameter
      const apiUrl = `https://www.balldontlie.io/api/v1/players?search=${playerName}`;
    
      // Make the API request using the fetch function
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Process and use the fetched data here
        getPlayerStats(data.data[0].id);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // Handle the error here (e.g., show an error message to the user)
      });
    };
    function removeSpace(searchedName) {
      const replace = searchedName.split(" ").join("_");
      return replace;
    }
    console.log(getPlayerId(searchedName));

    const getPlayerStats = (playerID) => {
      // Construct the API URL with the desired parameters
      const apiUrl = `https://www.balldontlie.io/api/v1/season_averages?season=2019&player_ids[]=${playerID}&player_ids[]=${playerID}`;
      let setState;
      // Make the API request using the fetch function
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          return response.json();
        })
        .then((data) => {
          // Process and use the fetched data here
          // searchedGames.innerHTML += data.data.
          // searchedGames.innerHTML += data.data.games_played;
          console.log(data.data);
          searchedGames.innerHTML += data.data[0].games_played;
          searchedPoints.innerHTML += data.data[0].pts;
          searchedRebounds.innerHTML += data.data[0].reb;
          searchedAssists.innerHTML += data.data[0].ast;
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          // Handle the error here (e.g., show an error message to the user)
        });
    };
    
    // console.log(getPlayerStats());
  });

  if(!appState.isLoggedIn){
    logOutButton.style.display = 'none';
  }
  menuButton.addEventListener('click', () => {
    menuContainer.style.display = menuContainer.style.display === 'block' ? 'none' : 'block';
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        appState.isLoggedIn = true;
        handleLoggedInState();
        menuContainer.style.display = 'none';
        if(appState.isLoggedIn){
          logOutButton.style.display = 'block';
          loginFormm.style.display = 'none';
        }
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  logOutButton.addEventListener('click', async (e) => {
    appState.isLoggedIn = false;
    menuContainer.style.display = 'none';
    loginFormm.style.display = 'block';
    logOutButton.style.display = 'none';
    addPlayerContainer.style.display = 'none';
  });

addPlayerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Check if the user is logged in before allowing the submission
  if (!appState.isLoggedIn) {
    // Display a message or redirect to the login page
    alert('You must be logged in to add a player.');
    return;
  }

  // Get input values from the form
  const playerName = document.getElementById('player-name').value;
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
  const imageUrl = document.getElementById('Image').value;

  // Create a new player object
  const newPlayer = {
    image: imageUrl, // Add image URL here if available
    name: playerName,
    quote: playerQuote,
    position: playerPosition,
    team: playerTeam,
    games_played: playerGames,
    points_average: pointsAverage,
    rebounds_average: reboundsAverage,
    assists_average: assistsAverage,
    espn_ratings: espnRatings,
    height: height,
    weight: weight,
    birthdate: birthdate
  };

  // Add the new player to the data array
  appState.data.push(newPlayer);

  // Update the data.json file (you'll need a server-side script for this)
  // For simplicity, we'll just update the table for now
  populatePlayerTable();

  // Clear the form fields
  addPlayerForm.reset();

  // Hide the add player form
  const addPlayerContainer = document.getElementById('add-player-container');
});

    function updateTable() {
      // Clear the current table
      const playerTable = document.getElementById('playerTable');
      playerTable.innerHTML = '';

      // Repopulate the table with updated data
      data.forEach((player, index) => {
          // ... (your existing code for populating the table)
      });
  }
  
});



  function displayPopup(playerData) {
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
  
    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');
  
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    const dataContainer = document.createElement('div');
    dataContainer.classList.add('data-container');
  
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
  
    popupContent.appendChild(imageContainer);
    popupContent.appendChild(dataContainer);
  
    popupContainer.appendChild(popupContent);
    document.body.appendChild(popupContainer)
    
    popupContainer.addEventListener('click', (event) => {
        if (event.target === popupContainer) {
          document.body.removeChild(popupContainer);
        }
    });
  }
  populatePlayerTable();