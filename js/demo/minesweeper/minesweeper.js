var i,j
class ArraySet extends Set{add(arr){super.add(arr.toString());}
has(arr){return super.has(arr.toString());}
delete(arr){return super.delete(arr.toString());}}
class Minesweeper{constructor(height=8,width=8,mines=8){if(height<3)this.height=3;else this.height=height;if(width<3)this.width=3;else this.width=width;this.mines=new ArraySet();if(mines<0)mines=1;if(mines>height*width)mines=Math.floor(4*(height*width)/5);this.board=[];for(i=0;i<height;i++){let row=[];for(j=0;j<width;j++)
row[j]=false;this.board[i]=row;}
while(this.mines.size!=mines){i=Math.floor(Math.random()*height);j=Math.floor(Math.random()*width);if(!this.board[i][j]){this.mines.add([i,j])
this.board[i][j]=true;}}
this.mines_found=new ArraySet();}
print(){let h=this.height;let w=this.width;for(i=0;i<h;i++){console.log("--".repeat(w)+"-");let row="";for(j=0;j<w;j++){if(this.board[i][j])row+="|X";else row+="| ";}
row+="|";console.log(row);}
console.log("--".repeat(w)+"-");}
is_mine(cell){let i=cell[0];let j=cell[1];return this.board[i][j];}
nearby_mines(cell){let count=0;for(i=cell[0]-1;i<cell[0]+2;i++){for(j=cell[1]-1;j<cell[1]+2;j++){if(i==cell[0]&&j==cell[1])
continue;if(0<=i&&i<this.height&&0<=j&&j<this.width)
if(this.board[i][j])
count+=1;}}
return count;}
won(){return isSameSet(this.mines_found,this.mines);}}
function sleep(ms){return new Promise(resolve=>setTimeout(resolve,ms));}