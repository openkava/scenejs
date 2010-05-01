/**
 * Scene node that specifies the current viewing volume and projection matrix
 * @private
 */
SceneJS.frustum = function() {
    var cfg = SceneJS.getNodeConfig(arguments);

    return SceneJS.createNode(
            "frustum",
            cfg.children,

            new (function() {

                var transform;

                this._render = function(traversalContext, data) {
                    if (!transform || cfg.fixed) {    // Memoize matrix if node config is constant
                        var params = cfg.getParams(data);
                        var volume = {
                            xmin: params.left || -1.0,
                            xmax: params.right || 1.0,
                            ymin: params.bottom || -1.0,
                            ymax: params.top || 1.0,
                            zmin: params.near || 0.1,
                            zmax: params.far || 100.0
                        };
                        var tempMat = SceneJS_math_frustumMatrix4(
                                volume.xmin,
                                volume.xmax,
                                volume.ymin,
                                volume.ymax,
                                volume.zmin,
                                volume.zmax
                                );
                        transform = {
                            type: "frustum",
                            matrix: tempMat
                        };
                    }
                    var prevTransform = SceneJS_projectionModule.getTransform();
                    SceneJS_projectionModule.setTransform(transform);
                    this._renderNodes(traversalContext, data);
                    SceneJS_projectionModule.setTransform(prevTransform);
                };
            })());
};
