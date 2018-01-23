let ai = {};

ai.getRandom = function(){//AI生成一对整数
	let randx = Math.floor(Math.random()*(col+1));
	let randy = Math.floor(Math.random()*(row+1));

	return [randx,randy];
};

ai.autoplay = function(){//随机生成一对整数，范围为[0,col]和[0,row]   [0,1)*col
	let [randx,randy] = this.getRandom();

	if(chessBoard[randx][randy]==-1){
		if(place(nowPlayer,randx,randy)){
			if(detection(chessBoard,randx,randy,nowPlayer)){
				$(canvas).trigger("win");
				let winner = nowPlayer==0?'黑棋':'白棋';
				alert(`${winner}胜利！`);
				$('#player').text(`${winner}胜利`);
			}else{//未分出胜负，成功下棋
				nowPlayer = Number(!nowPlayer);

			}
		}
	}else{
		ai.autoplay();	
	}
};

$(function(){
	$('#regret').attr('disabled',true);
	$(canvas).off('click',clickHandler);
	$(canvas).on('click',function(e){
		if(place(nowPlayer,nx,ny)){
			if(detection(chessBoard,nx,ny,nowPlayer)){//分出胜负
				$(this).trigger("win");
				let winner = nowPlayer==0?'黑棋':'白棋';
				alert(`${winner}胜利！`);
				$('#player').text(`${winner}胜利`);
			} else{//未分出胜负，成功下棋
				nowPlayer = Number(!nowPlayer);

				ai.autoplay();
			}
		}
	});
});
