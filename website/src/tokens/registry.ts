import registry from '../../../design-system/tokens/dist/registry.json';
import pending from '../../../design-system/tokens/dist/pending.json';
import coverage from '../../../design-system/tokens/dist/component-coverage.json';
export {registry,pending,coverage};
export const tokenPages=[
 {slug:'',id:'token-overview',title:'Token overview',description:'One source, three tiers. Approved values, traceable aliases and explicit pending decisions.'},
 {slug:'primitives',id:'token-primitives',title:'Primitive tokens',description:'Raw approved foundation values. Components consume aliases rather than these directly.'},
 {slug:'semantic',id:'token-semantic',title:'Semantic tokens',description:'Roles, Light/Dark modes and the boundary between foundation values and candidate assignments.'},
 {slug:'colour',id:'token-colour',title:'Colour tokens',description:'Palette references, surface and text roles, action states and feedback tones.'},
 {slug:'typography',id:'token-typography',title:'Typography tokens',description:'Geist families, approved type scale, weights, line heights and tracking.'},
 {slug:'spacing',id:'token-spacing',title:'Spacing tokens',description:'The approved spacing scale and its current component connections.'},
 {slug:'radius',id:'token-radius',title:'Radius tokens',description:'Seven approved corner radii, without silently replacing legacy round shapes.'},
 {slug:'elevation',id:'token-elevation',title:'Elevation tokens',description:'Five foundation shadow levels and explicit differences in existing component effects.'},
 {slug:'responsive',id:'token-responsive',title:'Responsive tokens',description:'Approved breakpoints, gutters, page columns and content maxima.'},
 {slug:'css-variables',id:'token-css-variables',title:'CSS variables',description:'Generated CSS and typed name exports, component bindings and reproducible builds.'}
] as const;
export type TokenTopic=typeof tokenPages[number];
