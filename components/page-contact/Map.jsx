import React from 'react';

function Map() {
  return (
    <div className="google-map">
      <iframe
        id="gmap_canvas"
        src="https://maps.google.com/maps?q=Bojongsoang,%20Bandung&t=&z=13&ie=UTF8&iwloc=&output=embed"
        style={{ filter: 'grayscale(100%) invert(90%)' }}
      ></iframe>
    </div>
  );
}

export default Map;
