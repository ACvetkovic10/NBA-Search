console.log("1");
document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
      .then(response => response.json())
      .then(data => {
        const playerTable = document.getElementById('playerTable');
        console.log("1");
        data.forEach((player, index) => {
          const row = playerTable.insertRow();
          const rankCell = row.insertCell(0);
          const nameCell = row.insertCell(1);
          const positionCell = row.insertCell(2);
          const teamCell = row.insertCell(3);
          const gamesCell = row.insertCell(4);
          const pointsCell = row.insertCell(5);
          const reboundsCell = row.insertCell(6);
          const assistsCell = row.insertCell(7);
          const espnRatingCell = row.insertCell(8);
          const moreCell = row.insertCell(9);
          const moreButton = document.createElement('button');
           
          moreButton.textContent = 'More...';
          moreButton.classList.add('more-button');
          moreCell.appendChild(moreButton);
          rankCell.textContent = index + 1;
          nameCell.textContent = player.name;
          positionCell.textContent = player.position;
          teamCell.textContent = player.team;
          gamesCell.textContent = player.games_played;
          pointsCell.textContent = player.points_average;
          reboundsCell.textContent = player.rebounds_average;
          assistsCell.textContent = player.assists_average;
          espnRatingCell.textContent = player.espn_ratin;
        });
  
        const moreButtons = document.querySelectorAll('.more-button');
  
        moreButtons.forEach((button, index) => {
          button.addEventListener('click', () => {
            const playerData = data[index]; // Assuming your data array is named 'data'
            displayPopup(playerData);
          });
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  });
  
  function displayPopup(playerData) {
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');
  
    const popupContent = document.createElement('div');
    popupContent.classList.add('popup-content');
  
    // Create separate containers for image and data
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    const dataContainer = document.createElement('div');
    dataContainer.classList.add('data-container');
  
    // Add player image to the image container
    const playerImage = document.createElement('img');
    playerImage.src = playerData.image;
    playerImage.alt = 'Player Image';
    imageContainer.appendChild(playerImage);
    
    
    // Populate data container with player data
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
  
    // Append containers to the pop-up content
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
  