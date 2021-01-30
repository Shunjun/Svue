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

type DirectivesType = 'init' | 'update' | 'destory'

type Directive = Partial<Record<DirectivesType, ((velement: VElememt, direction: DirectiveOption) => void) | null>>

type Directives = Record<DirectiveNames, Directive>

interface Listener {
  name: 'on'
  arg: string | undefined
  value: string
}

type DataType = { [K: string]: any }

interface VueOptions {
  el: Node | string
  data?: DataType
  methed?: { [K: string]: (...any: any[]) => any }
  comput?: { [K: string]: (...any: any[]) => any }
  watch?: { [K: string]: (...any: any[]) => any }
  driective?: { [K: string]: Directive }
  created?: () => void
  updated?: () => void
  destory?: () => void
  directives?: Directives
}

type StatusType = 'init' | 'update' | 'uninit'

interface Vue {
  root: VNode<any>
  _data: DataType
  _directives: Directives
  status: StatusType
  created?: () => void
  updated?: () => void
}
declare var Vue: {
  new (options: VueOptions): Vue
}
