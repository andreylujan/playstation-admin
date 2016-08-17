'use strict';

angular.module('minovateApp')

.factory('DataPlayStation', function($log, $q, Zones, Stores, Dealers, Users, Utils) {
	var storesIncluded = [],
		i = 0,
		j = 0;

	var getZones = function(e) {

		var defered = $q.defer();
		var promise = defered.promise;
		var zones = [];

		if (!e.success) {
			defered.reject({
				success: false,
				detail: e.detail,
				data: []
			});
			return;
		}

		Zones.query({}, function(success) {
			if (success.data) {
				zones.push({
					id: '',
					name: 'Todas las Zonas',
					dealersIds: []
				});
				angular.forEach(success.data, function(value, key) {
					zones.push({
						id: parseInt(value.id),
						name: value.attributes.name,
						dealersIds: value.attributes.dealer_ids
					});
				});
				defered.resolve({
					success: true,
					detail: 'OK',
					data: zones
				});
			} else {
				defered.reject({
					success: false,
					detail: success,
					data: []
				});
			}
		}, function(error) {
			if (error.status === 401) {
				Utils.refreshToken(getZones);
			} else {
				defered.reject({
					success: false,
					detail: error,
					data: []
				});
			}
		});
		return promise;
	};

	var getDealers = function(e, zoneSelected) {

		var defered = $q.defer();
		var promise = defered.promise;
		var dealers = [];
		storesIncluded = [];

		if (!e.success) {
			defered.reject({
				success: false,
				detail: e.detail,
				data: []
			});
			return;
		}

		Dealers.query({
			include: 'stores'
		}, function(success) {
			if (success.data && success.included) {

				storesIncluded = success.included;

				dealers.push({
					id: '',
					name: 'Todos los Dealers',
					storesIds: []
				});

				if (zoneSelected.id === '') {

					angular.forEach(success.data, function(dealer, key) {
						dealers.push({
							id: parseInt(dealer.id),
							name: dealer.attributes.name,
							storesIds: dealer.relationships.stores.data
						});
					});

					defered.resolve({
						success: true,
						detail: 'OK',
						data: dealers
					});

				} else {
					angular.forEach(zoneSelected.dealersIds, function(dealer, key) {
						angular.forEach(success.data, function(data, key) {
							if (dealer === parseInt(data.id)) {
								dealers.push({
									id: parseInt(data.id),
									name: data.attributes.name,
									storesIds: data.relationships.stores.data
								});
							}
						});
					});
					defered.resolve({
						success: true,
						detail: 'OK',
						data: dealers
					});
				}

			} else {
				defered.reject({
					success: false,
					detail: success,
					data: []
				});
			}
		}, function(error) {
			if (error.status === 401) {
				Utils.refreshToken(getDealers);
			} else {
				defered.reject({
					success: false,
					detail: error,
					data: []
				});
			}
		});
		return promise;
	};

	var getStores = function(e, zoneSelected, dealerSelected) {

		var defered = $q.defer();
		var promise = defered.promise;
		var stores = [];

		if (!e.success) {
			defered.reject({
				success: false,
				detail: e.detail,
				data: []
			});
			return;
		}


		if (zoneSelected.id === '' && dealerSelected.id === '') {
			Stores.query({}, function(success) {
				if (success.data) {

					stores.push({
						id: '',
						name: 'Todas las Tiendas'
					});

					for (var i = 0; i < success.data.length; i++) {
						stores.push({
							id: parseInt(success.data[i].id),
							name: success.data[i].attributes.name
						});
					}

					defered.resolve({
						success: false,
						detail: 'OK',
						data: stores
					});
				} else {
					defered.reject({
						success: false,
						detail: success,
						data: []
					});
				}
			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken(getStores);
				} else {
					defered.reject({
						success: false,
						detail: error,
						data: []
					});
				}
			});
		} else if (zoneSelected.id !== '' && dealerSelected.id === '') {
			Stores.query({
				'filter[zone_id]': zoneSelected.id
			}, function(success) {
				if (success.data) {

					stores.push({
						id: '',
						name: 'Todas las Tiendas'
					});

					for (var i = 0; i < success.data.length; i++) {
						stores.push({
							id: parseInt(success.data[i].id),
							name: success.data[i].attributes.name
						});
					}

					defered.resolve({
						success: false,
						detail: 'OK',
						data: stores
					});
				} else {
					defered.reject({
						success: false,
						detail: success,
						data: []
					});
				}
			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken(getStores);
				} else {
					defered.reject({
						success: false,
						detail: error,
						data: []
					});
				}
			});
		} else if (zoneSelected.id === '' && dealerSelected.id !== '') {
			Stores.query({
				'filter[dealer_id]': dealerSelected.id
			}, function(success) {
				if (success.data) {

					stores.push({
						id: '',
						name: 'Todas las Tiendas'
					});

					for (var i = 0; i < success.data.length; i++) {
						stores.push({
							id: parseInt(success.data[i].id),
							name: success.data[i].attributes.name
						});
					}

					defered.resolve({
						success: false,
						detail: 'OK',
						data: stores
					});
				} else {
					defered.reject({
						success: false,
						detail: success,
						data: []
					});
				}
			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken(getStores);
				} else {
					defered.reject({
						success: false,
						detail: error,
						data: []
					});
				}
			});
		} else {
			Stores.query({
				'filter[zone_id]': zoneSelected.id,
				'filter[dealer_id]': dealerSelected.id
			}, function(success) {
				if (success.data) {

					stores.push({
						id: '',
						name: 'Todas las Tiendas'
					});

					for (var i = 0; i < success.data.length; i++) {
						stores.push({
							id: parseInt(success.data[i].id),
							name: success.data[i].attributes.name
						});
					}

					defered.resolve({
						success: false,
						detail: 'OK',
						data: stores
					});
				} else {
					defered.reject({
						success: false,
						detail: success,
						data: []
					});
				}
			}, function(error) {
				$log.error(error);
				if (error.status === 401) {
					Utils.refreshToken(getStores);
				} else {
					defered.reject({
						success: false,
						detail: error,
						data: []
					});
				}
			});
		}

		return promise;
	};
	var getUsers = function(e) {

		var defered = $q.defer();
		var promise = defered.promise;
		var users = [];

		// Valida si el parametro e.success se seteó true para el refresh token
		if (!e.success) {
			defered.reject({
				success: false,
				detail: e.detail,
				data: []
			});
			return;
		}

		Users.query({}, function(success) {
			if (success.data) {

				users.push({
					id: '',
					fullName: 'Todos'
				});

				for (i = 0; i < success.data.length; i++) {
					if (success.data[i].attributes.active) {
						users.push({
							id: parseInt(success.data[i].id),
							fullName: success.data[i].attributes.first_name + ' ' + success.data[i].attributes.last_name
						});
					}
				}
				defered.resolve({
					success: true,
					detail: success,
					data: users
				});
			} else {
				defered.reject({
					success: false,
					detail: success,
					data: []
				});
			}
		}, function(error) {
			$log.log(error);
			if (error.status === 401) {
				Utils.refreshToken(getUsers);
			} else {
				defered.reject({
					success: false,
					detail: error,
					data: []
				});
			}
		});
		return promise;
	};

	return {
		getZones: getZones,
		getDealers: getDealers,
		getStores: getStores,
		getUsers: getUsers
	};

});