import alt from '../alt';
import $ from 'jquery';
import {
    assign,
    isEmpty
} from 'underscore';

class HomeActions {
  constructor() {
    this.generateActions(
      'getNewsStoriesSuccess',
      'getNewsStoriesFail'
    );
  }

  getNewsStories(){
    $.ajax({
      url: '/api/newsstories/getnewsstories/',
      type: 'GET'
    })
    .done((data) => {
      this.getNewsStoriesSuccess(data);
    })
    .fail((jqXhr) => {
      this.getNewsStoriesFail(jqXhr);
    })
    return true;
  }
}

export default alt.createActions(HomeActions);
