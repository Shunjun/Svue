interface Attribute {
  name: string
  value: string
}

type Attributes = Attribute[]

interface VDomOption {
  type: 'element' | 'text'
  el: Node
  children: VOptions[] | null
  _vue: true
}

interface VTextOption extends VDomOption {
  data: string
}

interface VElementOption extends VDomOption {
  tag: string
  atts: Attributes
  isHtml: boolean
}

type VOptions = VTextOption | VElementOption

interface DirectiveOption {
  name: DirectiveNames
  arg: string | undefined
  value: string
  mate: DataType
}

type DirectiveNames =
  | 'bind'
  | 'on'
  | 'model'
  | 'cloak'
  | 'show'
  | 'if'
  | 'else-if'
  | 'else'
  | 'for'
  | 'html'
  | 'text'
  | string

type DirectivesType = 'init' | 'update' | 'destroy'

type Directive = Partial<Record<DirectivesType, ((velement: VElememt,
  direction: DirectiveOption) => void) | null>>

type Directives = Record<DirectiveNames, Directive>

interface Listener {
  name: 'on'
  arg: string | undefined
  value: string
}

type DataType = { [K: string]: any }

type Watch = { [K: string]: (...any: any[]) => any }

type Computed = { [K: string]: (...any: any[]) => any }

interface ComponentOptions {
  props?: string[]
  name?: string
  el?: Node | string
  template?: string
  data?: DataType
  method?: { [K: string]: (...any: any[]) => any }
  computed?: Computed
  watch?: Watch
  directive?: { [K: string]: Directive }
  created?: () => void
  updated?: () => void
  destroy?: () => void
  directives?: Directives
}

interface VueOptions extends ComponentOptions {
  el: Node | string
  components?: { [k: string]: ComponentOptions }
}

type StatusType = 'init' | 'update' | 'uninit'

// interface Vue {
//   root: VNode<any>
//   _data: DataType
//   _directives: Directives
//   status: StatusType
//   created?: () => void
//   updated?: () => void

//   [key: string]: any
// }

// declare var Vue: {
//   new(options: VueOptions): Vue
// }
