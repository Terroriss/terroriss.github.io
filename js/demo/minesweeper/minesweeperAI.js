"use strict;"
var i,j,ii,jj,len
const isSameSet=(set1,set2)=>{if(!(set1 instanceof ArraySet)||!(set2 instanceof ArraySet))return false
if(set1.size!=set2.size)return false
const iterator1=set1.values();for(i=0;i<set1.size;i++){let item=iterator1.next().value
if(!set2.has(item))return false}
return true}
const setInArr=(set,arr)=>{for(i=0,len=arr.length;i<len;i++)
if(isSameSet(arr[i],set))
return true
return false}
const sentenceInArr=(s,arr)=>{for(const sentence of arr)
if(s===sentence)
return true
return false}
const minusSet=(s1,s2)=>{let newSet=new ArraySet();s1.forEach(elem=>newSet.add(elem));s2.forEach(elem=>newSet.delete(elem));return newSet;}
function union(setA,setB){let _union=setA
const iterator=setB.values();for(i=0,len=setB.size;i<len;i++){let item=iterator.next().value
_union.add(item)}
return _union}
isSubSet=function(set,otherSet){if(set.size>otherSet.size)
return false;else{for(var elem of set){if(!otherSet.has(elem))
return false;}
return true;}}
class Sentence{constructor(cells,count){this.cells=cells;this.count=count;}
known_mines(){if(this.cells.size==this.count)
return this.cells
return null}
known_safes(){if(this.count==0)return this.cells
return null}
mark_mine(cell){if(this.cells.delete(cell))this.count-=1}
mark_safe(cell){this.cells.delete(cell)}}
class MinesweeperAI{constructor(height=8,width=8){this.height=height;this.width=width;this.moves_made=new ArraySet();this.mines=new ArraySet()
this.safes=new ArraySet()
this.knowledge=[]}
mark_mine(cell){this.mines.add(cell)
for(i=0,len=this.knowledge.length;i<len;i++)
this.knowledge[i].mark_mine(cell)}
mark_safe(cell){this.safes.add(cell)
for(i=0,len=this.knowledge.length;i<len;i++)
this.knowledge[i].mark_safe(cell)}
add_knowledge(cell,count){this.moves_made.add(cell)
this.mark_safe(cell)
let x=cell[0]
let y=cell[1]
let cells=new ArraySet()
for(i=x-1,ii=x+2;i<ii;i++){for(j=y-1,jj=y+2;j<jj;j++){if(i==x&&j==y)
continue
if(0<=i&&i<this.height&&0<=j&&j<this.width){if(this.mines.has([i,j])){count-=1}
else if(!this.safes.has([i,j])){cells.add([i,j])}}}}
if(cells.size>0)
this.knowledge.push(new Sentence(cells,count))
for(const sentence of this.knowledge){let safe=sentence.known_safes()
let mine=sentence.known_mines()
if(safe)this.safes=union(this.safes,safe)
if(mine)this.mines=union(this.mines,mine)}
let n=this.knowledge.length
for(i=0;i<n;i++){let s=this.knowledge[i]
if(s instanceof Sentence)
if(s.cells.size==0)this.knowledge.splice(i,i+1);else
this.knowledge.splice(i,i+1);}
for(i=0;i<n;i++){for(j=i+1;j<n;j++){let s1=this.knowledge[i]
let s2=this.knowledge[j]
if(isSubSet(s1.cells,s2.cells)){cells=minusSet(s2.cells,s1.cells)
if(cells.size>0){var s=new Sentence(cells,s2.count-s1.count)
if(!sentenceInArr(s,this.knowledge)){this.knowledge.push(s)}}}else if(isSubSet(s2.cells,s1.cells)){cells=minusSet(s1.cells,s2.cells)
if(cells.size>0){var s=new Sentence(cells,s1.count-s2.count)
if(!sentenceInArr(s,this.knowledge)){this.knowledge.push(s)}}}}}}
make_safe_move(){let l=this.safes.size
const s_i=this.safes[Symbol.iterator]()
for(i=0;i<l;i++){let curr=s_i.next().value
if(!this.moves_made.has(curr))return curr.split(",")}
return null}
make_random_move(){let possible_move=[]
for(i=0;i<this.height;i++){for(j=0;j<this.width;j++)
if(!this.moves_made.has([i,j])&&!this.mines.has([i,j]))
possible_move.push([i,j])}
if(possible_move.length>0)
return possible_move[Math.floor(Math.random()*possible_move.length)]
return null}}