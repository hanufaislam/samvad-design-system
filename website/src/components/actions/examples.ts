export type ActionKind='button'|'icon-button'|'button-group'|'text-link';
export interface ExampleOptions {variant?:string;size?:string;state?:string;layout?:string;mode?:string;}
export function exampleFor(kind:ActionKind,options:ExampleOptions={}){
  const variant=options.variant|| (kind==='button'?'primary':kind==='icon-button'?'secondary':kind==='button-group'?'separated':'default');
  const size=options.size||'medium',state=options.state||'default';
  const disabled=state==='disabled'?' disabled':'',loading=state==='loading'?' loading':'';
  const v=`variant="${variant}" size="${size}"`;
  if(kind==='button')return `---\nimport Button from '../components/actions/Button.astro';\n---\n<Button ${v}${disabled}${loading}>Continue</Button>`;
  if(kind==='icon-button')return `---\nimport IconButton from '../components/actions/IconButton.astro';\n---\n<IconButton icon="check-circle" label="Mark complete" ${v}${disabled}${loading}${options.mode==='toggle'?' toggle':''} />`;
  if(kind==='button-group')return `---\nimport Button from '../components/actions/Button.astro';\nimport ButtonGroup from '../components/actions/ButtonGroup.astro';\n---\n<ButtonGroup label="Example actions" variant="${variant}" layout="${options.layout||'horizontal'}">\n  <Button size="${size}"${disabled}>Save</Button>\n  <Button variant="secondary" size="${size}"${disabled}>Cancel</Button>\n</ButtonGroup>`;
  const external=options.mode==='external';
  return `---\nimport TextLink from '../components/actions/TextLink.astro';\n${external?'':"import { href } from '../data';\n"}---\n<TextLink href=${external?'"https://www.figma.com/design/LEIY29pmcSV6CujKqhzVoW/Samvad-Design-System"':"{href('foundations/colour/')}"} ${v}${external?' target="_blank"':''}${disabled}>${external?'Figma workspace':'Explore colour'}</TextLink>`;
}
export const loadingExample=`---\nimport Button from '../components/actions/Button.astro';\n---\n<Button id="save-example">Save</Button>\n<p id="save-status" role="status"></p>\n<script>\n  import { setButtonLoading } from '../components/actions/runtime';\n  const button = document.querySelector<HTMLButtonElement>('#save-example')!;\n  const status = document.querySelector('#save-status')!;\n  button.addEventListener('click', async () => {\n    setButtonLoading(button, true);\n    status.textContent = 'Demonstration in progress.';\n    try {\n      // Local timing demonstration; replace with your operation.\n      await new Promise(resolve => setTimeout(resolve, 1200));\n      status.textContent = 'Demonstration complete.';\n    } finally {\n      setButtonLoading(button, false);\n    }\n  });\n</script>`;
