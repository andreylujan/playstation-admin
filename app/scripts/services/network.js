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

// Invitaciones
.factory('Invitations', function($resource, Token) {

	return $resource(API_URL + '/invitations', {}, {
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
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
				Accept: 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json',
			},
		},
		delete: {
			method: 'DELETE',
			headers: {},
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
				Accept: 'application/vnd.api+json'
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
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
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
				// 'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {}
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
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {}
		}
	});

})

// STORES
.factory('Stores', function($resource, Token) {

	return $resource(API_URL + '/stores/:storeId', {
		storeId: '@storeId'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {}
		}
	});

})

// PRODUCTS
.factory('Products', function($resource, Token) {

	return $resource(API_URL + '/products/:idProduct', {
		idProduct: '@idProduct'
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include'
			}
		},
		save: {
			method: 'POST',
			headers: {
				'Accept': 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Accept': 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {
				'Accept': 'application/vnd.api+json'
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
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
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
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});

})

// PRODUCT TYPES
.factory('ProductTypes', function($resource, Token) {

	return $resource(API_URL + '/product-types', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// PRODUCT DESTINATIONS
.factory('ProductDestinations', function($resource, Token) {

	return $resource(API_URL + '/product-classifications', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// PLATFORMS
.factory('ReportTypes', function($resource, Token) {

	return $resource(API_URL + '/organizations/:idOrganization/report-types', {
		idOrganization: ':idOrganization'
	}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// REPORT TYPES
.factory('Platforms', function($resource, Token) {

	return $resource(API_URL + '/platforms', {}, {
		query: {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.api+json'
			}
		}
	});

})

// INBOX
.factory('Inbox', function($resource) {

	return $resource(API_URL + '/inbox/:idInbox', {
		idInbox: '@idInbox'
	}, {
		query: {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/vnd.api+json'
			},
			params: {
				include: '@include'
			}
		},
		delete: {
			method: 'DELETE',
			headers: {}
		},
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		},
		update: {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/vnd.api+json'
			}
		}
	});

})

// FILES
.factory('Files', function($resource, Token) {

	return $resource(API_URL + '/images', {}, {
		save: {
			method: 'POST',
			headers: {
				'Content-Type': 'application/vnd.api+json',
				Accept: 'application/vnd.api+json'
			}
		}
	});

});