import json,subprocess
subprocess.run(['node','-e',"global.window={};require('./places.js');require('fs').writeFileSync('./d.json',JSON.stringify(window))"])
d=json.load(open('./d.json'));m=d['PH_MAP']
s=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {m["w"]} {m["h"]}" width="{m["w"]*2}" height="{m["h"]*2}"><rect width="100%" height="100%" fill="#cfe8f3"/><path d="{m["path"]}" fill="#d9c9a0" stroke="#887" stroke-width=".4"/>'
for p in d['PH_PLACES']: s+=f'<circle cx="{p["x"]}" cy="{p["y"]}" r="1.6" fill="red"/>'
open('./check.svg','w').write(s+'</svg>')
import cairosvg;cairosvg.svg2png(url='./check.svg',write_to='./check.png')
