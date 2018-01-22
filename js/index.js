$(function(){
	const 
		sidelength = 40,//边长为30
		r = 0.3*sidelength,
		row = 16,
		col = 16;//15条线，16个格子
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	ctx.strokeStyle = 'black';

	const
		pad = 13,//棋盘边距
		width = sidelength*col,//宽
		height = sidelength*row;//高

		
	$(canvas).attr({'width':`${width+pad*2}px`,'height':`${height+pad*2}px`});

	function trans(x){
		return x+pad;
	}

	function draw(){//画棋盘
		ctx.strokeRect(pad,pad,width,height);

		ctx.beginPath();
		


		for(let i=1;i<row+2;i++){//画17条平行竖线
			ctx.moveTo(trans(i*sidelength),trans(0));
			ctx.lineTo(trans(i*sidelength),trans(height));
		}
		ctx.stroke();
		for(let i=1;i<col;i++){//画15条平行横线
			ctx.moveTo(trans(0),trans(i*sidelength));
			ctx.lineTo(trans(width),trans(i*sidelength));
		}
		ctx.stroke();
		ctx.closePath();
		
		ctx.beginPath();
		ctx.arc(trans(width/2),trans(height/2),5,0,Math.PI*2);//标出中心点
		ctx.fill();
		ctx.closePath();

	}

	draw();

	let nx=0,ny=0;
	let start = false;
	$(canvas).mousemove(function(e){
		let {x,y} = getPosition(e);
		
		x-=pad;y-=pad;
		//console.log({x:x,y:y});

		nx = Math.round(x/(sidelength));
		ny = Math.round(y/(sidelength));
		console.log([nx,ny]);

		/*if(!start){
			nx = newnx;
			ny = newny;
			start = true;
		}

		if(newnx!=nx && newny!=ny){//当前下棋点位置发生了变化
			cover(nx,ny);
			nx = newnx;
			ny = newny;
			draw();

			shadow(nx,ny);
		}*/
		
		// if(!start){
		// 	//ctx.clearRect(0,0,width+pad*2,height+pad*2);
		// 	//draw();
		// 	shadow(newnx,newny);
		// 	nx = newnx;
		// 	ny = newny;
		// 	start = true;
		// } else{
		// 	if(newnx!=nx || newny!=ny){
		// 		cover(nx,ny);
		// 		shadow(newnx,newny);
		// 		nx = newnx;
		// 		ny = newny;
		// 	}
		// }

		
		ctx.clearRect(0,0,width+pad*2,height+pad*2);
		draw();
		shadow(nx,ny);



	});

	function getPosition(e){//获取鼠标在canvas上的坐标
		let x = e.pageX - canvas.offsetLeft;
		let y = e.pageY - canvas.offsetTop;

		return {x:x,y:y};
	}

	function chess(player,nx,ny){
		this.player = player;
		this.nx = nx;
		this.ny = ny;
	}

	$(canvas).click(function(e){
		function place(player,nx,ny){//放置一颗棋子
			ctx.beginPath();
			ctx.arc(trans(nx*sidelength),trans(ny*sidelength),10,0,Math.PI*2);
			ctx.fill();
			ctx.closePath();
		}

		place(0,nx,ny);
	});

	function shadow(nx,ny){//根据鼠标位置提示下棋位置的幻影
		ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.arc(trans(nx*sidelength),trans(ny*sidelength),r,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();
	}

	/*function cover(nx,ny){//删除幻影 || 悔棋
		ctx.clearRect(trans(nx*sidelength-r),trans(ny*sidelength-r),r*2,r*2);
		ctx.beginPath();
		/*ctx.fillStyle = 'white';
		ctx.arc(trans(nx*sidelength),trans(ny*sidelength),r,0,Math.PI*2);
		ctx.fill();
		ctx.closePath();

		ctx.beginPath();
		ctx.strokeStyle = 'black';
		ctx.moveTo(trans(nx*sidelength),trans(ny*sidelength));
		ctx.lineTo(trans(nx*sidelength),trans(ny*sidelength)-r);
		ctx.lineTo(trans(nx*sidelength),trans(ny*sidelength)+r);
		ctx.moveTo(trans(nx*sidelength),trans(ny*sidelength));
		ctx.lineTo(trans(nx*sidelength-r),trans(ny*sidelength));
		ctx.lineTo(trans(nx*sidelength+r),trans(ny*sidelength));
		ctx.stroke();
		ctx.closePath();

	}*/
});