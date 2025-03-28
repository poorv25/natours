/* eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicG9vcnYiLCJhIjoiY203eG8zODAyMDE2NTJqczZqMGFxYW4yeiJ9.HV9FVbxK_gJX7FOczh94Qg';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    //   center: [-74.5, 40], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    //   zoom: 1, // starting zoom
    style: 'mapbox://styles/poorv/cm7xowma600pv01s52pfocsvg',
    scrollZoom: false,
    //   center: [75.8577, 22.7196],
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';
    //  Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
