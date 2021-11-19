import { generate } from './generate'
import { parserHTML } from './parser'
export function compileToFunction(template) {
  const ast = parserHTML(template)
  const code = generate(ast)

  const render = new Function(`with(this){return ${code}}`)

  return render
}
