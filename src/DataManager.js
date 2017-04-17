class DataManager {

  constructor() {

    this.loadedDatasets = this.purgeStoredData();

  }

  // Adds new dataset to array in memory and stores it locally
  saveDataset(dataset) {

    var stored  = JSON.parse(localStorage.getItem('datasets'));

    if (!stored)
      stored = [];

    stored.push(dataset);
    localStorage.setItem('datasets', JSON.stringify(stored));

    this.loadedDatasets = stored;
  }

  GetUnixTimestampFromStr(strDate) {

    var arrDate           = strDate.split(/[^0-9]/);
    var dateUnixTimestamp = Date.UTC(arrDate[0],arrDate[1]-1,arrDate[2],arrDate[3],arrDate[4],arrDate[5]);

    return Math.floor(dateUnixTimestamp / 1000);
  }

  // Remove all localStored datasets that are older than current date minus 10 days
  purgeStoredData() {

    var timeFrame = 60*60*24*10;
    var purged    = [];
    var stored    = JSON.parse(localStorage.getItem('datasets'));

    if (stored) {

      var currentUnixTimeStamp = Math.floor(new Date().getTime() / 1000);

      for (let i=0; i<stored.length; i++) {

        let strDate = stored[i].timestamp;
        let datasetUnixTimestamp =  this.GetUnixTimestampFromStr(strDate);

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
        let datasetUnixTimestamp =  this.GetUnixTimestampFromStr(strDate);

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
      let datasetUnixTimestamp = this.GetUnixTimestampFromStr(strDate);

      if (datasetUnixTimestamp>(currentUnixTimeStamp-timeFrame*60*60))
        filtered.push(this.loadedDatasets[i]);
    }

    return filtered;
  }


    // build bar chart data from filtered datasets
    buildBubbleChartData(timeFrame) {

      var datasets  = this.filterLoadedDatasets(timeFrame);
      var chartData = [],
          companys  = {},
          drivers   = [];

      for (let i=0; i<datasets.length; i++) {
        var key = datasets[i].company_id;

        if (companys.hasOwnProperty(key) && drivers.indexOf(datasets[i].driver_id))
          companys[key].NumDrivers++;
        else {
          companys[key] = {
            companyID: datasets[i].company_id,
            NumDrivers: 1
          };

          drivers.push(datasets[i].driver_id);
        }
      }

      for (let key in companys)
        if (companys.hasOwnProperty(key))
          chartData.push(companys[key]);

      return chartData;
    }


  // build bar chart data from filtered datasets
  buildBarChartData(timeFrame) {

    var datasets  = this.filterLoadedDatasets(timeFrame);
    var chartData = [],
        companys  = {},
        drivers   = [];

    for (let i=0; i<datasets.length; i++) {
      var key = datasets[i].company_id;

      if (companys.hasOwnProperty(key) && drivers.indexOf(datasets[i].driver_id))
        companys[key].NumDrivers++;
      else {
        companys[key] = {
          companyID: datasets[i].company_id,
          NumDrivers: 1
        };

        drivers.push(datasets[i].driver_id);
      }
    }

    for (let key in companys)
      if (companys.hasOwnProperty(key))
        chartData.push(companys[key]);

    return chartData;
  }


}

export default DataManager;
