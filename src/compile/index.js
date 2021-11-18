import { generate } from './generate'
import { parserHTML } from './parser'
export function compileToFunction(template) {
  const ast = parserHTML(template)
  console.log(ast)
  const code = generate(ast)
  console.log(code)

  const render = new Function(`with(this){${code}}`)

  return render
}
