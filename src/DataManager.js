class DataManager {

  constructor() {
    this.datasets = JSON.parse(localStorage.getItem('datasets'));

    if (this.datasets==null)
      this.datasets = [];
  }

  SaveDataset(dataStr) {
    this.datasets.push(JSON.parse(dataStr));
    localStorage.setItem('datasets', JSON.stringify(this.datasets));
  }

}

export default DataManager;
