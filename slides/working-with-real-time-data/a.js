/* globals L */
/* jshint camelcase: false */

var script = document.createElement('script');
var App;
var NPMap;

App = {
  changeType: function (value) {
    if (value !== App.type) {
      App.type = value;
      NPMap.config.overlays[0].L.eachLayer(function (road) {
        var style = {
          weight: 3
        };

        if (road.feature.properties[App.type] === true) {
          style.color = '#00b22d';
        } else {
          style.color = '#ff191e';
        }

        road.setStyle(style);
      });
    }
  },
  get: function (overlay, npmapId) {
    var layers = App[overlay];
    var results = [];

    if (layers.length) {
      for (var i = 0; i < layers.length; i++) {
        var properties = layers[i].feature.properties;

        if (properties.npmap_id === npmapId) {
          results.push(properties);
        }
      }
    }

    return results;
  },
  getYesNo: function (value) {
    var html = '<span style="color:';

    if (!value) {
      html += '#ff191e;">No';
    } else {
      html += '#00b22d;">Yes';
    }

    return html + '</span>';
  },
  handleReady: function () {
    App[this.options.name.toLowerCase()] = this.getLayers();
    App.ready++;
  },
  construction: [],
  hasOverSnow: false,
  incidents: [],
  inside: false,
  messages: [],
  ready: 0,
  roads: [],
  snowplows: [],
  type: 'public_open_to_wheeled_vehicles'
};
NPMap = {
  baseLayers: [{
    clickable: false,
    id: 'nps.a6be40f0,nps.c8ae09d5',
    type: 'mapbox'
  }],
  center: {
    lat: 44.52392653654215,
    lng: -110.38650512695312
  },
  div: 'map',
  fullscreenControl: true,
  hooks: {
    init: function (callback) {
      var interval;

      function ready () {
        var html = '' +
          '<div style="font-size:85%;min-width:100px;">' +
            '<ul>' +
              '<li style="height:28px;">' +
                '<img src="https://www.nps.gov/npmap/dev/yell/live/roads/assets/img/green.png" style="height:3px;margin-bottom:3px;margin-right:1px;width:25px;"> Open' +
              '</li>' +
              '<li style="height:28px;">' +
                '<img src="https://www.nps.gov/npmap/dev/yell/live/roads/assets/img/red.png" style="height:3px;margin-bottom:3px;margin-right:1px;width:25px;"> Closed' +
              '</li>' +
            '' +
          '' +
        '';

        for (var i = 0; i < App.roads.length; i++) {
          var properties = App.roads[i].feature.properties;

          if (properties.admin_open_to_oversnow_vehicles || properties.public_open_to_oversnow_vehicles) {
            App.hasOverSnow = true;
            break;
          }
        }

        if (App.construction.length) {
          html += '' +
            '<li>' +
              '<div style="height:30px;margin-left:3px;width:20px;">' +
                '<img src="https://www.nps.gov/npmap/dev/yell/live/roads/assets/img/construction.png" style="width:18px;">' +
                '<span style="float:left;margin-left:27px;margin-top:-48px;">Construction</span>' +
              '</div>' +
            '</li>' +
          '';
        }

        if (App.incidents.length) {
          html += '' +
            '<li>' +
              '<div style="height:30px;margin-left:3px;width:20px;">' +
                '<img src="https://www.nps.gov/npmap/dev/yell/live/roads/assets/img/incidents.png" style="width:18px;">' +
                '<span style="float:left;margin-left:27px;margin-top:-48px;">Incidents</span>' +
              '</div>' +
            '</li>' +
          '';
        }

        if (App.snowplows.length) {
          html += '' +
            '<li>' +
              '<div style="height:30px;margin-left:3px;width:20px;">' +
                '<img src="https://www.nps.gov/npmap/dev/yell/live/roads/assets/img/snowplows.png" style="width:18px;">' +
                '<span style="float:left;margin-left:27px;margin-top:-48px;">Snowplows</span>' +
              '</div>' +
            '</li>' +
          '';
        }

        html += '' +
          '' +
            '</ul>' +
          '</div>' +
        '';

        if (App.inside) {
          html += '<form style="font-size:85%;">';

          if (App.hasOverSnow) {
            // Show both wheeled and over-snow for public and admin.
            html += '' +
              '<fieldset>' +
                '<legend style="font-size:130%;margin-bottom:0;">Public</legend>' +
                '<div class="radio">' +
                  '<label>' +
                    '<input type="radio" name="closure-types" onclick="App.changeType(this.value);" value="public_open_to_wheeled_vehicles" checked>' +
                    ' Wheeled Vehicles' +
                  '</label>' +
                '</div>' +
                '<div class="radio" style="margin-bottom:0;">' +
                  '<label>' +
                    '<input type="radio" name="closure-types" onclick="App.changeType(this.value);" value="public_open_to_oversnow_vehicles">' +
                    ' Over-snow Vehicles' +
                  '</label>' +
                '</div>' +
              '</fieldset>' +
              '<fieldset style="margin-top:10px;">' +
                '<legend style="font-size:130%;margin-bottom:0;">Admin Travel</legend>' +
                '<div class="radio">' +
                  '<label>' +
                    '<input type="radio" name="closure-types" onclick="App.changeType(this.value);" value="admin_open_to_wheeled_vehicles">' +
                    ' Wheeled Vehicles' +
                  '</label>' +
                '</div>' +
                '<div class="radio" style="margin-bottom:0;">' +
                  '<label>' +
                    '<input type="radio" name="closure-types" onclick="App.changeType(this.value);" value="admin_open_to_oversnow_vehicles">' +
                    ' Over-snow Vehicles' +
                  '</label>' +
                '</div>' +
              '</fieldset>' +
            '';
          } else {
            // Show wheeled for public and admin.
            html += '' +
              '<fieldset>' +
                '<legend style="font-size:130%;margin-bottom:0;">Public</legend>' +
                '<div class="radio">' +
                  '<label>' +
                    '<input type="radio" name="closure-types" onclick="App.changeType(this.value);" value="public_open_to_wheeled_vehicles" checked>' +
                    ' Wheeled Vehicles' +
                  '</label>' +
                '</div>' +
              '</fieldset>' +
              '<fieldset style="margin-top:10px;">' +
                '<legend style="font-size:130%;margin-bottom:0;">Admin Travel</legend>' +
                '<div class="radio" style="margin-bottom:0;">' +
                  '<label>' +
                    '<input type="radio" name="closure-types" onclick="App.changeType(this.value);" value="admin_open_to_wheeled_vehicles">' +
                    ' Wheeled Vehicles' +
                  '</label>' +
                '</div>' +
              '</fieldset>' +
            '';
          }

          html += '</form>';
        } else if (App.hasOverSnow) {
          // Show both wheeled and over-snow for public.
          html += '' +
            '<form>' +
              '<div class="radio">' +
                '<label>' +
                  '<input type="radio" name="closure-types" onclick="App.changeType(this.value);" value="public_open_to_wheeled_vehicles" checked>' +
                  ' Wheeled Vehicles' +
                '</label>' +
              '</div>' +
              '<div class="radio" style="margin-bottom:0;">' +
                '<label>' +
                  '<input type="radio" name="closure-types" onclick="App.changeType(this.value);" value="public_open_to_oversnow_vehicles">' +
                  ' Over-snow Vehicles' +
                '</label>' +
              '</div>' +
            '</form>' +
          '';
        }

        L.npmap.util._.getElementsByClassName('leaflet-control-legend')[0].innerHTML = html;
        callback();
      }
      // TODO: Should this be moved to core NPMap.js? Seems like a useful function for other apps.
      function testInside () {
        var util = L.npmap.util._;

        if (util.supportsCors()) {
          util.reqwest({
            crossOrigin: true,
            error: ready,
            success: function (response) {
              if (response && response.success) {
                App.inside = true;
              }

              ready();
            },
            type: 'json',
            url: 'http://insidemaps.nps.gov/test/inside'
          });
        } else {
          var done = false;
          var time = 0;
          var interval;

          interval = setInterval(function () {
            if (done === true) {
              clearInterval(interval);
              ready();
            } else {
              time++;

              // Time out at 1.5 seconds.
              if (time >= 15) {
                clearInterval(interval);
                ready();
              }
            }
          }, 100);
          // TODO: Pull this from NPMap.js.
          L.npmap.util._.reqwest({
            success: function (response) {
              if (response && response.success) {
                App.inside = true;
              }

              done = true;
            },
            type: 'jsonp',
            url: 'http://insidemaps.nps.gov/test/inside?callback=?'
          });
        }
      }

      interval = setInterval(function () {
        if (App.ready === 4) {
          clearInterval(interval);
          L.npmap.util._.reqwest({
            success: function (response) {
              if (response.data && response.data.rows && response.data.rows.length) {
                App.messages = response.data.rows;
              }

              testInside();
            },
            type: 'jsonp',
            url: 'https://nps-yell.cartodb.com/api/v2/sql?q=SELECT message,npmap_id FROM road_messages WHERE archived=false&callback=?'
          });
        }
      }, 100);
    }
  },
  legendControl: {
    position: 'bottomright'
  },
  mapId: '44154b24-1df3-4025-9949-7afeb35bcfe4',
  maxZoom: 13,
  minZoom: 9,
  overlays: [{
    attribution: 'Yellowstone National Park',
    events: [{
      fn: App.handleReady,
      type: 'ready'
    }],
    name: 'Roads',
    popup: function (data) {
      var html = '<div class="title">' + data.name;
      var npmapId = data.npmap_id;

      if (data.name_segment) {
        html += '<br>' + data.name_segment;
      }

      html += '</div><div class="content"><div class="description"><p>Road Status:</p>';

      if (App.inside) {
        if ((data.admin_open_to_oversnow_vehicles && data.admin_open_to_wheeled_vehicles) || (data.public_open_to_oversnow_vehicles && data.public_open_to_wheeled_vehicles)) {
          // Show both oversnow and wheeled for public and inside.
          html += '' +
            '<ul>' +
              '<li>Public:<ul style="margin-bottom:0;">' +
                '<li>Wheeled Vehicles: ' + App.getYesNo(data.public_open_to_wheeled_vehicles) + '</li>' +
                '<li>Over-snow Vehicles: ' + App.getYesNo(data.public_open_to_oversnow_vehicles) + '</li>' +
              '</ul></li>' +
              '<li>Admin Travel:<ul style="margin-bottom:0;">' +
                '<li>Wheeled Vehicles: ' + App.getYesNo(data.admin_open_to_wheeled_vehicles) + '</li>' +
                '<li>Over-snow Vehicles: ' + App.getYesNo(data.admin_open_to_oversnow_vehicles) + '</li>' +
              '</ul></li>' +
            '</ul>' +
          '';
        } else {
          // Show only wheeled for public and inside.
          html += '' +
            '<ul>' +
              '<li>Public:<ul style="margin-bottom:0;">' +
                '<li>Wheeled Vehicles: ' + App.getYesNo(data.public_open_to_wheeled_vehicles) + '</li>' +
              '</ul></li>' +
              '<li>Admin Travel:<ul style="margin-bottom:0;">' +
                '<li>Wheeled Vehicles: ' + App.getYesNo(data.admin_open_to_wheeled_vehicles) + '</li>' +
              '</ul></li>' +
            '</ul>' +
          '';
        }
      } else {
        if (data.public_open_to_oversnow_vehicles && data.public_open_to_wheeled_vehicles) {
          // Show both oversnow and wheeled for public.
          html += '' +
            '<ul>' +
              '<li>Wheeled Vehicles: ' + App.getYesNo(data.public_open_to_wheeled_vehicles) + '</li>' +
              '<li>Over-snow Vehicles: ' + App.getYesNo(data.public_open_to_oversnow_vehicles) + '</li>' +
            '</ul>' +
          '';
        } else {
          // Show only wheeled for public.
          html += '' +
            '<ul>' +
              '<li>Wheeled Vehicles: ' + App.getYesNo(data.public_open_to_wheeled_vehicles) + '</li>' +
            '</ul>' +
          '';
        }
      }

      if (App.inside || (data.public_open_to_oversnow_vehicles || data.public_open_to_wheeled_vehicles)) {
        var messages = App.get('messages', npmapId);
        var i;

        if (messages.length) {
          html += '<p>Messages:</p><ul>';

          for (i = 0; i < messages.length; i++) {
            html += '<li>' + messages[i] + '</li>';
          }

          html += '</ul>';
        }
      }

      return html;
    },
    styles: {
      line: function (data) {
        var style = {
          'stroke-width': 3
        };

        if (data[App.type]) {
          style.stroke = '#00b22d';
        } else {
          style.stroke = '#ff191e';
        }

        return style;
      }
    },
    type: 'geojson',
    url: 'https://nps-yell.cartodb.com/api/v2/sql?q=SELECT roads.name,roads.name_segment,roads.npmap_id,roads.the_geom,road_statuses.cartodb_id,road_statuses.admin_open_to_oversnow_vehicles,road_statuses.admin_open_to_wheeled_vehicles,road_statuses.public_open_to_oversnow_vehicles,road_statuses.public_open_to_wheeled_vehicles FROM roads,road_statuses WHERE road_statuses.archived=false AND roads.npmap_id=road_statuses.npmap_id&cb=' + new Date().getTime() + '&format=geojson'
  }, {
    attribution: 'Yellowstone National Park',
    events: [{
      fn: App.handleReady,
      type: 'ready'
    }],
    name: 'Incidents',
    popup: {
      description: '{{type}}',
      title: '{{name}}{{#if name_segment}}<br>({{name_segment}}){{/if}}'
    },
    styles: {
      point: {
        'marker-color': 'ff9a03',
        'marker-size': 'small'
      }
    },
    type: 'geojson',
    url: 'https://nps-yell.cartodb.com/api/v2/sql?q=SELECT roads.name,roads.npmap_id,roads.name_segment,road_incidents.cartodb_id,road_incidents.the_geom,road_incidents.type FROM roads,road_incidents WHERE road_incidents.archived=false AND roads.npmap_id=road_incidents.npmap_id&cb=' + new Date().getTime() + '&format=geojson'
  }, {
    attribution: 'Yellowstone National Park',
    events: [{
      fn: App.handleReady,
      type: 'ready'
    }],
    name: 'Snowplows',
    popup: {
      description: function (data) {
        if (!data.message || data.message === 'null') {
          return 'No message.';
        } else {
          return data.message;
        }
      },
      title: '{{name}}{{#if name_segment}}<br>({{name_segment}}){{/if}}'
    },
    styles: {
      point: {
        'marker-color': '68a7f9',
        'marker-size': 'small'
      }
    },
    type: 'geojson',
    url: 'https://nps-yell.cartodb.com/api/v2/sql?q=SELECT roads.name,roads.npmap_id,roads.name_segment,road_snowplows.cartodb_id,road_snowplows.the_geom,road_snowplows.message FROM roads,road_snowplows WHERE road_snowplows.archived=false AND roads.npmap_id=road_snowplows.npmap_id&cb=' + new Date().getTime() + '&format=geojson'
  }, {
    attribution: 'Yellowstone National Park',
    events: [{
      fn: App.handleReady,
      type: 'ready'
    }],
    name: 'Construction',
    popup: {
      description: function (data) {
        if (!data.message || data.message === 'null') {
          return 'No message.';
        } else {
          return data.message;
        }
      },
      title: '{{name}}{{#if name_segment}}<br>({{name_segment}}){{/if}}'
    },
    styles: {
      point: {
        'marker-color': 'fec44f',
        'marker-size': 'small'
      }
    },
    type: 'geojson',
    url: 'https://nps-yell.cartodb.com/api/v2/sql?q=SELECT roads.name,roads.npmap_id,roads.name_segment,road_construction.cartodb_id,road_construction.the_geom,road_construction.message FROM roads,road_construction WHERE road_construction.archived=false AND roads.npmap_id=road_construction.npmap_id&cb=' + new Date().getTime() + '&format=geojson'
  }, {
    attribution: 'Yellowstone National Park',
    name: 'Destinations',
    popup: {
      description: '' +
        '{{#if to}}' +
          '<p>Average drive time:</p><ul>' +
          '{{#each to}}' +
            '<li>To {{name}}: <strong>{{time}}</strong></li>' +
          '{{/each}}' +
          '</ul>' +
        '{{/if}}' +
      '',
      title: '{{name}}'
    },
    styles: {
      point: {
        iconAnchor: [
          5,
          5
        ],
        iconRetinaUrl: 'https://www.nps.gov/npmap/dev/yell/live/assets/img/black-dot@2x.png',
        iconSize: [
          10,
          10
        ],
        iconUrl: 'https://www.nps.gov/npmap/dev/yell/live/assets/img/black-dot.png',
        popupAnchor: [
          2,
          -5
        ]
      }
    },
    type: 'geojson',
    url: 'https://nationalparkservice.github.io/data/projects/yellowstone_national_park/live/yellowstone_destinations.geojson'
  }],
  scaleControl: true,
  scrollWheelZoom: false,
  zoom: 9
};

script.src = 'https://www.nps.gov/lib/npmap.js/3.0.7/npmap-bootstrap.min.js';
document.body.appendChild(script);
