let getDistanceFromLatLonInKm = function (lat1, lon1, lat2, lon2) {
  let R = 6371
  let dLat = this.deg2rad(lat2 - lat1);
  let dLon = this.deg2rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;
  return Number((d * 1).toFixed(1));
}

let deg2rad = function (deg) {
  return deg * (Math.PI / 180)
}

module.exports = 
  getDistancegetDistanceFromLatLonInKm, deg2rad
