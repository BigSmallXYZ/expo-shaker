import Shaker from './react-native-shaker-component'

import { Accelerometer } from 'expo-sensors'

const THRESHOLD = 200

function detectShake({ shakeTimes, capture }) {
  let shakesQuantity = 0
  let shakeTimeout = null
  let last_x = null
  let last_y = null
  let last_z = null
  let lastUpdate = 0
  Accelerometer.addListener(accelerometerData => {
      let {x, y, z} = accelerometerData;
      let currTime = Date.now();
      if ((currTime - lastUpdate) > 100) {
        let diffTime = (currTime - lastUpdate);
        lastUpdate = currTime;

        let speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000;

        if ( speed > THRESHOLD ) {
          if (shakeTimeout) clearTimeout(shakeTimeout)
          if (shakesQuantity >= (shakeTimes - 1)) {
            capture()
            shakesQuantity = 0
          } else {
            shakesQuantity += 1
            shakeTimeout = setTimeout(() => (shakesQuantity = 0), 1000)
          }
        }
        last_x = x;
        last_y = y;
        last_z = z;
      }
  });
}

export default function ShakerExtended (component, params) {
  return Shaker(component, {
    ...params,
    detectShakeFn: detectShake
  })
}
