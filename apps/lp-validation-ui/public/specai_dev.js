const SPEC_STYLE_ID = 'spec-style'
let isPreview = true

function refreshSpecStyle() {
  let style = document.getElementById(SPEC_STYLE_ID)
  if (!style) {
    style = document.createElement('style')
    style.setAttribute('id', SPEC_STYLE_ID)
    document.head.appendChild(style)
  }

  style.innerHTML = `
    specai-tag-start, specai-tag-end {
      display: none;
    }
    :root {
      --spec-vh: ${isPreview ? '1vh' : '9px'}
    }
  `
}

const sendMessageToParent = (type, data) => {
  if (window.parent) {
    window.parent.postMessage({ type, data }, '*')
  }
}

// Forward console.log and console.warn to parent
const originalLog = console.log
const originalWarn = console.warn
const originalError = console.error

console.log = (...args) => {
  originalLog.apply(console, args)
  sendMessageToParent('CONSOLE_LOG', {
    level: 'log',
    args: args.map((arg) => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      } catch (e) {
        return String(arg)
      }
    }),
    timestamp: Date.now(),
  })
}

console.warn = (...args) => {
  originalWarn.apply(console, args)
  sendMessageToParent('CONSOLE_LOG', {
    level: 'warn',
    args: args.map((arg) => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      } catch (e) {
        return String(arg)
      }
    }),
    timestamp: Date.now(),
  })
}

console.error = (...args) => {
  originalError.apply(console, args)
  sendMessageToParent('ERROR', {
    args: args.map((arg) => {
      try {
        return typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      } catch (e) {
        return String(arg)
      }
    }),
    stack: new Error().stack
  })
}

window.addEventListener('error', (event) => {
  sendMessageToParent('ERROR', {
    args: { message: event.error.message },
    stack: event.error.stack || new Error().stack
  })
});

// Get all parent dora-ids
const getAllDoraIds = (element) => {
  const allDoraIds = []
  let prevSibling = element.previousElementSibling

  while (prevSibling) {
    if (prevSibling.tagName.toLowerCase() === 'specai-tag-start') {
      const doraId = prevSibling.getAttribute('data-spec-id')
      if (doraId) {
        allDoraIds.unshift(doraId)
      }
    } else {
      break
    }
    prevSibling = prevSibling.previousElementSibling
  }

  const doraId = element.getAttribute('data-spec-id')
  if (doraId) {
    allDoraIds.push(doraId)
  }

  return allDoraIds
}

const isVisible = (element) => {
  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  )
}

function processAllStyles() {
  const styles = document.querySelectorAll('style:not([data-vh-processed])')

  styles.forEach((style) => {
    if (style.id === SPEC_STYLE_ID) {
      return
    }

    style.textContent = style.textContent.replace(
      /([\d.]+)vh/g,
      (match, num) => {
        const value = parseFloat(num)
        return `calc(${value} * var(--spec-vh))`
      }
    )
    style.setAttribute('data-vh-processed', 'true')
  })
}

const EXCLUDE_TAG_NAMES = [
  'specai-tag-start',
  'specai-tag-end',
  'svg',
  'style',
  'script',
]

const getDomInfo = (element, extra) => {
  const rect = element.getBoundingClientRect()
  const position = {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
  }
  const size = {
    width: rect.width,
    height: rect.height,
  }

  const children = Array.from(element.children)
    .filter((node) => {
      const tagName = node.tagName.toLowerCase()
      return !EXCLUDE_TAG_NAMES.includes(tagName) && isVisible(node)
    })
    .map((node) => getDomInfo(node, extra))

  const ids = getAllDoraIds(element)

  if (extra && ids[0]) {
    extra.ready = true
  }

  const res = {
    nodeType: 'element',
    tagName: element.tagName.toLowerCase(),
    componentName: element.tagName,
    id: ids[0] || '',
    allIds: ids,
    position,
    size,
    children,
  }

  return res
}

const sendDomStructure = () => {
  const rootElement = document.getElementById('root')
  if (rootElement) {
    processAllStyles()

    const extra = { ready: false }
    const domStructure = getDomInfo(rootElement, extra)

    if (!extra.ready) {
      return
    }

    if (!domStructure.size.width && !domStructure.size.height) {
      return
    }

    const curHeight = Math.max(
      document.body.clientHeight,
      document.body.scrollHeight,
      document.body.offsetHeight,
      990
    )

    const viewportSize = {
      width: Math.max(
        document.body.clientWidth,
        document.body.scrollWidth,
        document.body.offsetWidth
      ),
      height: curHeight,
    }

    sendMessageToParent('DOM_STRUCTURE', {
      structure: domStructure,
      viewport: viewportSize,
      url: location.href,
    })

    return domStructure
  }
}

let specHoldingCount = 0

// Handle viewport commands
window.addEventListener('message', (event) => {
  if (event.data.type === 'SET_IFRAME_STATE') {
    if (!!event.data.isPreview !== isPreview) {
      isPreview = !!event.data.isPreview
      if (!isPreview) {
        specHoldingCount = 0
      }

      refreshSpecStyle()
    }
  }
})

refreshSpecStyle()

// send dom change ever 700ms
setInterval(() => {
  if (isPreview || specHoldingCount++ >= 1) {
    sendDomStructure()
  }
}, 700)