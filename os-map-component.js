// NorfolkWild OS Map Component
// Uses OS Maps API (Raster Tiles) via Leaflet.js
// API Key: stored in page, rate limited to 5000 tile requests/month on free tier

window.NorfolkWildMap = function(containerId, options) {
  const defaults = {
    lat: 52.9429,
    lng: 1.2157,
    zoom: 14,
    apiKey: 'i4QbC3ganhj7geOEoAqC2Lr3Gj7UGdwE',
    route: [],       // array of [lat, lng] pairs
    waypoints: [],   // array of {lat, lng, title, desc}
    style: 'Outdoor' // OS style: Outdoor, Road, Light
  };
  
  const cfg = Object.assign({}, defaults, options);
  
  // OS Maps API tile URL
  const tileUrl = `https://api.os.uk/maps/raster/v1/zxy/${cfg.style}_3857/{z}/{x}/{y}.png?key=${cfg.apiKey}`;
  
  const map = L.map(containerId, {
    center: [cfg.lat, cfg.lng],
    zoom: cfg.zoom,
    zoomControl: true,
    scrollWheelZoom: false
  });
  
  // OS tile layer
  L.tileLayer(tileUrl, {
    maxZoom: 20,
    attribution: '© Crown copyright and database rights ' + new Date().getFullYear() + ' OS (100025252)'
  }).addTo(map);
  
  // Draw route if provided
  if (cfg.route && cfg.route.length > 1) {
    L.polyline(cfg.route, {
      color: '#b8923a',
      weight: 4,
      opacity: 0.9,
      lineJoin: 'round'
    }).addTo(map);
    
    // Start marker
    L.circleMarker(cfg.route[0], {
      radius: 8, fillColor: '#1e3528', color: '#fff',
      weight: 2, opacity: 1, fillOpacity: 1
    }).bindPopup('<strong>Start</strong>').addTo(map);
    
    // End marker
    const end = cfg.route[cfg.route.length - 1];
    L.circleMarker(end, {
      radius: 8, fillColor: '#b8923a', color: '#fff',
      weight: 2, opacity: 1, fillOpacity: 1
    }).bindPopup('<strong>Finish</strong>').addTo(map);
  }
  
  // Custom icon for waypoints
  const waypointIcon = L.divIcon({
    html: '<div style="background:#1e3528;color:#c9a84c;width:28px;height:28px;border-radius:50%;border:2px solid #c9a84c;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;font-family:sans-serif;box-shadow:0 2px 6px rgba(0,0,0,0.3);">📍</div>',
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 28]
  });
  
  // Add waypoints
  if (cfg.waypoints && cfg.waypoints.length) {
    cfg.waypoints.forEach(function(wp) {
      L.marker([wp.lat, wp.lng], { icon: waypointIcon })
        .bindPopup('<strong>' + wp.title + '</strong>' + (wp.desc ? '<br><span style="font-size:0.8rem;color:#4a6358;">' + wp.desc + '</span>' : ''))
        .addTo(map);
    });
  }
  
  // Enable scroll zoom on click
  map.on('click', function() { map.scrollWheelZoom.enable(); });
  map.on('mouseout', function() { map.scrollWheelZoom.disable(); });
  
  return map;
};
