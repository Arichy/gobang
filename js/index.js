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
const chessBoard = [];//储存棋盘状态

let canvas;
let ctx;

let nowPlayer = 0;//默认黑棋先手
let winner = -1;

let nx=-1,ny=-1;
let solidx = -1,solidy = -1;
let start = false;

function trans(x){
	return x+pad;
}

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

function shadow(player,nx,ny){//根据鼠标位置提示下棋位置的幻影
	ctx.beginPath();
	ctx.fillStyle = black;
	ctx.arc(trans(nx*sidelength),trans(ny*sidelength),r,0,Math.PI*2);
	ctx.fillStyle = player==0?black:white;
	ctx.fill();
	ctx.closePath();
}	

function place(player,nx,ny){//放置一颗棋子 0:黑棋 1:白棋
	if(chessBoard[nx][ny]!=-1){
		alert(`该位置已有${chessBoard[nx][ny]==0?1:2}号玩家的棋子！`);
		return false;
	}

	shadow(player,nx,ny);//view

	let chess = new Chess(player,nx,ny);
	chesses.push(chess);

	chessBoard[nx][ny] = player;
	solidx = nx;
	solidy = ny;

	if(player==0){
		blackChesses.push(chess);
	} else{
		whiteChesses.push(chess);
	}

	return true;
}

function showWinLine(winLine){//画出赢的那条5子连珠
	winLine.sort((a,b)=>a[0]-b[0]);
	console.log(winLine);
	ctx.beginPath();
	ctx.moveTo(trans(winLine[0][0]*sidelength),trans(winLine[0][1]*sidelength));
	ctx.lineTo(trans(winLine[winLine.length-1][0]*sidelength),trans(winLine[winLine.length-1][1]*sidelength));
	ctx.strokeStyle = 'lime';
	ctx.stroke();
	ctx.closePath();
}

function detection(chessBoard,nx,ny,nowPlayer){//x,y为这一次下的棋
	let flag1,flag2,flag3,flag4;

	for(let i=0;i<5;i++){
		let winLine = [];

		flag1 = true;//竖直方向
		for(let j=ny-4+i;j<ny+i+1;j++){
			winLine.push([nx,j]);
			if(chessBoard[nx][j]!=nowPlayer){
				winLine.length = 0;
				flag1 = false;
				break;
			}
		}
		if(flag1){
			showWinLine(winLine);
			return true;
		}

		flag2 = true;//水平方向
		for(let j=nx-4+i;j<nx+i+1;j++){
			winLine.push([j,ny]);
			if(chessBoard[j][ny]!=nowPlayer){
				winLine.length = 0;
				flag2 = false;
				break;
			}
		}
		if(flag2){
			showWinLine(winLine);
			return true;
		}

		flag3 = true;// \方向
		for(let j=0;j<5;j++){
			winLine.push([nx-j+i,ny-j+i]);
			if(chessBoard[nx-j+i][ny-j+i]!=nowPlayer){
				winLine.length = 0;
				flag3 = false;
				break;
			}
		}
		if(flag3){
			showWinLine(winLine);
			return true;
		}

		flag4 = true;// /方向
		for(let j=0;j<5;j++){				
			winLine.push([nx-j+i,ny+j-i]);
			if(chessBoard[nx-j+i][ny+j-i]!=nowPlayer){
				winLine.length = 0;
				flag4 = false;
				break;
			}
		}
		if(flag4){
			showWinLine(winLine);
			return true;
		}
	}
}

let mousemoveHandler,clickHandler;

$(function(){
	for(let i=-4;i<col+1+4;i++){//四周多出来4格，防止detection报错
		chessBoard[i] = [];
		for(let j=-4;j<row+1+4;j++){
			chessBoard[i][j] = -1;//每一个格子初始化为-1
		}
	}
	
	//获得canvas DOM
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	ctx.strokeStyle = 'black';
	$(canvas).attr({'width':`${width+pad*2}px`,'height':`${height+pad*2}px`});

	draw();

	//鼠标移动时调用shadow函数，提示当前棋的落点位置
	$(canvas).on('mousemove',mousemoveHandler = function (e){
		let {x,y} = getPosition(e);
		
		x-=pad;y-=pad;

		newnx = Math.round(x/(sidelength));
		newny = Math.round(y/(sidelength));
		//console.log([nx,ny]);

		if(newnx!=nx || newny!=ny){
			//先清除上一个点
			if(chessBoard[nx][ny]==-1){//当要cover的格子上没有棋子才cover
				cover(nx,ny);
			}
		
			//再绘制当前点
			nx = newnx;
			ny = newny;
			if(chessBoard[nx][ny]==-1){
				shadow(nowPlayer,nx,ny);
			}
		}
	});

	$(canvas).on('click',clickHandler = function (e){//点击事件的handler
		if(place(nowPlayer,nx,ny)){
			if(detection(chessBoard,nx,ny,nowPlayer)){//分出胜负
				$(this).trigger("win");
				let winner = nowPlayer==0?'黑棋':'白棋';
				alert(`${winner}胜利！`);
				$('#player').text(`${winner}胜利`);
				$('#regret').attr('disabled',true);
			} else{//未分出胜负，成功下棋
				$('#regret').attr('disabled',false);
				nowPlayer = Number(!nowPlayer);

				if(nowPlayer==0){
					$('#player').text('黑棋');
					$('#regret').removeClass('button-inverse');
				} else{
					$('#player').text('白棋');
					$('#regret').addClass('button-inverse');
				}
				

			}
		}
		console.log(nowPlayer);
	});

	$(canvas).on('win',function winHandler(e){
		$(canvas).off('mousemove',mousemoveHandler);
		$(canvas).off('click',clickHandler);
	});

	$('#regret').on('click',function(e){
		cover(solidx,solidy);//view
		
		chesses.pop();
		if(nowPlayer==0){
			whiteChesses.pop();
		} else{
			blackChesses.pop();
		}

		chessBoard[solidx][solidy] = -1;//真正有用的一行

		nowPlayer = Number(!nowPlayer);
		$('#player').text(nowPlayer==0?'黑棋':'白棋');

		$(this).attr('disabled',true);
	});

});