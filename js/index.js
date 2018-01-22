$(function(){
	const 
		sidelength = 40,//边长为30
		r = 0.3*sidelength,//每颗棋子的半径
		row = 16,
		col = 16,//15条线，16个格子
		pad = 13,//棋盘边距
		width = sidelength*col,//棋盘的宽
		height = sidelength*row,//棋盘的高
		backgroundColor = 'rgba(255,0,0,0.3)',//棋盘的背景颜色

		black = 'black',//0号玩家的棋的颜色
		white = 'white';//1号玩家的棋的颜色

	const chesses = [];//储存已经下了的棋子
	const blackChesses = [];//储存已经下了的黑棋子
	const whiteChesses = [];//储存已经下了的白棋子
	let nowPlayer = 0;//默认黑棋先手

	//获得canvas DOM
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');
	ctx.strokeStyle = 'black';
	$(canvas).attr({'width':`${width+pad*2}px`,'height':`${height+pad*2}px`});

	function trans(x){
		return x+pad;
	}

	function draw(){//画棋盘
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0,0,width+2*pad,height+2*pad);
		ctx.strokeRect(pad,pad,width,height);

		for(let i=0;i<3;i++){//加深线的颜色
			ctx.beginPath();
			for(let i=0;i<row+1;i++){//画17条平行竖线
				ctx.moveTo(trans(i*sidelength),trans(0));
				ctx.lineTo(trans(i*sidelength),trans(height));
			}
			ctx.stroke();
			for(let i=0;i<col+1;i++){//画17条平行横线
				ctx.moveTo(trans(0),trans(i*sidelength));
				ctx.lineTo(trans(width),trans(i*sidelength));
			}
			ctx.stroke();
			ctx.closePath();
			
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.arc(trans(width/2),trans(height/2),5,0,Math.PI*2);//标出中心点
			ctx.fill();
			ctx.closePath();
		}
		
		
	}

	draw();

	let nx=-1,ny=-1;
	let start = false;

	//鼠标移动时调用shadow函数，提示当前棋的落点位置
	$(canvas).mousemove(function(e){
		let {x,y} = getPosition(e);
		
		x-=pad;y-=pad;
		//console.log({x:x,y:y});

		newnx = Math.round(x/(sidelength));
		newny = Math.round(y/(sidelength));
		//console.log([nx,ny]);


		if(newnx!=nx || newny!=ny){
			//先清除上一个点

			let coverFlag = false;
			let shadowFlag = false;


			for(let chess of chesses){
				if(nx==chess.nx && ny==chess.ny){//在已经下了的棋里面找到了马上要被cover的棋子，阻止cover
					coverFlag = true;
				}
				if(newnx==chess.nx && newny==chess.ny){//在已经下了的棋里面找到了马上要被shadow的棋子，阻止shadow
					shadowFlag = true;
				}

				if(coverFlag && shadowFlag){
					break;
				}
			}

			if(!coverFlag){
				cover(nx,ny);
			}
		
			//再绘制当前点
			nx = newnx;
			ny = newny;

			if(!shadowFlag){
				shadow(nowPlayer,nx,ny);
			}
			
		}
	});

	function getPosition(e){//获取鼠标在canvas上的坐标
		let x = e.pageX - canvas.offsetLeft;
		let y = e.pageY - canvas.offsetTop;

		return {x:x,y:y};
	}

	function Chess(player,nx,ny){
		this.player = player;
		this.nx = nx;
		this.ny = ny;
	}

	$(canvas).click(function(e){
		if(place(nowPlayer,nx,ny)){
			nowPlayer==0?(nowPlayer=1):(nowPlayer=0);
		}
		
	});

	function shadow(player,nx,ny){//根据鼠标位置提示下棋位置的幻影
		ctx.beginPath();
		ctx.fillStyle = black;
		ctx.arc(trans(nx*sidelength),trans(ny*sidelength),r,0,Math.PI*2);
		ctx.fillStyle = player==0?black:white;
		ctx.fill();
		ctx.closePath();
	}

	function place(player,nx,ny){//放置一颗棋子 0:黑棋 1:白棋
		for(let chess of chesses){
			if(nx==chess.nx && ny==chess.ny){//这个位置已经下了棋
				alert(`该位置已有${chess.player==0?1:2}号玩家的棋子！`);
				return false;
			}
		}

		shadow(player,nx,ny);
		chesses.push(new Chess(player,nx,ny));
		console.log(chesses);
		console.log(player);
		return true;
		
	}

	function cover(nx,ny){//删除幻影 || 悔棋
		let x = nx*sidelength;
		let y = ny*sidelength;

		ctx.clearRect(trans(x-r),trans(y-r),r*2,r*2);//清空上一个点的外接正方形
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(trans(x-r),trans(y-r),r*2,r*2);//将上面注释写的外接正方形重新画成背景色

		for(let i=0;i<3;i++){//加深线的颜色
			ctx.beginPath();
			ctx.moveTo(trans(x-r)<trans(0)?trans(0):trans(x-r),trans(y));
			ctx.lineTo(trans(x+r)>trans(width)?trans(width):trans(x+r),trans(y));
			ctx.stroke();
			ctx.closePath();
			ctx.beginPath();
			ctx.moveTo(trans(x),trans(y-r)<trans(0)?trans(0):trans(y-r));
			ctx.lineTo(trans(x),trans(y+r)>trans(height)?trans(height):trans(y+r));
			ctx.stroke();
			ctx.closePath();
		}

		if(nx==col/2 && ny==row/2){//如果当前要重绘的点是中心点，标出中心点
			ctx.beginPath();
			ctx.fillStyle = 'black';
			ctx.arc(trans(width/2),trans(height/2),5,0,Math.PI*2);//标出中心点
			ctx.fill();
			ctx.closePath();
		}
	}

	function detection(){//检测当前是否有玩家胜利
		for(let blackChess of blackChesses){//遍历黑棋数组
			
		}
	}

});