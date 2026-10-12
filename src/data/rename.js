const K=['student','teacher','who','from','to'];
export const renameIn=(db,a,b)=>Object.fromEntries(Object.entries(db).map(([c,rows])=>[c,Array.isArray(rows)?rows.map(r=>{if(!r||typeof r!='object')return r;let x=r;const set=k=>{if(r[k]===a)x={...x,[k]:b}};K.forEach(set);if(c=='students'||c=='teachers')set('name');return x}):rows]));
