'use strict';

var ONLY_URL = 'http://52.201.182.66';
var API_URL = 'http://52.201.182.66/api/v1';
// var API_URL = 'http://54.164.4.220/api/v1';
// var API_URL = 'http://10.100.3.24:3000/api/v1'; // Servidor Pablo

angular.module('minovateApp')

.factory('Token', function($log) {

	var token = localStorage.getItem('ls.token');
	if (token) {
		token = token.replace(/\"/g, "");
	}

	return {
		getToken: function() {
			return token;
		}
	};

})

// LOGIN
.factory('Login', function($resource) {

	return $resource(ONLY_URL + '/oauth/token', {}, {
		save: {
			method: 'POST'
		},
		headers: {
			'Content-Type': 'application/json'
		}
	});

})

// Invitaciones
.factory('Invitations', function($resource, Token) {

	return $resource(API_URL + '/invitations', {}, {
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				'Authorization': 'Bearer ' + Token.getToken()
			}
		}

	});

})

// InviteLink
.factory('InviteLink', function($resource, Token, $state) {

	return $resource(API_URL + '/invitations/:id', {
		id: '@id'
	}, {
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				'Authorization': 'Bearer ' + Token.getToken()
			},
			params: {
				confirmation_token: '@confirmation_token'
			}
		}

	});

})

// USUARIOS
.factory('Users', function($resource, Token) {

	return $resource(API_URL + '/users/:idUser', {
		idUser: '@idUser'
	}, {
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		},
		query: {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken()
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				'Authorization': 'Bearer ' + Token.getToken()
			},
		},
		delete: {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken()
			},
		},
		sendEmailWithToken: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		},
		verifyPassToken: {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken()
			},
			params: {
				email: '@email',
				reset_password_token: '@reset_password_token'
			}
		}
	});

})

// RESET PASS
.factory('ResetPassword', function($resource) {

	return $resource(API_URL + '/users/:idOrganization/password', {
		idOrganization: '@idOrganization'
	}, {
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});

})

// REPORTS
.factory('Reports', function($resource, Token) {

	return $resource(API_URL + '/reports', {}, {
		query: {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/json'
			},
			params: {
				'all': '@all',
				'filter[assigned_user_id]': '@assigned_user_id',
				'filter[creator_id]': '@creator_id',
				'page[number]': '@number',
				'page[size]': '@size'
			}
		}
	});

})

// ZONES
.factory('Zones', function($resource, Token) {

	return $resource(API_URL + '/zones/:zoneId', {
		zoneId: '@zoneId'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/vnd.api+json'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken()
			}
		}
	});

})

// DEALERS
.factory('Dealers', function($resource, Token) {

	return $resource(API_URL + '/dealers/:dealerId', {
		dealerId: '@dealerId'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/vnd.api+json'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken()
			}
		}
	});

})

// STORES
.factory('Stores', function($resource, Token) {

	return $resource(API_URL + '/stores', {}, {
		query: {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/json'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken()
			}
		}
	});

})

// PRODUCTS
.factory('Products', function($resource, Token) {

	return $resource(API_URL + '/top_list', {}, {
		query: {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken()
			}
		}
	});

})

// ROLES
.factory('Roles', function($resource, Token) {

	return $resource(API_URL + '/organizations/:idOrganization/roles', {
		idOrganization: '@idOrganization'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/json'
			}
		}
	});

})

// PROMOTIONS
.factory('Promotions', function($resource, Token) {

	return $resource(API_URL + '/promotions/:idPromotion', {
		idPromotion: '@idPromotion'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/json'
			},
			params: {
				include: '@include'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken()
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + Token.getToken(),
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});

});