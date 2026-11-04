for(const root of document.querySelectorAll<HTMLElement>('[data-token-table]')){
 const search=root.querySelector<HTMLInputElement>('input[type=search]')!;
 const rows=[...root.querySelectorAll<HTMLTableRowElement>('[data-token-row]')];
 const nav=root.querySelector<HTMLElement>('[data-pagination]')!;
 const count=root.querySelector<HTMLElement>('[data-token-count]')!;
 const size=Number(root.dataset.pageSize)||25;
 function update(reset=false){const matching=rows.filter(r=>r.dataset.search!.includes(search.value.trim().toLowerCase()));const total=Math.max(1,Math.ceil(matching.length/size));const page=reset?1:Math.min(total,Number(nav.dataset.page)||1);nav.dataset.page=String(page);nav.dataset.total=String(total);rows.forEach(r=>r.hidden=true);matching.slice((page-1)*size,page*size).forEach(r=>r.hidden=false);nav.hidden=matching.length<=size;nav.querySelector('[data-page-status]')!.textContent=`Page ${page} of ${total}`;nav.querySelectorAll<HTMLButtonElement>('[data-page-direction]').forEach(b=>b.disabled=Number(b.dataset.pageDirection)<0?page<=1:page>=total);count.textContent=`${matching.length} matching token${matching.length===1?'':'s'}. Showing ${matching.length?((page-1)*size+1):0}–${Math.min(page*size,matching.length)}.`;}
 search.addEventListener('input',()=>update(true));root.addEventListener('samvad:pagechange',()=>update());update();
}
