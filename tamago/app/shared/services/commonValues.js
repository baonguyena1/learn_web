'use strict';
tamagoApp.factory('commonValues', [function() {
	// this.displayName = 'empty';
	this.linkAvatar = './assets/img/icons/default_avatar.png';
	var data = {
        key: '',
        value: ''
    };
	return {
		setRole: function( role ) {
		  localStorage.role = role;
		},
		getRole: function() {
		  return localStorage.role;
		},
	  setAccessToken: function(token) {
	  	localStorage.accessToken = token;
	  },
	  getAccessToken: function() {
	  	return localStorage.accessToken;
	  },
	  setUserName: function(userName) {
	  	localStorage.userName = userName;
	  },
	  getUserName: function() {
	  	return localStorage.userName;
	  },
	  setUserAvatar: function(userAvatar) {
	  	localStorage.userAvatar = userAvatar;
	  },
	  getUserAvatar: function() {
	  	return localStorage.userAvatar;
	  },
	  setUserId: function(userId) {
	  	localStorage.userId = userId;
	  },
	  getUserId: function() {
	  	return localStorage.userId;
	  },
	  removeAccessToken: function(){
	  	delete localStorage.accessToken;
	  },
      getCanCreateProject: function() {
	  	return localStorage.canCreateProject;
	  },
	  setCanCreateProject: function(canCreateProject) {
      if (canCreateProject) {
        localStorage.canCreateProject = 1;
      }
      else {
        localStorage.canCreateProject = 0;
      }

	  },
      getCanCreateMainTask: function() {
	  	return localStorage.canCreateMainTask;
	  },
	  setCanCreateMainTask: function(canCreateMainTask) {
	      console.log("canCreateMainTask:" + canCreateMainTask);
	      if (canCreateMainTask) {
	        localStorage.canCreateMainTask = 1;
	      }
	      else {
	        localStorage.canCreateMainTask = 0;
	      }
	  },
	  setData: function(key, value){
	  	data.key = key;
	  	data.value = value;
	  },
	  getData: function(){
	  	return data;
	  },
    setObject: function(key, object) {
      localStorage.setItem(key, JSON.stringify(object));
    },
    getObject: function(key) {
      var result = localStorage.getItem(key);
      if (result) {
        return JSON.parse(result);
      }
      else {
        return null;
      }
    },
	  removeData: function(){
	  	data = {
		    key: '',
		    value: ''
		};
	  }
	};

}]);
