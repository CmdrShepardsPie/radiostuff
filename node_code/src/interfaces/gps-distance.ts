declare module "gps-distance" {
  namespace gpsDistance {
    type Point = [number, number];
  }

  function gpsDistance(fromLat: number | gpsDistance.Point[], fromLon?: number, toLat?: number, toLon?: number): number;

  export = gpsDistance;
}
