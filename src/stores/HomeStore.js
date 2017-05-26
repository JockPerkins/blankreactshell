import alt from '../alt';
import HomeActions from '../actions/HomeActions';

class HomeStore {
  constructor() {
    this.bindActions(HomeActions);
    this.newsstories = {};
  }

  onGetNewsStoriesSuccess(data) {
    this.newsstories = data;
  }

  onGetNewsStoriesFail(jqXhr) {
      toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(HomeStore);
