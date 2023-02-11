class MomentumScroll {
    constructor(options) {
        this.defaults = {
            wrapperId: 'scroll',
            wrapperDamper: 0.03,
            cancelOnTouch: false
        }

        if(options) this.validateOptions(options)

        this.active = true
        this.resizing = false
        this.wrapperDamper = this.defaults.wrapperDamper
        this.wrapperId = this.defaults.wrapperId
        this.cancelOnTouch = this.defaults.cancelOnTouch

        if(!document.getElementById(this.wrapperId)) return
        this.createWrapper()
        this.setEvents()
    }

    validateOptions(options) {
        for(let option in options) {
            if(this.defaults.hasOwnProperty(option)) {
                Object.defineProperty(this.defaults, option, {value: Object.getOwnPropertyDescriptor(options, option).value})
            }
        }
    }

    createWrapper() {
        this.wrapper = document.getElementById(this.wrapperId)
        this.wrapper.style.position = 'fixed';
        this.wrapper.style.width = '100%'

        this.wrapperHeight = this.wrapper.clientHeight
        document.body.style.height = this.wrapperHeight + 'px' 
    }

    setEvents() {
        window.addEventListener('resize', this.resize.bind(this))
        if(this.cancelOnTouch) window.addEventListener('touchstart', this.cancel.bind(this))
        this.wrapperOffset = 0.0
        this.animateId = window.requestAnimationFrame(this.animate.bind(this))
    }

    wrapperUpdate() {
        let scrollY = document.scrollingElement ? document.scrollingElement.scrollTop : (document.documentElement.scrollTop || 0.0)
        this.wrapperOffset += (scrollY - this.wrapperOffset) * this.wrapperDamper
        this.wrapper.style.transform = `translate3d(0, ${-this.wrapperOffset.toFixed(2)}px, 0`
    }

    checkResize() {
        if(this.wrapperHeight != this.wrapperClienteHeight) this.resize()
    }

    resize() {
        if(!this.resizing) {
            this.resizing = true
            window.cancelAnimationFrame(this.animateId)
            window.setTimeout(() => {
                this.wrapperHeight = this.wrapper.wrapperClienteHeight
                if(parseInt(document.body.height) != parseInt(this.wrapperHeight)) {
                    document.body.height = this.wrapperHeight + 'px'
                }
                this.animateId = window.requestAnimationFrame(this.animate.bind(this))
                this.resizing = false
            }, 150)
        }
    }

    animate() {
        this.checkResize()
        this.wrapperUpdate()
        this.animateId = window.requestAnimationFrame(this.animate.bind(this))
    }

    cancel() {
        if(!this.active) return

        window.cancelAnimationFrame(this.animatedId)
        window.removeEventListener('resize', this.resize)
        window.removeEventListener('touchstart', this.cancel)
        this.wrapper.removeAttribute('style')
        document.body.removeAttribute('style')

        this.active = false
        this.wrapper = ""
        this.wrapperOffset = 0
        this.resizing = true
        this.animateId = ""
    }
}

new MomentumScroll({cancelOnTouch: true})