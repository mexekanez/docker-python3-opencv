const path = require('path');
const { spawn } = require('child_process');

module.exports = function(RED) {
  function VaObjectDetector(config) {
    RED.nodes.createNode(this, config);

    const state = {
      readyToProcessImage: true,
    };

    this.on('input', (msg) => {
      if (!state.readyToProcessImage) return;

      state.readyToProcessImage = false;

      const script = spawn('python', [
        path.join(__dirname, 'src', 'object_detect.py'),
        '-m', 'YOLO_V3',
      ]);
      script.stdin.write(msg.payload);
      script.stdin.end();
      script.stdout.on('data', (data) => {
        if (data.length < 3) return; // ignore newlines

        msg.payload = data;
        this.send(msg);
      });
      script.stdout.on('close', () => {
        state.readyToProcessImage = true;
      });
      script.stderr.on('data', (err) => {
        this.error(err);
      });
    });
  }
  RED.nodes.registerType('va-object-detector', VaObjectDetector);
}
