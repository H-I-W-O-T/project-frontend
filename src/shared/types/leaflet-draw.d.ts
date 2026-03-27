// src/types/leaflet-draw.d.ts
declare module 'leaflet-draw' {
  import * as L from 'leaflet';

  namespace LeafletDraw {
    interface DrawOptions {
      position?: string;
      draw?: {
        polygon?: any;
        rectangle?: any;
        circle?: any;
        marker?: any;
        polyline?: any;
        circlemarker?: any;
      };
      edit?: {
        featureGroup: L.FeatureGroup;
        remove?: boolean;
        edit?: boolean;
      };
    }

    class Control {
      static Draw: new (options: DrawOptions) => L.Control;
    }
  }

  export = LeafletDraw;
}