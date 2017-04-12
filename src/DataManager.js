class DataManager {

  constructor() {

    this.loadedDatasets = this.PurgeStoredData();

  }

  // Adds new dataset to array in memory and stores it locally
  SaveDataset(dataStr) {

    var stored  = JSON.parse(localStorage.getItem('datasets'));

    if (!stored)
      stored = [];

    var dataset = JSON.parse(dataStr);

    stored.push(dataset);
    localStorage.setItem('datasets', JSON.stringify(stored));

    this.loadedDatasets = stored;
  }

  GetUnixTimestampFromDateStr(strDate) {

    var arrDate = strDate.split(/[^0-9]/);
    var dateObj = new Date (arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5]);

    return Math.floor(dateObj.getTime() / 1000);
  }

  // Remove all localStored datasets that are older than current date minus 10 days
  PurgeStoredData() {

    var timeFrame = 60*60*24*10;
    var purged    = [];
    var stored    = JSON.parse(localStorage.getItem('datasets'));

    if (stored) {

      var currentUnixTimeStamp = Math.floor(new Date().getTime() / 1000);

      for (let i=0; i<stored.length; i++) {

        let strDate = stored[i].timestamp;
        let datasetUnixTimestamp =  this.GetUnixTimestampFromDateStr(strDate);

        if (datasetUnixTimestamp>currentUnixTimeStamp-timeFrame)
          purged.push(stored[i]);
      }

      localStorage.setItem('datasets', JSON.stringify(purged));
    }

    return purged;
  }

  // Get list of datasets with active drivers during last 24 hours and their last position
  GetLastActiveDrivers() {

    let timeFrame  = 60*60*24;
    let lastActive = [];
    let stored     = JSON.parse(localStorage.getItem('datasets'));

    if (stored) {

      var currentUnixTimeStamp = Math.floor(new Date().getTime() / 1000);

      for (let i=0; i<stored.length; i++) {

        let strDate = stored[i].timestamp;
        let datasetUnixTimestamp =  this.GetUnixTimestampFromDateStr(strDate);

        if (datasetUnixTimestamp>currentUnixTimeStamp-timeFrame)
          lastActive.push(stored[i]);
      }
    }

    return lastActive;
  }


  // filter loadedDatasets by selected time period
  filterLoadedDatasets(timeFrame) {

    var filtered = [];
    var currentUnixTimeStamp = Math.floor(new Date().getTime() / 1000);

    for(let i=0; i<this.loadedDatasets.length; i++) {

      let strDate = this.loadedDatasets[i].timestamp;
      let datasetUnixTimestamp = this.GetUnixTimestampFromDateStr(strDate);

      if (datasetUnixTimestamp>(currentUnixTimeStamp-timeFrame*60*60))
        filtered.push(this.loadedDatasets[i]);
    }

    return filtered;
  }

}

export default DataManager;
