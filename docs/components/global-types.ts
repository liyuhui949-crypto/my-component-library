export interface PropItem {
  name: string;
  type: string;
  default: string;
  required: boolean;
  description: string;
}

export interface EmitItem {
  name: string;
  description: string;
}

export interface ComponentAPI {
  componentName: string;
  props: PropItem[];
  emits: EmitItem[];
}
