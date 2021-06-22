import L from 'leaflet';
import 'leaflet-draw';

import { customMarker, polygonDrawOption } from '../../../../utils/mapUtils';

class EditableGroup {
    constructor() {
        this.group = new L.FeatureGroup();
        this.editHandler = null;
        this.deleteHandler = null;
        this.drawControl = null;
        this.groupKey = '';
        this.paneString = '';
        this.onChangeLocation = () => null;
        this.onChangeShape = () => null;
    }

    initialize({
        map,
        groupKey,
        onChangeShape,
        onChangeLocation,
        geoJson,
        classNames,
        tooltipMessage,
    }) {
        this.createPane(map, groupKey, onChangeShape, onChangeLocation);
        this.addEvents(map, onChangeShape);
        this.addDrawControl(map);
        if (geoJson) {
            this.updateShape(geoJson, classNames, tooltipMessage);
        }
    }

    createPane(map, groupKey, onChangeShape, onChangeLocation) {
        this.groupKey = groupKey;
        this.onChangeLocation = onChangeLocation;
        this.onChangeShape = onChangeShape;
        this.paneString = `custom-shape-${groupKey}`;

        map.createPane(this.paneString);
        const drawPaneString = 'custom-shape-draw';
        const drawPane = map.getPane(drawPaneString);
        if (!drawPane) {
            map.createPane(drawPaneString);
        }
    }

    addShape(map, className) {
        new L.Draw.Polygon(
            map,
            polygonDrawOption(className, this.groupKey),
        ).enable();
    }

    addEvents(map) {
        map.on('draw:created', e => {
            if (e.layerType === 'marker') {
                this.onChangeLocation(e.layer.getLatLng());
                this.toggleDrawMarker(false);
                map.removeLayer(e.layer);
            } else if (
                e.layerType === 'polygon' &&
                e.layer.options.className.includes(this.groupKey)
            ) {
                e.layer.addTo(this.group);
                this.onChangeShape(this.getGeoJson());
            }
        });
    }

    addDrawControl(map) {
        const options = {
            position: 'topright',
            draw: {
                polyline: false,
                polygon: false,
                circle: false,
                marker: {
                    icon: customMarker,
                },
                circlemarker: false,
                featureGroup: this.group,
                rectangle: false,
            },
            edit: {
                edit: true,
                featureGroup: this.group,
                remove: true,
            },
        };

        const drawControl = new L.Control.Draw(options);
        map.addControl(drawControl);
        map.addLayer(this.group);
        const editToolbar = new L.EditToolbar({
            featureGroup: this.group,
        });
        const editHandler = editToolbar.getModeHandlers()[0].handler;
        const deleteHandler = editToolbar.getModeHandlers()[1].handler;
        editHandler._map = map;
        deleteHandler._map = map;
        this.editHandler = editHandler;
        this.deleteHandler = deleteHandler;
        this.drawControl = drawControl;
    }

    toggleDrawMarker(isEnabled) {
        if (isEnabled) {
            this.drawControl._toolbars.draw._modes.marker.handler.enable();
        } else {
            this.drawControl._toolbars.draw._modes.marker.handler.disable();
        }
    }

    toggleEditShape(map, editEnabled) {
        const pane = map.getPane(this.paneString);
        if (editEnabled) {
            pane.style.zIndex = 500;
            this.editHandler.enable();
        } else {
            this.onChangeShape(this.getGeoJson());
            pane.style.zIndex = 400;
            this.editHandler.disable();
        }
    }

    toggleDeleteShape(map, deleteEnabled) {
        const pane = map.getPane(this.paneString);
        if (deleteEnabled) {
            pane.style.zIndex = 500;
            this.deleteHandler.enable();
        } else {
            this.onChangeShape(this.getGeoJson());
            pane.style.zIndex = 400;
            this.deleteHandler.disable();
        }
    }

    clearLayers() {
        this.group.clearLayers();
    }

    reset(map) {
        this.clearLayers();
        this.toggleEditShape(map, false);
        this.toggleDeleteShape(map, false);
    }

    updateShape(geoJson, classNames, tooltipMessage) {
        this.clearLayers();
        const { group } = this;
        if (geoJson) {
            geoJson.eachLayer(layer => {
                const tempLayer = layer;
                const options = {
                    className: `editable-pane ${this.groupKey} ${classNames}`,
                    pane: this.paneString,
                };
                if (tempLayer.feature.geometry.type === 'MultiPolygon') {
                    tempLayer.feature.geometry.coordinates.forEach(
                        shapeCoords => {
                            const polygon = {
                                type: 'Polygon',
                                coordinates: shapeCoords,
                            };
                            L.geoJson(polygon, {
                                onEachFeature(feature, newLayer) {
                                    L.setOptions(newLayer, options);
                                    if (tooltipMessage) {
                                        newLayer.bindTooltip(tooltipMessage, {
                                            sticky: true,
                                        });
                                    }
                                    newLayer.addTo(group);
                                },
                            });
                        },
                    );
                } else {
                    L.setOptions(tempLayer, options);
                    tempLayer.addTo(group);
                }
            });
        }
    }

    getGeoJson() {
        if (this.group.getLayers().length === 0) return null;
        const geojsonData = this.group.toGeoJSON();
        const multiPolygon = {
            type: 'MultiPolygon',
            coordinates: [],
            properties: {},
        };
        const { features } = this.group.toGeoJSON();
        features.forEach(feature => {
            multiPolygon.coordinates.push([feature.geometry.coordinates[0]]);
        });
        geojsonData.features = [
            {
                type: 'Feature',
                properties: {},
                geometry: multiPolygon,
            },
        ];
        geojsonData.features[0].geometry = multiPolygon;
        return geojsonData;
    }
}
export default EditableGroup;
