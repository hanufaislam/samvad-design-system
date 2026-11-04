import {foundation} from '../../data';
// Private implementation adapters, not official production tokens.
export type Space = 0|2|4|8|12|16|20|24|32|40|48|64|80|96;
export type Align = 'start'|'center'|'end'|'stretch';
export type Justify = 'start'|'center'|'end'|'between';
export type ContainerWidth = 640|960|1200|'reading'|'full';
export function space(value:number){if(!foundation.spacing.includes(value))throw new Error('Use an approved spacing value.');return `var(--samvad-semantic-space-scale-${value})`;}
export function containerStyle(max:ContainerWidth,padding:Space|'responsive'){
 const width=max==='full'?'none':max==='reading'?'var(--samvad-semantic-layout-reading)':`var(--samvad-semantic-layout-container-${max})`;
 if(typeof max==='number'&&!foundation.containerMaxima.includes(max))throw new Error('Unknown container maximum.');
 return `--_svl-max:${width};${padding==='responsive'?'':`--_svl-pad:${space(padding)};`}`;
}
export function columns(value:number){if(!Number.isInteger(value)||value<1||value>12)throw new Error('Columns must be an integer from 1 to 12.');return value;}
export function gridStyle(gap:Space,base:number,medium:number,wide:number){return `--_svl-gap:${space(gap)};--_svl-cols:${columns(base)};--_svl-medium:${columns(medium)};--_svl-wide:${columns(wide)};`;}
