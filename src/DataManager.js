class DataManager {

  constructor() {

    this.PurgeStoredData();

  }

  // Adds new dataset to array in memory and stores it locally
  SaveDataset(dataStr) {

    let stored  = JSON.parse(localStorage.getItem('datasets'));

    if (!stored)
      stored = [];

    stored.push(JSON.parse(dataStr));
    localStorage.setItem('datasets', JSON.stringify(stored));
  }

  // Remove all localStored datasets that are older than current date minus 10 days
  PurgeStoredData() {

    let timeFrame = 60*60*24*10;
    let purged    = [];
    let stored    = JSON.parse(localStorage.getItem('datasets'));

    if (stored) {

      var CurrentUnixTimeStamp = Math.floor(new Date().getTime() / 1000);

      for (var i=0; i<stored.length; i++) {

        let strDate = stored[i].timestamp;
        let arrDate = strDate.split(/[^0-9]/);
        let dateObj = new Date (arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5]);
        let DatasetUnixTimeStamp =  Math.floor(dateObj.getTime() / 1000);

        if (DatasetUnixTimeStamp>CurrentUnixTimeStamp-timeFrame)
          purged.push(stored[i]);
      }

      localStorage.setItem('datasets', JSON.stringify(purged));
    }
  }

  // Get list of datasets with active drivers during last 24 hours and their last position
  GetLastActiveDrivers() {

    let timeFrame  = 60*60*24;
    let lastActive = [];
    let stored     = JSON.parse(localStorage.getItem('datasets'));

    if (stored) {

      var CurrentUnixTimeStamp = Math.floor(new Date().getTime() / 1000);

      for (let i=0; i<stored.length; i++) {

        let strDate = stored[i].timestamp;
        let arrDate = strDate.split(/[^0-9]/);
        let dateObj = new Date (arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5]);
        let DatasetUnixTimeStamp =  Math.floor(dateObj.getTime() / 1000);

        if (DatasetUnixTimeStamp>CurrentUnixTimeStamp-timeFrame)
          lastActive.push(stored[i]);
      }
    }

    return lastActive;
  }

}

export default DataManager;
