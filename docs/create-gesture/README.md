---
sidebarDepth: 2
---
# 🖖 Create Gesture

<div class="row align-top">
  <div class="col-6"><div></div></div>
  <div class="col-6">
    <Window title="Core gestures">
      <section>
        <p>Select a model below to try one of the core gestures or create your own!</p>
        <select class="full-width">
          <option value="hands">Hands (2D)</option>
          <option value="handpose">Handpose (3D)</option>
        </select>
        <p>
          <span class="gesture-emoji" gesture="victory">✌</span>
          <span class="gesture-emoji" gesture="thumbUp">👍</span>
          <span class="gesture-emoji" gesture="thumbDown">👎</span>
          <span class="gesture-emoji" gesture="pointLeft">👈</span>
          <span class="gesture-emoji" gesture="pointRight">👉</span>
          <span class="gesture-emoji" gesture="stop">🤚</span>
          <span class="gesture-emoji" gesture="spock">🖖</span>
          <span class="gesture-emoji" gesture="horns">🤘</span>
          <span class="gesture-emoji" gesture="love">🤟</span>
          <span class="gesture-emoji" gesture="fist">✊</span>
          <span class="gesture-emoji" gesture="ok">👌</span>
          <span class="gesture-emoji" gesture="callMe">🤙</span>
        </p>
        <div>
          <HandsfreeToggle class="full-width handsfree-hide-when-started-without-handpose" text-off="Start Handpose" text-on="Stop Handpose Model" :opts="demoOpts" />
          <button class="handsfree-show-when-started-without-handpose handsfree-show-when-loading" disabled><Fa-Spinner spin /> Loading...</button>
          <button class="handsfree-show-when-started-without-handpose handsfree-hide-when-loading" @click="startDemo"><Fa-Video /> Start Handpose</button>
        </div>
      </section>
    </Window>
  </div>
</div>


<!-- Code -->
<script>
export default {
  data () {
    return {
      demoOpts: {
        autostart: true,

        weboji: false,
        hands: true,
        handpose: false,
        facemesh: false,
        pose: false,
        holistic: false,

        gesture: {
          victory: true,
          thumbDown: true
        }
      }
    }
  },

  /**
   * Creates a plugin that highlights emojis
   */
  mounted () {
    // Recursive because of the way we're loading handsfree into the docs
    const checkHandsfree = () => {
      if (this.$root.handsfree) {
        this.$nextTick(() => {
          let lastGestureHandpose = null
          let lastGestureHands = [null, null, null, null]
          
          this.$root.handsfree.use('gestureEmojiDetector', ({hands, handpose}) => {
            if (hands?.gesture) {
              hands.gesture.forEach((gesture, n) => {
                if (gesture && gesture.name !== lastGestureHands[n]) {
                  let $el = document.querySelector(`.gesture-emoji[gesture="${lastGestureHands[n]}"]`)
                  if ($el) $el.classList.remove('active')
                  $el = document.querySelector(`.gesture-emoji[gesture="${gesture.name}"]`)
                  if ($el) $el.classList.add('active')
                  
                  lastGestureHands[n] = gesture.name
                }
    
                // Disable the gesture emoji if no gestures
                if (lastGestureHands[n] && !gesture?.name) {
                  let $el = document.querySelector(`.gesture-emoji[gesture="${lastGestureHands[n]}"]`)
                  if ($el) $el.classList.remove('active')
    
                  lastGestureHands[n] = null
                }
              })
            }

            // Toggle the gesture emoji
            if (handpose?.gesture && handpose.gesture.name !== lastGestureHandpose) {
              let $el = document.querySelector(`.gesture-emoji[gesture="${lastGestureHandpose}"]`)
              if ($el) $el.classList.remove('active')
              $el = document.querySelector(`.gesture-emoji[gesture="${handpose.gesture.name}"]`)
              if ($el) $el.classList.add('active')
              
              lastGestureHandpose = handpose.gesture.name
            }

            // Disable the gesture emoji if no gestures
            if (lastGestureHandpose && !handpose?.gesture?.name) {
              let $el = document.querySelector(`.gesture-emoji[gesture="${lastGestureHandpose}"]`)
              if ($el) $el.classList.remove('active')

              lastGestureHandpose = null
            }
          })
        })
      } else {
        setTimeout(checkHandsfree, 5)
      }
    }

    checkHandsfree()
  },

  destroyed () {
    this.$root.handsfree.plugin.gestureEmojiDetector.disable()
  },

  methods: {
    /**
     * Start the page with our preset options
     */
    startDemo () {
      this.$root.handsfree.update(this.demoOpts)
    }
  }
}
</script>

<style lang="stylus">
.gesture-emoji
  font-size 30px
  display inline-block
  margin-right 10px
  margin-bottom 10px
  opacity 0.2

  &.active
    opacity 1
</style>