import foundationPages from './components/foundation-docs/content.json';
import referencePages from './components/patterns/content.json';
import {tokenPages} from './tokens/registry';
import {libraryCatalog,libraryGroups} from './components/library/catalog';
import { batchCatalog } from './components/forms/catalog';
import foundation from '../../design-system/foundations/foundation-spec.json';

export { foundation };
export {base,href} from './paths';
export const figma = 'https://www.figma.com/design/LEIY29pmcSV6CujKqhzVoW/Samvad-Design-System';
export const pages = [
  { id: 'overview', path: '', title: 'Overview', group: 'Get started', description: 'A little character. A lot of clarity. Meet the shared visual language for Samvad.', keywords: 'introduction start foundations design system' },
  { id: 'principles', path: 'get-started/principles/', title: 'Design principles', group: 'Get started', description: 'Six principles for clear, friendly and accessible experiences.', keywords: 'clarity consistency whitespace accessibility personality' },
  ...foundationPages.filter(p=>p.group==='Get started').map(p=>({...p,keywords:'onboarding designers developers handoff getting started'})),
  { id: 'colour', path: 'foundations/colour/', title: 'Colour', group: 'Foundations', description: 'Warm neutrals, purposeful mulberry and a little unexpected warmth.', keywords: 'color palette hex contrast primary neutral mulberry apricot lime' },
  { id: 'typography', path: 'foundations/typography/', title: 'Typography', group: 'Foundations', description: 'Readable by default. Character where it counts. Geist and Geist Mono.', keywords: 'font text type scale heading body label caption monospace' },
  ...foundationPages.filter(p=>p.group==='Foundations').map(p=>({...p,keywords:`${p.title} foundation approved values tokens accessibility specimens`})),
  ...tokenPages.map(p=>({id:p.id,path:`design-tokens/${p.slug?p.slug+'/':''}`,title:p.title,group:'Design tokens',description:p.description,keywords:'tokens primitives semantic component CSS variables source aliases modes pending'})),
  { id: 'action-button', path: 'components/actions/button/', title: 'Button', group: 'Components / Actions', description: 'Make the next action clear. Four treatments share one native, reusable button.', keywords: 'primary secondary ghost tertiary destructive loading disabled button' },
  { id: 'action-icon-button', path: 'components/actions/icon-button/', title: 'Icon button', group: 'Components / Actions', description: 'A compact action with an explicit accessible name. Built on the shared Button.', keywords: 'icon toggle pressed accessible label button' },
  { id: 'action-button-group', path: 'components/actions/button-group/', title: 'Button group', group: 'Components / Actions', description: 'Keep related actions together without turning them into a selection control.', keywords: 'button group horizontal vertical joined separated actions' },
  { id: 'action-text-link', path: 'components/actions/text-link/', title: 'Text link', group: 'Components / Actions', description: 'Take people somewhere. Clear link text and native browser behaviour.', keywords: 'link anchor navigation external disabled underline' },
  ...batchCatalog.map(e=>({id:`batch-${e.slug}`,path:`components/${e.group}/${e.slug}/`,title:e.title,group:`Components / ${e.group==='inputs'?'Inputs and forms':'Selection'}`,description:e.description,keywords:`${e.title} field selection validation native accessible`})),
  ...libraryCatalog.map(e=>({id:`library-${e.slug}`,path:`components/${e.group}/${e.slug}/`,title:e.title,group:`Components / ${libraryGroups[e.group]}`,description:e.description,keywords:`${e.title} accessible reusable native preview`})),
  ...referencePages.map(p=>({id:p.id,path:p.path,title:p.title,group:p.group,description:p.description,keywords:`${p.title} composition accessibility usage handoff guidelines states patterns resources`})),
];
export const principles = [
  { name: 'Clarity leads', means: 'Make content, hierarchy and the next action immediately understandable.', avoid: 'Remove helpful labels or hide functionality to achieve a cleaner appearance.' },
  { name: 'Character in small doses', means: 'Use distinctive typography, thoughtful language and occasional playful details.', avoid: 'Make every element expressive, decorative or attention-seeking.' },
  { name: 'Space creates structure', means: 'Use whitespace, alignment and proximity to explain relationships.', avoid: 'Spread related information apart or sacrifice useful density.' },
  { name: 'Colour has a job', means: 'Use colour to identify actions, communicate status and establish selected moments of identity.', avoid: 'Colour every surface or rely on colour alone to convey meaning.' },
  { name: 'Consistency earns trust', means: 'Share tokens, interaction patterns and component behaviours across Figma and code.', avoid: 'Force different user needs into an unsuitable pattern merely for uniformity.' },
  { name: 'Access is foundational', means: 'Design readable content, clear focus, comfortable targets and predictable interactions from the start.', avoid: 'Treat accessibility as a final audit or a special mode.' },
];
type Item = { label: string; page?: string; category?: boolean; available?: boolean };
export const navigation: { name: string; icon: string; items: Item[] }[] = [
  { name: 'Get started', icon: 'book-open', items: [{ label: 'Overview', page: 'overview' }, { label: 'Design principles', page: 'principles' }, ...foundationPages.filter(p=>p.group==='Get started').map(p=>({label:p.title,page:p.id}))] },
  { name: 'Foundations', icon: 'palette', items: [{ label: 'Colour', page: 'colour' }, { label: 'Typography', page: 'typography' }, ...foundationPages.filter(p=>p.group==='Foundations').map(p=>({label:p.title,page:p.id}))] },
  { name: 'Design tokens', icon: 'stack', items: tokenPages.map(p=>({label:p.title,page:p.id})) },
  { name: 'Components', icon: 'squares-four', items: [{label:'Actions', category:true, available:true}, {label:'Button',page:'action-button'},{label:'Icon button',page:'action-icon-button'},{label:'Button group',page:'action-button-group'},{label:'Text link',page:'action-text-link'}, ...(['inputs','selection'] as const).flatMap(group=>[{label:group==='inputs'?'Inputs and forms':'Selection',category:true,available:true},...batchCatalog.filter(e=>e.group===group).map(e=>({label:e.title,page:`batch-${e.slug}`}))]), ...(Object.keys(libraryGroups) as (keyof typeof libraryGroups)[]).flatMap(group=>[{label:libraryGroups[group],category:true,available:true},...libraryCatalog.filter(e=>e.group===group).map(e=>({label:e.title,page:`library-${e.slug}`}))])] },
  { name: 'Patterns', icon: 'chat-circle', items: referencePages.filter(p=>p.group==='Patterns').map(p=>({label:p.title,page:p.id})) },
  { name: 'Resources', icon: 'arrow-up-right', items: referencePages.filter(p=>p.group==='Resources').map(p=>({label:p.title,page:p.id})) },
  { name: 'Artifact', icon: 'stack', items: [] },
];
