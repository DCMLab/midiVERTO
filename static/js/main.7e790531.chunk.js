(this.webpackJsonpmidft=this.webpackJsonpmidft||[]).push([[0],{204:function(e,t){},222:function(e,t,a){"use strict";a.r(t);var i=a(6),r=a.n(i),n=a(73),s=a.n(n),c=a(28),o=a(5);function l(){return Object(o.jsxs)("nav",{className:"navbar",children:[Object(o.jsx)("h1",{children:"MIDFT"}),Object(o.jsxs)("div",{className:"container",children:[Object(o.jsx)(c.b,{to:"/",children:"Home"}),Object(o.jsx)(c.b,{to:"/visualization",children:"Wavescape"}),Object(o.jsx)(c.b,{to:"/live",children:"Live"}),Object(o.jsx)(c.b,{to:"/keyboard",children:"Keyboard"})]})]})}var u=a(11);function f(){return Object(o.jsxs)("div",{children:[Object(o.jsx)("h1",{children:"Home - Theory and analysis"}),Object(o.jsx)("p",{children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, architecto temporibus laboriosam, atque veniam quod provident minus eos aspernatur ipsa ad nihil veritatis ea, eaque amet! Itaque cupiditate laudantium neque voluptas necessitatibus quidem perspiciatis molestias dolores possimus. Veritatis perferendis, quidem molestiae ipsa reprehenderit aperiam harum iste obcaecati doloribus, recusandae adipisci et saepe non qui illum ratione nemo amet voluptates dolore exercitationem provident. Ea sed incidunt cum eum excepturi vitae consequuntur eius quam earum? Repudiandae explicabo incidunt molestiae animi. Quibusdam veniam rerum minima error, quos voluptas incidunt. Est ex nesciunt ea id, dolor harum nemo quo quibusdam molestias dicta quae modi inventore. Sit dicta iure voluptatum modi. Recusandae harum blanditiis in dolore quasi officiis minus quos veritatis eveniet corporis eaque odio esse deserunt dolorum quod qui tempore, asperiores repellat numquam dolorem nobis! Provident soluta officiis temporibus optio, sapiente aspernatur accusantium ipsam velit necessitatibus natus placeat obcaecati consectetur quia. Reiciendis ipsum tempora non, dicta quod nesciunt. Magni, harum laudantium inventore omnis fugiat quia explicabo temporibus itaque officiis minus autem cumque! Necessitatibus dolorum aliquid omnis, sed ullam voluptatem reiciendis voluptate. Ad minima voluptatem praesentium totam eum consequuntur reiciendis quae soluta ipsam cupiditate? Officia labore modi illum libero error ad fugit sit nostrum, totam esse magnam doloremque repellendus. Similique, iure sed voluptatem quia molestiae aut incidunt facilis sequi! Veniam cupiditate optio magnam officiis cumque beatae laudantium, quas natus at aliquid nostrum, voluptatem aliquam quia doloremque, fugit fuga facere esse. Nostrum numquam nam, praesentium iusto accusamus quasi delectus rem vero laborum, optio blanditiis commodi id quidem beatae in. Laudantium fugit aspernatur impedit quam maiores officiis! Odit, est quae obcaecati repudiandae modi aliquid corporis natus dolores harum porro perferendis magni nam. Aperiam provident accusamus soluta optio eaque incidunt, quos modi nulla eligendi quo unde ipsa. Maxime distinctio minus beatae consequuntur assumenda ab vitae pariatur. Commodi maiores eius esse totam accusantium molestiae accusamus quas fugiat placeat quaerat voluptate corrupti architecto sapiente reiciendis obcaecati molestias, at tempore quisquam! Quam ratione aliquid quo illo delectus eaque quae reiciendis dicta corporis obcaecati, nesciunt veritatis molestiae impedit ut mollitia nam quisquam in aut quia nemo. Ducimus nulla assumenda numquam debitis recusandae dicta quam amet dolores, reprehenderit reiciendis ipsum sapiente sit alias obcaecati praesentium consequatur ipsa natus iste distinctio officia vel fugiat dolore delectus. Molestiae vero omnis blanditiis perspiciatis quibusdam, ipsam quo fugiat sunt pariatur minima aperiam ratione, unde distinctio porro incidunt praesentium repellendus aliquam autem dolores natus. Ab corporis earum veniam corrupti neque aperiam! Perferendis, eligendi, praesentium totam quia excepturi exercitationem dolores debitis cumque optio consectetur et suscipit cupiditate fuga nam commodi minima molestiae odit consequatur id enim aut quisquam eum. Modi dolores fuga neque praesentium repellendus, aspernatur ea quod? Corporis quaerat, nobis culpa quod nesciunt eum distinctio itaque cumque molestias impedit, deleniti delectus. Eum repellat architecto velit delectus eius praesentium, temporibus a nobis ad unde quaerat minus illum eos culpa earum possimus? Doloribus nostrum, impedit aut, officia amet at fuga velit minima tempora, harum molestiae non nisi quia maxime? Odio quo reiciendis nostrum repudiandae, alias delectus aut ullam quisquam. Eius?"})]})}var d=a(8),b=a(7),h=function(e){var t=e.wavescapeMatrix,a=Object(i.useRef)(null),r=400,n=400;return Object(i.useEffect)((function(){var e=a.current,i=e.getContext("2d");e.width=r*devicePixelRatio,e.height=n*devicePixelRatio,i.scale(devicePixelRatio,devicePixelRatio),e.style.width="400px",e.style.height="400px";var s,c=[0,0],o=[e.width-c[0],e.height-c[1]];t&&(s=t[0].length,i.clearRect(0,0,i.canvas.width,i.canvas.height),i.setTransform(1,0,0,-1,0,i.canvas.height),function(e,t,a){for(var i=0;i<e.length-1;i++)for(var r=0;r<e[i].length-1;r++)0===i?(t.beginPath(),t.moveTo(e[i][r].x,e[i][r].y),t.lineTo(e[i][r+1].x,e[i][r+1].y),t.lineTo(e[i+1][r].x,e[i+1][r].y),t.fillStyle=a[i][r],t.fill()):(t.beginPath(),t.moveTo(e[i][r].x,e[i][r].y),t.lineTo(e[i-1][r+1].x,e[i-1][r+1].y),t.lineTo(e[i][r+1].x,e[i][r+1].y),t.lineTo(e[i+1][r].x,e[i+1][r].y),t.fillStyle=a[i][r],t.fill())}(function(e,t,a,i,r){for(var n=e/a,s=[],c=0;c<a+1;c++){for(var o=[],l=0;l<a+1;l++)c<=l&&o.push({x:(l-c)*n+c*n/2+i,y:c*n+r});s.push(o)}return s}(o[0],0,s,c[0],c[1]),i,t))}),[t,r,n]),Object(o.jsx)("canvas",{width:r,height:n,ref:a})};var p=[[{label:"\u03a9",x:0,y:0},{label:"C",x:1,y:0},{label:"C\u266f",x:.866,y:-.5},{label:"D",x:.5,y:-.866},{label:"D\u266f",x:0,y:-1},{label:"E",x:-.5,y:-.866},{label:"F",x:-.866,y:-.5},{label:"F\u266f",x:-1,y:0},{label:"G",x:-.866,y:.5},{label:"G\u266f",x:-.5,y:.866},{label:"A",x:0,y:1},{label:"A\u266f",x:.5,y:.866},{label:"B",x:.866,y:.5}],[{label:"\u03a9",x:0,y:0},{label:"T_0",x:1,y:0},{label:"T_1",x:.5,y:-.866},{label:"T_2",x:-.5,y:-.866},{label:"T_3",x:-1,y:0},{label:"T_4",x:-.5,y:.866},{label:"T_5",x:.5,y:.866}],[{label:"\u03a9",x:0,y:0},{label:"C+",x:1,y:0},{label:"C\u266f+",x:0,y:-1},{label:"D+",x:-1,y:0},{label:"D\u266f+",x:0,y:1},{label:"H_0,3",x:.5,y:.5},{label:"H_0,1",x:.5,y:-.5},{label:"H_1,2",x:-.5,y:-.5},{label:"H_2,3",x:-.5,y:.5}],[{label:"\u03a9",x:0,y:0},{label:"C^o7",x:1,y:0},{label:"C\u266f^o7",x:-.5,y:-.866},{label:"D^o7",x:-.5,y:.866},{label:"O_0,2",x:.25,y:.433},{label:"O_0,1",x:.25,y:-.433},{label:"O_1,2",x:-.5,y:0}],[{label:"\u03a9",x:0,y:0},{label:"C",x:1,y:0},{label:"F",x:.866,y:-.5},{label:"A\u266f",x:.5,y:-.866},{label:"D\u266f",x:0,y:-1},{label:"G\u266f",x:-.5,y:-.866},{label:"C\u266f",x:-.866,y:-.5},{label:"F\u266f",x:-1,y:0},{label:"B",x:-.866,y:.5},{label:"E",x:-.5,y:.866},{label:"A",x:0,y:1},{label:"D",x:.5,y:.866},{label:"G",x:.866,y:.5},{label:"\u266e",x:.267,y:.462},{label:"5\u266d",x:0,y:-.533},{label:"2\u266f",x:-.267,y:.462},{label:"3\u266d",x:.462,y:-.267},{label:"4\u266f",x:-.533,y:0},{label:"\u266d",x:.462,y:.267},{label:"6\u266f",x:-.267,y:-.462},{label:"\u266f",x:0,y:.533},{label:"4\u266d",x:.267,y:-.462},{label:"3\u266f",x:-.462,y:.267},{label:"2\u266d",x:.533,y:0},{label:"5\u266f",x:-.462,y:-.267}],[{label:"\u03a9",x:0,y:0},{label:"WT_1",x:1,y:0},{label:"WT_2",x:-1,y:0}]],m=a(16),j=a(224),x=m.c().domain([0,1]).range(m.b(0,255,1)),v=function(e,t,a){var i,r,n,s=Math.atan2(t,e);return(s=-s)<0&&(s+=2*Math.PI),s>=0&&s<j.f/3?(i=1,r=3*s/j.f,n=0):s>=j.f/3&&s<2*j.f/3?(i=2-3*s/j.f,r=1,n=0):s>=2*j.f/3&&s<j.f?(i=0,r=1,n=3*s/j.f-2):s>=j.f&&s<4*j.f/3?(i=0,r=4-3*s/j.f,n=1):s>=4*j.f/3&&s<5*j.f/3?(i=3*s/j.f-4,r=0,n=1):s>=5*j.f/3&&s<2*j.f&&(i=1,r=0,n=6-3*s/j.f),{r:i=x(i),g:r=x(r),b:n=x(n),a:x(a)}};function O(e){var t=e.toPolar(),a=t.phi,i=t.r;a<0&&(a+=2*j.f);var r=function(e){var t,a,i;return e>=0&&e<j.f/3?(t=1,a=3*e/j.f,i=0):e>=j.f/3&&e<2*j.f/3?(t=2-3*e/j.f,a=1,i=0):e>=2*j.f/3&&e<j.f?(t=0,a=1,i=3*e/j.f-2):e>=j.f&&e<4*j.f/3?(t=0,a=4-3*e/j.f,i=1):e>=4*j.f/3&&e<5*j.f/3?(t=3*e/j.f-4,a=0,i=1):e>=5*j.f/3&&e<2*j.f&&(t=1,a=0,i=6-3*e/j.f),t=x(t),a=x(a),i=x(i),"rgb(".concat(t,", ").concat(a,", ").concat(i,")")}(a).slice(3,-1);return"rgba".concat(r,", ").concat(i,")")}var g=function(e){var t=e.protoDataCoeff,a=e.traceDataCoeff,r=e.userPcvsCoeff,n=e.currentSubdiv,s=e.performanceCoeff,c=Object(i.useRef)(null),l=400,u=l,f=180,d=.01;Object(i.useEffect)((function(){var e=c.current,t=e.getContext("2d"),a=Math.floor(f*devicePixelRatio),i=t.createImageData(2*a,2*a),r=i.data;e.width=l*devicePixelRatio,e.height=u*devicePixelRatio,t.scale(devicePixelRatio,devicePixelRatio),e.style.width="400px",e.style.height="400px";for(var n=-a;n<a;n++)for(var s=-a;s<a;s++){var o=Math.sqrt(n*n+s*s);if(!(o>a)){var d=4*(n+a+(s+a)*(2*a)),b=v(n,s,o/a);r[d]=b.r,r[d+1]=b.g,r[d+2]=b.b,r[d+3]=b.a}}t.putImageData(i,0,0)}),[l,u,f]),Object(i.useEffect)((function(){c.current.getContext("2d").getImageData(0,0,1,1)}),[]);var b=function(e,t,a,i){var r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,n=m.a().innerRadius(0).outerRadius(t*l/2).startAngle(0).endAngle(2*Math.PI);return Object(o.jsx)("path",{transform:"translate(".concat(e.x*f,",").concat(-e.y*f,")"),fill:a,fillOpacity:r,d:n()},i)};return Object(o.jsx)(o.Fragment,{children:Object(o.jsxs)("svg",{width:l,height:u,children:[Object(o.jsx)("foreignObject",{x:20,y:20,width:l,height:u,children:Object(o.jsx)("canvas",{style:{zIndex:"-1"},width:l,height:u,ref:c})}),Object(o.jsxs)("g",{transform:"translate(".concat(200,",").concat(200,")"),children:[Object(o.jsx)("path",{fill:"azure",d:m.a().innerRadius(181).outerRadius(179).startAngle(0).endAngle(2*Math.PI)()}),t?t.map((function(e,t){return function(e,t){var a=m.a().innerRadius(4).outerRadius(6).startAngle(0).endAngle(2*Math.PI),i="",r="",n=!1;if(e.label.includes("_")||e.label.includes("^"))for(var s=0;s<e.label.length;s++)"_"===e.label[s]&&(i=e.label.slice(0,s),r=e.label.slice(s+1,e.label.length),n=!0),"^"===e.label[s]&&(i=e.label.slice(0,s),r=e.label.slice(s+1,e.label.length));else i=e.label;return Object(o.jsxs)("g",{transform:"translate(".concat(e.x*f,",").concat(-e.y*f,")"),children:[Object(o.jsx)("path",{fill:"grey",d:a()},t),Object(o.jsxs)("text",{textAnchor:"middle",dx:20*-Math.sign(e.x),dy:20*-Math.sign(-e.y),fontSize:"20px",children:[i,n?Object(o.jsx)("tspan",{fontSize:15,baselineShift:"sub",children:r}):Object(o.jsx)("tspan",{fontSize:15,baselineShift:"super",children:r})]})]},"p.".concat(t))}(e,t)})):null,a?a.map((function(e,t){return b(e,d,"black",t,.1)})):null,a?function(e){var t=m.a().innerRadius(0).outerRadius(e*l/2).startAngle(0).endAngle(2*Math.PI),i=m.a().innerRadius(e*l/2).outerRadius((e+.005)*l/2).startAngle(0).endAngle(2*Math.PI),r=[];r.push(1);for(var s=1;s<10;s++)r.push(.8*r[s-1]);return(n<10?a.slice(0,n+1):a.slice(n-10,n)).reverse().map((function(e,a){return Object(o.jsxs)("g",{children:[Object(o.jsx)("path",{transform:"translate(".concat(e.x*f,",").concat(-e.y*f,")"),fill:"white",fillOpacity:r[a],d:t()},a),Object(o.jsx)("path",{transform:"translate(".concat(e.x*f,",").concat(-e.y*f,")"),fill:"black",fillOpacity:r[a],d:i()},"t.".concat(a))]},"g.".concat(a))}))}(d):null,r?r.map((function(e,t){return b(e,d,"teal",t)})):null,b(s,.03,"teal")]})]})})},y=a(13),C=a(38);function D(e,t,a){var i=new C.Midi(e);y.d.cancel(0),a(0),y.d.stop();var r=i.tracks.filter((function(e){return!1===e.instrument.percussion})),n=[];r.forEach((function(e){return e.notes.forEach((function(e){n.push(e)}))})),n.forEach((function(e){return e.subdiv=Math.floor(e.time/t)}));new y.b((function(e,t){q.triggerAttackRelease(t.name,t.duration,e,t.velocity),a(t.subdiv)}),[].concat(n)).start(0)}var q=new y.c({urls:{A0:"A0.mp3",C1:"C1.mp3","D#1":"Ds1.mp3","F#1":"Fs1.mp3",A1:"A1.mp3",C2:"C2.mp3","D#2":"Ds2.mp3","F#2":"Fs2.mp3",A2:"A2.mp3",C3:"C3.mp3","D#3":"Ds3.mp3","F#3":"Fs3.mp3",A3:"A3.mp3",C4:"C4.mp3","D#4":"Ds4.mp3","F#4":"Fs4.mp3",A4:"A4.mp3",C5:"C5.mp3","D#5":"Ds5.mp3","F#5":"Fs5.mp3",A5:"A5.mp3",C6:"C6.mp3","D#6":"Ds6.mp3","F#6":"Fs6.mp3",A6:"A6.mp3",C7:"C7.mp3","D#7":"Ds7.mp3","F#7":"Fs7.mp3",A7:"A7.mp3",C8:"C8.mp3"},release:1,baseUrl:"https://tonejs.github.io/audio/salamander/"}).toDestination();function A(){return Object(o.jsxs)("div",{id:"playStopButtons",children:[Object(o.jsx)("div",{id:"stop",className:"btn fas fa-stop fa-4x",onClick:function(){console.log("stop"),y.d.stop()}}),Object(o.jsx)("div",{id:"play",className:"btn fas fa-play fa-4x",onClick:function(){console.log("play"),"running"!==y.e.state&&(console.log("state running"),y.e.resume()),y.d.start()}}),Object(o.jsx)("div",{id:"pause",className:"btn fas fa-pause fa-4x",onClick:function(){console.log("pause"),y.d.pause()}})]})}var S=a(0),F=a(1);function w(e){for(var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],a=arguments.length>2&&void 0!==arguments[2]&&arguments[2],i=arguments.length>3&&void 0!==arguments[3]&&arguments[3],r=e.length,n=[],s=0;s<r/2+1;s++){for(var c=0,o=0;o<r;o++)c=j.a(j.e(e[o],j.c(j.e(j.d,-2*j.f*s*o/r))),c);n.push(c)}if(n=n.slice(),t){var l=n[0];0!=l&&(n=n.map((function(e){return j.b(e,l)})))}return a&&n.forEach((function(e){e.re=Math.round(1e4*e.re)/1e4,e.im=Math.round(1e4*e.im)/1e4})),i&&(n=n.map((function(e){return e.toPolar()}))),n}function R(e){for(var t=e[0],a=1;a<e.length;a++){for(var i=[],r=0;r<e[a].length;r++)i.push(j.a(t[r],e[a][r]));t=i.slice()}var n=t[0];return t=t.map((function(e){return j.b(e,n)}))}var k=function(){function e(){Object(S.a)(this,e),this.C=0,this.Cs=0,this.D=0,this.Ds=0,this.E=0,this.F=0,this.Fs=0,this.G=0,this.Gs=0,this.A=0,this.As=0,this.B=0}return Object(F.a)(e,[{key:"addNoteDuration",value:function(e,t){switch(e){case"C":this.C+=t;break;case"C#":this.Cs+=t;break;case"D":this.D+=t;break;case"D#":this.Ds+=t;break;case"E":this.E+=t;break;case"F":this.F+=t;break;case"F#":this.Fs+=t;break;case"G":this.G+=t;break;case"G#":this.Gs+=t;break;case"A":this.A+=t;break;case"A#":this.As+=t;break;case"B":this.B+=t}}},{key:"getPcvAsArray",value:function(){return[this.C,this.Cs,this.D,this.Ds,this.E,this.F,this.Fs,this.G,this.Gs,this.A,this.As,this.B]}},{key:"add",value:function(e){this.C=e.C,this.Cs=e.Cs,this.D=e.D,this.Ds=e.Ds,this.E=e.E,this.F=e.F,this.Fs=e.Fs,this.G=e.G,this.Gs=e.Gs,this.A=e.A,this.As=e.As,this.B=e.B}}]),e}();function P(e,t,a){for(var i=[],r=t,n=function(t){var a=[];e.forEach((function(e){var i=e.time,n=e.duration;if(function(e,t,a,i){if(e>a&&e<a+i||e+t>a&&e+t<a+i||e<=a&&e+t>=a+i)return!0;return!1}(i,n,t,r)){var s={pitch:e.pitch};s.duration=i<t?i+n<t+r?i+n-t:r:i+n<=t+r?n:t+r-i,a.push(s)}})),i.push(a)},s=0;s<a;s+=t)n(s);return i}function M(){var e=Object(i.useState)(p),t=Object(b.a)(e,2),a=t[0],r=t[1],n=Object(i.useState)(!0),s=Object(b.a)(n,2),c=s[0],l=s[1],u=Object(i.useState)([]),f=Object(b.a)(u,2),m=f[0],j=f[1],x=Object(i.useState)([]),v=Object(b.a)(x,2),y=v[0],q=v[1],S=Object(i.useState)(0),F=Object(b.a)(S,2),M=F[0],I=F[1],E=Object(i.useState)(""),T=Object(b.a)(E,2),_=T[0],G=T[1],B=Object(i.useState)([]),z=Object(b.a)(B,2),N=z[0],H=z[1],L=Object(i.useState)(1),W=Object(b.a)(L,2),V=W[0],J=W[1],Q=Object(i.useRef)(null);Object(i.useEffect)((function(){var e=document.getElementById("file").files[0];if(e){var t=+Q.current.value,a=new FileReader;a.readAsArrayBuffer(e),a.onload=function(e){D(e.target.result,t,I);for(var a=function(e,t){var a=new C.Midi(e);console.log(a);var i=a.duration,r=[];a.tracks.filter((function(e){return!1===e.instrument.percussion})).forEach((function(e){r.push(P(e.notes,t,i))}));for(var n=[],s=0;s<r[0].length;s++)n.push(new k);for(var c=0;c<r.length;c++)for(var o=0;o<r[c].length;o++)for(var l=0;l<r[c][o].length;l++){var u=r[c][o][l],f=u.pitch,d=u.duration;n[o].addNoteDuration(f,d)}var b=n.map((function(e){return w(e.getPcvAsArray())})),h=[];return h.push(b),h}(e.target.result,t),i=[],r=a[0],n=1;n<7;n++){for(var s=[],c=0;c<r.length;c++)s.push({x:r[c][n].re,y:r[c][n].im});i.push(s)}q(i),j(function(e){for(var t=e[0].length,a=e[0].length,i=2,r=1;r<t;r++){for(var n=[],s=0;s+i<=a;s++){var c=e[0].slice(s,s+i);n.push(R(c))}i++,e.push(n)}for(var o=[],l=0;l<6;l++){for(var u=[],f=0;f<e.length;f++){for(var d=[],b=0;b<e[f].length;b++)d.push("");u.push(d)}o.push(u)}for(var h=0;h<e.length;h++)for(var p=0;p<e[h].length;p++)for(var m=1;m<e[h][p].length;m++)o[m-1][h][p]=O(e[h][p][m]);return o}(a)),console.log(i[0].length)}}}),[_]);return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(A,{}),Object(o.jsx)("form",{onSubmit:function(e){var t;e.preventDefault();try{t=function(e){for(var t=[],a=!1,i=!1,r=0;r<e.length;r++)if("{"!==e[r]&&"("!==e[r]||(a=!0,"{"===e[r]&&(i=!0)),a){for(var n=[],s=r+1;"}"!==e[s]&&")"!==e[s];s++)n.push(e[s]);if(""===(n=n.join("")))throw"empty input";for(var c=[],o=0,l=0;l<n.length;l++){if(","===n[l]){var u=n.slice(l-o,l);if(0===u.length)throw"two consecutive comas";if(u<0||u>=12)throw"set notation: out of range";c.push(+u),o=-1}o++}var f=n.slice(n.length-o,n.length);if(c.push(+f),i){for(var d=[0,0,0,0,0,0,0,0,0,0,0,0],b=0;b<c.length;b++)d[c[b]]+=1;t.push(d)}else t.push(c);a=!1,i=!1,r+=o}if(0===t.length)throw"invalid input";return t}(e.target[0].value)}catch(f){return void console.log(f)}for(var a=[],i=0;i<t.length;i++)a.push(w(t[i],!0,!0,!1));for(var r=[],n=1;n<7;n++){for(var s=[],c=0;c<a.length;c++)s.push({x:a[c][n].re,y:a[c][n].im});r.push(s)}if(0===N.length)H(r);else{for(var o=N.slice(),l=0;l<N.length;l++){var u;(u=o[l]).push.apply(u,Object(d.a)(r[l]))}H(o)}},children:Object(o.jsxs)("div",{children:[Object(o.jsx)("label",{htmlFor:"pitchClass",children:"Pitch class: "}),Object(o.jsx)("input",{type:"text",name:"pitchClass",id:"pitchClass",autoComplete:"off",placeholder:"Ex.(1,0,0,0,1,0,0,1,0,0,0,1)"}),Object(o.jsx)("button",{type:"submit",children:"Submit"})]})}),Object(o.jsxs)("div",{children:[Object(o.jsx)("label",{htmlFor:"showPrototypes",children:"Show prototypes: "}),Object(o.jsx)("input",{type:"checkbox",id:"showPrototypes",name:"showPrototypes",onChange:function(){return function(e){var t,i=a.slice();e?(t=i).push.apply(t,Object(d.a)(p)):i=[],r(i),l(e)}(!c)},checked:c})]}),Object(o.jsx)("form",{onSubmit:function(e){e.preventDefault()},children:Object(o.jsxs)("div",{children:[Object(o.jsx)("label",{htmlFor:"file",children:"Select a MIDI file: "}),Object(o.jsx)("input",{type:"file",id:"file",name:"file",value:_,onChange:function(e){return G(e.target.value)}})]})}),Object(o.jsxs)("div",{children:[Object(o.jsx)("input",{type:"range",id:"resolutin",name:"resolution",defaultValue:"1",min:"0.1",max:"10",step:"0.1",onChange:function(){return J(Q.current.value)},ref:Q}),Object(o.jsxs)("label",{htmlFor:"resolution",children:["Resolution: ",V]})]}),Object(o.jsx)(g,{protoDataCoeff:a[0],traceDataCoeff:y[0],userPcvsCoeff:N[0],currentSubdiv:M}),Object(o.jsx)(h,{wavescapeMatrix:m[0]}),Object(o.jsx)(g,{protoDataCoeff:a[1],traceDataCoeff:y[1],userPcvsCoeff:N[1],currentSubdiv:M}),Object(o.jsx)(h,{wavescapeMatrix:m[1]}),Object(o.jsx)(g,{protoDataCoeff:a[2],traceDataCoeff:y[2],userPcvsCoeff:N[2],currentSubdiv:M}),Object(o.jsx)(h,{wavescapeMatrix:m[2]}),Object(o.jsx)(g,{protoDataCoeff:a[3],traceDataCoeff:y[3],userPcvsCoeff:N[3],currentSubdiv:M}),Object(o.jsx)(h,{wavescapeMatrix:m[3]}),Object(o.jsx)(g,{protoDataCoeff:a[4],traceDataCoeff:y[4],userPcvsCoeff:N[4],currentSubdiv:M}),Object(o.jsx)(h,{wavescapeMatrix:m[4]}),Object(o.jsx)(g,{protoDataCoeff:a[5],traceDataCoeff:y[5],userPcvsCoeff:N[5],currentSubdiv:M}),Object(o.jsx)(h,{wavescapeMatrix:m[5]})]})}var I=a(4);var E=function(e){var t=e.protoDataCoeff,a=e.traceDataCoeff,r=e.currentSubdiv,n=e.deltaTime,s=Object(i.useState)([]),c=Object(b.a)(s,2),l=c[0],u=c[1],f=Object(i.useState)({x:0,y:0}),d=Object(b.a)(f,2),h=d[0],p=d[1],j=Object(i.useState)({x:0,y:0}),x=Object(b.a)(j,2),O=x[0],g=x[1],y=Object(i.useState)(),C=Object(b.a)(y,2),D=C[0],q=C[1],A=Object(i.useState)(0),S=Object(b.a)(A,2),F=S[0],w=(S[1],1),R=Object(i.useRef)(null),k=400,P=k,M=20,E=180;return Object(i.useEffect)((function(){var e=R.current,t=e.getContext("2d"),a=Math.floor(E*devicePixelRatio),i=t.createImageData(2*a,2*a),r=i.data;e.width=k*devicePixelRatio,e.height=P*devicePixelRatio,t.scale(devicePixelRatio,devicePixelRatio),e.style.width="400px",e.style.height="400px";for(var n=-a;n<a;n++)for(var s=-a;s<a;s++){var c=Math.sqrt(n*n+s*s);if(!(c>a)){var o=4*(n+a+(s+a)*(2*a)),l=v(n,s,c/a);r[o]=l.r,r[o+1]=l.g,r[o+2]=l.b,r[o+3]=l.a}}t.putImageData(i,0,0),q(t.getImageData(0,0,k*devicePixelRatio,P*devicePixelRatio)),console.log(D)}),[k,P,E]),Object(i.useEffect)((function(){R.current.getContext("2d").getImageData(0,0,1,1)}),[]),Object(i.useEffect)((function(){console.log("current subdiv: ",r),r>0&&(p(Object(I.a)({},a[r])),g(Object(I.a)({},a[r+1])),clearInterval(F),function(){var e=R.current.getContext("2d"),t=Object(I.a)({},O),a=Object(I.a)({},h);t.x=t.x*E-M,t.y=-t.y*E-M,a.x=a.x*E-M,a.y=-a.y*E-M;var i=function(e,t,a){a>1&&(a=1);return{x:e.x+(t.x-e.x)*a,y:e.y+(t.y-e.y)*a}}(a,t,l[w]);e.globalCompositeOperation="destination-over",e.clearRect(0,0,k,P),e.strokeStyle="rgba(0, 153, 255, 1)",e.lineWidth=1,e.save(),e.translate(200,200),e.putImageData(D,0,0),e.beginPath(),e.moveTo(a.x,a.y),e.lineTo(i.x,i.y),e.stroke(),e.restore();var r=w+1;w=r>30?1:r}())}),[r]),Object(i.useEffect)((function(){if(n>0){for(var e=[0],t=1;t<31;t++)e.push(e[t-1]+1/30);u(e)}}),[n]),Object(o.jsx)(o.Fragment,{children:Object(o.jsxs)("svg",{width:k,height:P,children:[Object(o.jsx)("foreignObject",{x:M,y:M,width:k,height:P,children:Object(o.jsx)("canvas",{style:{zIndex:"-1"},width:k,height:P,ref:R})}),Object(o.jsxs)("g",{transform:"translate(".concat(200,",").concat(200,")"),children:[Object(o.jsx)("path",{fill:"azure",d:m.a().innerRadius(181).outerRadius(179).startAngle(0).endAngle(2*Math.PI)()}),t?t.map((function(e,t){return function(e,t){var a=m.a().innerRadius(4).outerRadius(6).startAngle(0).endAngle(2*Math.PI),i="",r="",n=!1;if(e.label.includes("_")||e.label.includes("^"))for(var s=0;s<e.label.length;s++)"_"===e.label[s]&&(i=e.label.slice(0,s),r=e.label.slice(s+1,e.label.length),n=!0),"^"===e.label[s]&&(i=e.label.slice(0,s),r=e.label.slice(s+1,e.label.length));else i=e.label;return Object(o.jsxs)("g",{transform:"translate(".concat(e.x*E,",").concat(-e.y*E,")"),children:[Object(o.jsx)("path",{fill:"grey",d:a()},t),Object(o.jsxs)("text",{textAnchor:"middle",dx:20*-Math.sign(e.x),dy:20*-Math.sign(-e.y),fontSize:"20px",children:[i,n?Object(o.jsx)("tspan",{fontSize:15,baselineShift:"sub",children:r}):Object(o.jsx)("tspan",{fontSize:15,baselineShift:"super",children:r})]})]},"p.".concat(t))}(e,t)})):null,a?function(e){var t=m.a().innerRadius(0).outerRadius(e*k/2).startAngle(0).endAngle(2*Math.PI),i=m.a().innerRadius(e*k/2).outerRadius((e+.005)*k/2).startAngle(0).endAngle(2*Math.PI),n=[];n.push(1);for(var s=1;s<10;s++)n.push(.8*n[s-1]);return(r<10?a.slice(0,r+1):a.slice(r-10,r)).reverse().map((function(e,a){return Object(o.jsxs)("g",{children:[Object(o.jsx)("path",{transform:"translate(".concat(e.x*E,",").concat(-e.y*E,")"),fill:"white",fillOpacity:n[a],d:t()},a),Object(o.jsx)("path",{transform:"translate(".concat(e.x*E,",").concat(-e.y*E,")"),fill:"black",fillOpacity:n[a],d:i()},"t.".concat(a))]},"g.".concat(a))}))}(.01):null]})]})})};function T(){var e=Object(i.useState)(p),t=Object(b.a)(e,2),a=t[0],r=t[1],n=Object(i.useState)(!0),s=Object(b.a)(n,2),c=s[0],l=s[1],u=Object(i.useState)(1),f=Object(b.a)(u,2),h=f[0],m=f[1],j=Object(i.useState)(1),x=Object(b.a)(j,2),v=x[0],O=x[1],g=Object(i.useState)(!1),y=Object(b.a)(g,2),q=y[0],S=y[1],F=Object(i.useRef)(null),R=Object(i.useState)([]),M=Object(b.a)(R,2),I=M[0],T=M[1],_=Object(i.useState)(0),G=Object(b.a)(_,2),B=G[0],z=G[1],N=Object(i.useState)(0),H=Object(b.a)(N,2),L=H[0],W=H[1],V=Object(i.useState)(""),J=Object(b.a)(V,2),Q=J[0],U=J[1];Object(i.useEffect)((function(){var e=document.getElementById("file").files[0];if(e){var t=new FileReader;t.readAsArrayBuffer(e),t.onload=function(e){var t=function(e){var t,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,r=arguments.length>3?arguments[3]:void 0,n=new C.Midi(e);if(console.log(n),r)t=isNaN(i)?1:i;else{var s=n.header.tempos.map((function(e){return Math.round(e.bpm)})),c=Math.max.apply(Math,Object(d.a)(s));t=a*(60/c)}console.log(t);var o=n.duration,l=[];n.tracks.filter((function(e){return!1===e.instrument.percussion})).forEach((function(e){l.push(P(e.notes,t,o))}));for(var u=[],f=0;f<l[0].length;f++)u.push(new k);for(var b=0;b<l.length;b++)for(var h=0;h<l[b].length;h++)for(var p=0;p<l[b][h].length;p++){var m=l[b][h][p],j=m.pitch,x=m.duration;u[h].addNoteDuration(j,x)}var v=u.map((function(e){return w(e.getPcvAsArray())})),O=[];return O.push(v),{dftCoeffsLinear:O,resolution:t}}(e.target.result,h,v,q),a=t.dftCoeffsLinear,i=t.resolution;W(i),D(e.target.result,i,z);for(var r=[],n=a[0],s=1;s<7;s++){for(var c=[],o=0;o<n.length;o++)c.push({x:n[o][s].re,y:n[o][s].im});r.push(c)}T(r)}}}),[Q]);return Object(o.jsxs)(o.Fragment,{children:[Object(o.jsx)(A,{}),Object(o.jsxs)("div",{children:[Object(o.jsx)("label",{htmlFor:"showPrototypes",children:"Show prototypes: "}),Object(o.jsx)("input",{type:"checkbox",id:"showPrototypes",name:"showPrototypes",onChange:function(){return function(e){var t,i=a.slice();e?(t=i).push.apply(t,Object(d.a)(p)):i=[],r(i),l(e)}(!c)},checked:c})]}),Object(o.jsx)("form",{onSubmit:function(e){e.preventDefault()},children:Object(o.jsxs)("div",{children:[Object(o.jsx)("label",{htmlFor:"file",children:"Select a MIDI file: "}),Object(o.jsx)("input",{type:"file",id:"file",name:"file",value:Q,onChange:function(e){return U(e.target.value)}})]})}),Object(o.jsxs)("div",{style:{fontSize:"40px"},onChange:function(e){switch(e.target.value){case"sixteenth":m(.25),S(!1);break;case"eighth":m(.5),S(!1);break;case"quarter":m(1),S(!1);break;case"half":m(2),S(!1);break;case"whole":m(4),S(!1);break;case"seconds":S(!0);O(parseFloat(F.current.value));break;default:m(1)}},children:[Object(o.jsx)("input",{type:"radio",id:"resChoice1",name:"multiRes",value:"sixteenth"}),Object(o.jsx)("label",{htmlFor:"resChoice1",children:" \ud834\udd61"}),Object(o.jsx)("input",{type:"radio",id:"resChoice2",name:"multiRes",value:"eighth"}),Object(o.jsx)("label",{htmlFor:"resChoice2",children:"\ud834\udd60"}),Object(o.jsx)("input",{type:"radio",id:"resChoice3",name:"multiRes",value:"quarter",defaultChecked:!0}),Object(o.jsx)("label",{htmlFor:"resChoice3",children:"\u2669"}),Object(o.jsx)("input",{type:"radio",id:"resChoice4",name:"multiRes",value:"half"}),Object(o.jsx)("label",{htmlFor:"resChoice4",children:"\ud834\udd5e"}),Object(o.jsx)("input",{type:"radio",id:"resChoice5",name:"multiRes",value:"whole"}),Object(o.jsx)("label",{htmlFor:"resChoice5",children:"\ud834\udd5d"}),Object(o.jsx)("input",{type:"radio",id:"resChoice6",name:"multiRes",value:"seconds"}),Object(o.jsx)("label",{htmlFor:"resChoice5",style:{fontSize:"15px"},children:"in seconds"})]}),Object(o.jsxs)("div",{children:[Object(o.jsx)("label",{htmlFor:"resolutionSeconds",children:"Resolution (seconds): "}),Object(o.jsx)("input",{type:"text",name:"resolutionSeconds",id:"resolutionSeconds",autoComplete:"off",placeholder:"Ex. 1.5",onChange:function(){O(parseFloat(F.current.value))},ref:F})]}),Object(o.jsx)(E,{protoDataCoeff:a[0],traceDataCoeff:I[0],currentSubdiv:B,deltaTime:L}),Object(o.jsx)(E,{protoDataCoeff:a[1],traceDataCoeff:I[1],currentSubdiv:B,deltaTime:L}),Object(o.jsx)(E,{protoDataCoeff:a[2],traceDataCoeff:I[2],currentSubdiv:B,deltaTime:L}),Object(o.jsx)(E,{protoDataCoeff:a[3],traceDataCoeff:I[3],currentSubdiv:B,deltaTime:L}),Object(o.jsx)(E,{protoDataCoeff:a[4],traceDataCoeff:I[4],currentSubdiv:B,deltaTime:L}),Object(o.jsx)(E,{protoDataCoeff:a[5],traceDataCoeff:I[5],currentSubdiv:B,deltaTime:L})]})}var _=function(){var e=Object(i.useState)(w([0,0,0,0,0,0,0,0,0,0,0,0]).map((function(e){return{x:e.re,y:e.im}}))),t=Object(b.a)(e,2),a=t[0],r=t[1],n=Object(i.useState)(p),s=Object(b.a)(n,2),c=s[0],l=s[1],u=Object(i.useState)(!0),f=Object(b.a)(u,2),h=f[0],m=f[1];return Object(i.useEffect)((function(){var e=[],t=new y.c({urls:{A0:"A0.mp3",C1:"C1.mp3","D#1":"Ds1.mp3","F#1":"Fs1.mp3",A1:"A1.mp3",C2:"C2.mp3","D#2":"Ds2.mp3","F#2":"Fs2.mp3",A2:"A2.mp3",C3:"C3.mp3","D#3":"Ds3.mp3","F#3":"Fs3.mp3",A3:"A3.mp3",C4:"C4.mp3","D#4":"Ds4.mp3","F#4":"Fs4.mp3",A4:"A4.mp3",C5:"C5.mp3","D#5":"Ds5.mp3","F#5":"Fs5.mp3",A5:"A5.mp3",C6:"C6.mp3","D#6":"Ds6.mp3","F#6":"Fs6.mp3",A6:"A6.mp3",C7:"C7.mp3","D#7":"Ds7.mp3","F#7":"Fs7.mp3",A7:"A7.mp3",C8:"C8.mp3"},release:1,baseUrl:"https://tonejs.github.io/audio/salamander/"}).toDestination();function a(a){var i=a.data[0],n=y.a(a.data[1],"midi").toNote(),s=Math.round(.05*a.data[2]);switch(i){case 144:s>0?(t.triggerAttack(n,y.f(),s),e.push(n)):(t.triggerRelease(n,y.f()),e.filter((function(e){return e!==n})));break;case 128:t.triggerRelease(n,y.f()),e=e.filter((function(e){return e!==n}))}!function(e){var t=[0,0,0,0,0,0,0,0,0,0,0,0];e.forEach((function(e){switch(e.includes("#")?e.slice(0,2):e.slice(0,1)){case"C":t[0]=1;break;case"C#":t[1]=1;break;case"D":t[2]=1;break;case"D#":t[3]=1;break;case"E":t[4]=1;break;case"F":t[5]=1;break;case"F#":t[6]=1;break;case"G":t[7]=1;break;case"G#":t[8]=1;break;case"A":t[9]=1;break;case"A#":t[10]=1;break;case"B":t[11]=1}}));var a=w(t);a=a.map((function(e){return{x:e.re,y:e.im}})),r(a)}(e)}function i(e){console.log("Name: ".concat(e.port.name,", Brand: ").concat(e.port.manufacturer,", State: ").concat(e.port.state,", Type: ").concat(e.port.type))}t.volume.value=-30,navigator.requestMIDIAccess&&navigator.requestMIDIAccess().then((function(e){e.onstatechange=i,e.inputs.forEach((function(e){e.onmidimessage=a}))}),(function(){console.log("Could not connect MIDI")}))}),[]),Object(o.jsxs)("div",{children:[Object(o.jsxs)("div",{children:[Object(o.jsx)("label",{htmlFor:"showPrototypes",children:"Show prototypes: "}),Object(o.jsx)("input",{type:"checkbox",id:"showPrototypes",name:"showPrototypes",onChange:function(){return function(e){var t,a=c.slice();e?(t=a).push.apply(t,Object(d.a)(p)):a=[],l(a),m(e)}(!h)},checked:h})]}),a.map((function(e,t){return Object(o.jsx)("h4",{children:"coeff".concat(t,":{Re:").concat(e.x,", Im:").concat(e.x,"}")},t)})),Object(o.jsx)(g,{protoDataCoeff:c[0],performanceCoeff:a[1]}),Object(o.jsx)(g,{protoDataCoeff:c[1],performanceCoeff:a[2]}),Object(o.jsx)(g,{protoDataCoeff:c[2],performanceCoeff:a[3]}),Object(o.jsx)(g,{protoDataCoeff:c[3],performanceCoeff:a[4]}),Object(o.jsx)(g,{protoDataCoeff:c[4],performanceCoeff:a[5]}),Object(o.jsx)(g,{protoDataCoeff:c[5],performanceCoeff:a[6]})]})};var G=function(){return Object(o.jsxs)(c.a,{basename:"/MIDFT",children:[Object(o.jsx)(l,{}),Object(o.jsxs)(u.c,{children:[Object(o.jsx)(u.a,{exact:!0,path:"/",component:f}),Object(o.jsx)(u.a,{exact:!0,path:"/visualization",component:M}),Object(o.jsx)(u.a,{exact:!0,path:"/live",component:T}),Object(o.jsx)(u.a,{exact:!0,path:"/keyboard",component:_})]})]})};s.a.render(Object(o.jsx)(r.a.StrictMode,{children:Object(o.jsx)(G,{})}),document.getElementById("root"))}},[[222,1,2]]]);
//# sourceMappingURL=main.7e790531.chunk.js.map