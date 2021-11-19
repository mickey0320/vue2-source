const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{   xxx  }}

function genProps(attrs) {
  let str = ``
  attrs.forEach((attr) => {
    if (attr.name === 'style') {
      const style = {}
      // eslint-disable-next-line no-useless-escape
      attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
        style[arguments[1]] = arguments[2]
      })
      attr.value = style
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  })

  return `{${str.slice(0, -1)}}`
}

function genChildren(ast) {
  const children = ast.children
  if (children.length) {
    return children.map((child) => gen(child)).join(',')
  }
  return false
}

function gen(el) {
  if (el.type === 1) {
    return generate(el)
  } else {
    const text = el.text
    if (!defaultTagRE.test(text)) {
      return `_v("${text}")`
    } else {
      const tokens = []
      let match
      let lastIndex = (defaultTagRE.lastIndex = 0)
      while ((match = defaultTagRE.exec(text))) {
        const index = match.index
        if (index > lastIndex) {
          tokens.push(`${JSON.stringify(text.slice(lastIndex, index))}`)
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(`${JSON.stringify(text.slice(lastIndex))}`)
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

export function generate(ast) {
  const children = genChildren(ast)
  const code = `_c('${ast.tag}',${ast.attrs.length ? genProps(ast.attrs) : undefined}${
    children ? ',' + '[' + children + ']' : ''
  })`

  return code
}
