const cv = require('opencv4nodejs');

const getIntervalFromFps = (fps) => 1000 / fps;

module.exports = function(RED) {
  function CameraFeed(config) {
    RED.nodes.createNode(this, config);
    const cap = new cv.VideoCapture(config.devicePort);

    const intervalId = setInterval(() => {
      const frame = cap.read();
      const _msgid = RED.util.generateId();

      this.send({
        _msgid,
        payload: cv.imencode('.jpg', frame).toString('base64'),
      });

      cv.waitKey(1);
    }, getIntervalFromFps(config.fps));

    this.on('close', () => {
      cap.release();
      clearInterval(intervalId);
    });
  }
  RED.nodes.registerType('camera-feed', CameraFeed);
}
