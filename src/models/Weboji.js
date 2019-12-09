import { trimStart } from 'lodash'

const Handsfree = window.Handsfree

/**
 * Load the Weboji library
 * @see https://github.com/jeeliz/jeelizWeboji
 */
Handsfree.prototype.loadWebojiDependencies = function() {
  if (!this.model.head.sdk) {
    this.loadAndWait(
      [trimStart(Handsfree.libSrc + 'models/jeelizFaceTransfer.js', '/')],
      () => {
        this.bindWeboji()
      }
    )
  } else {
    this.bindWeboji()
  }
}

/**
 * Bind the SDK classes to handsfree properties
 */
Handsfree.prototype.bindWeboji = function() {
  this.model.head.sdk = window.JEEFACETRANSFERAPI
  this.model.head.sdkHelper = window.JEELIZ_RESIZER
}

/**
 * Maybe starts Weboji, looping until dependencies are loaded
 */
Handsfree.prototype.maybeStartWeboji = function() {
  if (!this.model.head.sdk) {
    setTimeout(() => {
      this.maybeStartWeboji()
    }, 10)
  } else {
    this.loadWebojiModel()
  }
}

/**
 * Initializes the head tracker SDK
 */
Handsfree.prototype.loadWebojiModel = function() {
  const url = trimStart(
    Handsfree.libSrc + 'models/jeelizFaceTransferNNC.json',
    '/'
  )
  document.body.classList.add('handsfree-loading')
  fetch(url)
    .then((model) => {
      return model.json()
    })
    // Next, let's initialize the head tracker API
    .then((model) => {
      this.model.head.sdkHelper.size_canvas({
        canvasId: `handsfree-canvas-${this.id}`,
        callback: (videoSettings) => {
          this.model.head.sdk.init({
            canvasId: `handsfree-canvas-${this.id}`,
            NNCpath: JSON.stringify(model),
            videoSettings,
            callbackReady: () => {
              document.body.classList.remove('handsfree-loading')
              this.model.head.loaded = true
              this.maybeStartTracking()
            }
          })
        }
      })
    })
    .catch(() => console.error(`Couldn't load head tracking model at ${url}`))
}

/**
 * Runs inference with weboji
 */
Handsfree.prototype.inferWeboji = function() {
  // Head [yaw, pitch, roll]
  this.head.rotation = this.model.head.sdk.get_rotationStabilized()
  // Head [x, y, scale]
  this.head.translation = this.model.head.sdk.get_positionScale()
  // [0...10] Morphs between 0 - 1
  this.head.morphs = this.model.head.sdk.get_morphTargetInfluencesStabilized()
}