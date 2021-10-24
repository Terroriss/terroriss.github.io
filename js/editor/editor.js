const console_script=`
// define a new console
var console=(function(oldCons){
    return {
        log: function(text){
            oldCons.log(text);
            const message = JSON.stringify({
                type: "log",
                msg: text
            });
            window.parent.postMessage(message, '*');
        },
        info: function (text) {
            oldCons.info(text);
            const message = JSON.stringify({
                type: "info",
                msg: text
            });
            window.parent.postMessage(message, '*');
        },
        warn: function (text) {
            oldCons.warn(text);
            const message = JSON.stringify({
                type: "warn",
                msg: text
            });
            window.parent.postMessage(message, '*');
        },
        error: function (text) {
            oldCons.error(text);
            const message = JSON.stringify({
                type: "error",
                msg: text
            });
            window.parent.postMessage(message, '*');
        }
    };
}(window.console));

//Then redefine the old console
window.console = console;
`var result=document.getElementById('result'),htmltext=document.getElementById('html'),csstext=document.getElementById('css'),jstext=document.getElementById('js');const code_array=[{elem:htmltext,pre:"html"},{elem:csstext,pre:"css"},{elem:jstext,pre:"js"}];function display(){var html=htmltext.value,css=csstext.value,js=jstext.value,doc='<!DOCTYPE html><html><head><style>'+css+'</style><script>'+console_script+js+'</script></head><body>'+html+'</body></html>';result.setAttribute('srcdoc',doc);return{'h':html,'c':css,'j':js,};}
code_array.forEach(({elem,pre})=>{update(elem,pre);elem.addEventListener('paste',function(e){handlePaste(e);update(this,pre);});elem.addEventListener('input',function(e){update(this,pre);});elem.addEventListener('keydown',function(e){check_tab(this,e);update(this,pre);});elem.addEventListener('scroll',function(e){sync_scroll(this,pre);});closeTag(pre);});function update(element,prefix){updateCode(element.value,prefix);sync_scroll(element,prefix);}
function updateCode(text,prefix){let result_element=document.querySelector("#"+prefix+"-highlighting-content");if(text[text.length-1]=="\n"){text+=" ";}
result_element.innerText=text;hljs.highlightBlock(result_element);}
function sync_scroll(element,prefix){let result_element=document.querySelector("#"+prefix+"-highlighting-content");result_element.scrollTop=element.scrollTop;result_element.scrollLeft=element.scrollLeft;element.scrollTop=result_element.scrollTop;element.scrollLeft=result_element.scrollLeft;}
function handlePaste(event){let pastedText=(event.clipboardData||window.clipboardData).getData('text');return pastedText.split('\n').join('');}
function check_tab(element,event){let code=element.value;if(event.key=="Tab"){event.preventDefault();let before_tab=code.slice(0,element.selectionStart);let after_tab=code.slice(element.selectionEnd,element.value.length);let cursor_pos=element.selectionEnd+1;element.value=before_tab+"\t"+after_tab;element.selectionStart=cursor_pos;element.selectionEnd=cursor_pos;}}
var wrapper=document.querySelector('.editor-block'),htmlbar=document.getElementById('html-bar'),cssbar=document.getElementById('css-bar'),jsbar=document.getElementById('js-bar'),current_select=null;const bar_array=[cssbar,jsbar];bar_array.forEach(elem=>{elem.addEventListener('mousedown',initResize,false);});function initResize(event){if(window.innerWidth>767){current_select=event.target;window.addEventListener('mousemove',verticalResize,false);window.addEventListener('mouseup',stopResize,false);}else
stopResize(event);}
function verticalResize(event){if(current_select){let element=current_select;var containerOffsetTop=wrapper.offsetTop,containerOffsetBottom=wrapper.offsetTop+wrapper.clientHeight,blockMinHeight=36,blockMaxHeight=containerOffsetBottom-36*3;if(element.id==="css-bar"){if(event.clientY-element.parentNode.offsetTop>0){var htmlHeight=event.clientY-containerOffsetTop,jsHeight=jsbar.parentNode.clientHeight,cssHeight=containerOffsetBottom-htmlHeight-jsHeight;jsHeight=containerOffsetBottom-htmlHeight-cssHeight;htmlbar.parentNode.style.height=(Math.max(blockMinHeight,Math.min(blockMaxHeight,htmlHeight)))+'px';element.parentNode.style.height=(Math.max(blockMinHeight,Math.min(blockMaxHeight,cssHeight)))+'px';jsbar.parentNode.style.height=(Math.max(blockMinHeight,Math.min(blockMaxHeight,jsHeight)))+'px';}}
if(element.id==="js-bar"){if(event.clientY-element.parentNode.offsetTop>0){var htmlHeight=htmlbar.parentNode.clientHeight,cssHeight=event.clientY-containerOffsetTop-htmlHeight,jsHeight=containerOffsetBottom-htmlHeight-cssHeight;htmlHeight=containerOffsetBottom-jsHeight-cssHeight;htmlbar.parentNode.style.height=(Math.max(blockMinHeight,Math.min(blockMaxHeight,htmlHeight)))+'px';element.parentNode.style.height=(Math.max(blockMinHeight,Math.min(blockMaxHeight,jsHeight)))+'px';cssbar.parentNode.style.height=(Math.max(blockMinHeight,Math.min(blockMaxHeight,cssHeight)))+'px';}}}}
function verticalResizeUtil(event){var scroll=event.clientY;}
function stopResize(event){current_select=null;window.removeEventListener('mousemove',verticalResize,false);window.removeEventListener('mouseup',stopResize,false);}
const resizer=document.getElementById('dragMe');const rightSide=resizer.previousElementSibling;const leftSide=resizer.nextElementSibling;let x=0;let y=0;let leftWidth=0;const mouseDownHandler=function(e){x=e.clientX;y=e.clientY;leftWidth=leftSide.getBoundingClientRect().width;document.addEventListener('mousemove',mouseMoveHandler);document.addEventListener('mouseup',mouseUpHandler);};resizer.addEventListener('mousedown',mouseDownHandler);const mouseMoveHandler=function(e){const dx=e.clientX-x;const dy=e.clientY-y;const newLeftWidth=((leftWidth+dx)*100)/resizer.parentNode.getBoundingClientRect().width;leftSide.style.width=`${newLeftWidth}%`;resizer.style.cursor='col-resize';document.body.style.cursor='col-resize';leftSide.style.userSelect='none';leftSide.style.pointerEvents='none';rightSide.style.userSelect='none';rightSide.style.pointerEvents='none';};const mouseUpHandler=function(){resizer.style.removeProperty('cursor');document.body.style.removeProperty('cursor');leftSide.style.removeProperty('user-select');leftSide.style.removeProperty('pointer-events');rightSide.style.removeProperty('user-select');rightSide.style.removeProperty('pointer-events');document.removeEventListener('mousemove',mouseMoveHandler);document.removeEventListener('mouseup',mouseUpHandler);};const default_tabs={code:"html",result:true};var setting_info=default_tabs;const saved_setting=JSON.parse(localStorage.getItem("editor-setting"));if(saved_setting){setting_info=saved_setting;}
const resButton=document.querySelector('.editor-setting-item.setting-res'),editorBlock=document.querySelector('.editor-block'),htmlBlock=document.getElementById('html-block'),cssBlock=document.getElementById('css-block'),jsBlock=document.getElementById('js-block'),resBlock=document.querySelector('.editor-result');displayResult(setting_info["result"]);displayCode(setting_info["code"],load=true);function displayResult(bool){if(!!bool||!setting_info["code"]){resButton.classList.add('active');resBlock.classList.remove('hide-block');editorBlock.classList.remove('full-height');setting_info["result"]=true;}else{resButton.classList.remove('active');resBlock.classList.add('hide-block');editorBlock.classList.add('full-height');setting_info["result"]=false;}
localStorage.setItem("editor-setting",JSON.stringify(setting_info));};function displayCode(tabname,load=false){var disable_tabs=removeItemFromArray(["html","css","js"],tabname);disable_tabs.forEach(name=>{const tab=document.getElementById(name+"-block");tab.classList.add("hide-block");const button=document.querySelector('.editor-setting-item.setting-'+name);button.classList.remove("active");});setting_info["code"]=load?tabname:tabname===setting_info["code"]?null:tabname;if(!setting_info["code"]){["html","css","js"].forEach(name=>{document.getElementById(name+"-block").classList.add("hide-block");document.querySelector('.editor-setting-item.setting-'+name).classList.remove("active");});resBlock.classList.add("full-height");editorBlock.classList.add("min-height");displayResult(true);}else{const current_tab=document.getElementById(tabname+"-block");const currentButton=document.querySelector('.editor-setting-item.setting-'+tabname);current_tab.classList.remove("hide-block");currentButton.classList.add("active");editorBlock.classList.remove("min-height");}
localStorage.setItem("editor-setting",JSON.stringify(setting_info));};function chooseTab(name){if(name==="res"){displayResult(!setting_info["result"]);}else{displayCode(name);}};function removeItemFromArray(array,item){const index=array.indexOf(item);if(index>-1){array.splice(index,1);}
return array;};document.addEventListener("DOMContentLoaded",function(){const runbutton=document.querySelector("#play-svg");runbutton.addEventListener('click',display);TLN.append_line_numbers('html')
TLN.append_line_numbers('css')
TLN.append_line_numbers('js')});function closeTag(textarea_id){function insertInto(str,input){var val=input.value,s=input.selectionStart,e=input.selectionEnd;input.value=val.slice(0,e)+str+val.slice(e);if(e==s)input.selectionStart+=str.length-1;input.selectionEnd=e+str.length-1;}
var closures={34:'"',39:"'",40:')',91:']',96:'`',123:'}'};$("#"+textarea_id).keypress(function(e){if(c=closures[e.which])insertInto(c,this);});};(function(){function insertTag(str,input){var val=input.value,s=input.selectionStart,e=input.selectionEnd;input.value=val.slice(0,e)+str+val.slice(e);input.value+="</>";if(e==s)input.selectionStart+=str.length-1;input.selectionEnd=e+str.length-1;}
var closures={60:'>'};$("#html").keypress(function(e){if(c=closures[e.which])insertTag(c,this);display();});})();