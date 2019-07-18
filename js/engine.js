/*




			



							++==	+==	   ==+	===+  ++===+    |
						    ||__	|  \  /	 |	 __|  ||   |  __+__		 
							||		|	\/	 |	|  |  ||   |	|
							++==	|		 |	+==+  ||   |	|___

									PRODUCTION @2019/7/18
										Analog-clock









*/
var canvas = document.querySelector('canvas');
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;
 var c = canvas.getContext('2d');
 
function Clock(x, y, r, bgc, brandc,cenc,segc){
	this.x = x;
	this.y = y;
	this.radius = r<20?30:r;
	this.ceneterRadius = this.radius/25;
	this.radsec = 0;
	this.radmin = 0;
	this.radhr = 0;
	this.font = this.radius*0.1;
	this.mainSegmentLen = this.radius*0.2;
	this.subSegmentLen = this.radius*0.12;
	this.miniSegmentLen = this.radius*0.075;
	this.numberLen = this.radius*0.25;
	this.time = 0
	this.sec = 0;
	this.min = 0;
	this.hr = 0;
	this.clkbg = bgc;
	this.clkbrand = brandc;
	this.clkcen = cenc;
	this.clkseg = segc;
	this.isAdvanced = r > 90?true:false;
	this.isNormal = r>50?true:false;

	
	this.update = ()=>{
		this.time = new Date();
		this.sec = this.time.getSeconds();
		this.min = this.time.getMinutes();
		this.hr = (this.time.getHours()>12)?(this.time.getHours()-12):this.time.getHours()+1;
		this.radsec = this.sec*Math.PI/30-Math.PI/2;
		this.radmin = this.min*Math.PI/30-Math.PI/2;
		this.radhr = this.hr*Math.PI/6-Math.PI/2;
		this.draw();
		

	};
	this.draw = ()=>{
			
		c.beginPath();
		c.lineWidth = 15;
		c.fillStyle = this.clkbg;
		c.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
		c.fill();
		c.strokeStyle = this.clkbrand;
		c.stroke();
		c.closePath();
		
		c.beginPath();
		c.font = "bold "+this.font+"pt Impact";
		c.fillStyle=this.clkbrand;
		c.fillText('EMANT', this.x-5*this.font/3, this.y+this.radius*0.3);
		c.closePath();

		c.lineWidth = 2;
		c.strokeStyle = 'whitesmoke';
		c.beginPath();
		c.moveTo(this.x-Math.cos(this.radsec)*this.radius*0.15, this.y-Math.sin(this.radsec)*this.radius*0.15);
		c.lineTo(Math.cos(this.radsec)*(this.radius*0.8)+this.x, Math.sin(this.radsec)*(this.radius*0.8)+this.y);
		c.lineWidth = this.radius*0.008;
		c.stroke();
		c.closePath();
		
		c.beginPath();
		c.moveTo(this.x-Math.cos(this.radmin)*this.radius*0.15, this.y-Math.sin(this.radmin)*this.radius*0.15);
		c.lineTo(Math.cos(this.radmin)*(this.radius*0.6)+this.x, Math.sin(this.radmin)*(this.radius*0.6)+this.y);
		c.lineWidth = this.radius*0.015;
		c.stroke();
		c.closePath();

		c.beginPath();
		c.moveTo(this.x-Math.cos(this.radhr)*this.radius*0.15, this.y-Math.sin(this.radhr)*this.radius*0.15);
		c.lineTo(Math.cos(this.radhr)*(this.radius*0.4)+this.x, Math.sin(this.radhr)*(this.radius*0.4)+this.y);
		c.lineWidth = this.radius*0.03;
		c.stroke();
		c.closePath();

		this.segmenter();
		if(this.isAdvanced){
			this.number();
		}
		
		c.beginPath();
		c.arc(this.x, this.y, this.ceneterRadius, 0, Math.PI*2, false);
		c.fillStyle = this.clkcen;
		c.fill();
		c.closePath();
	}
	this.segmenter = ()=>{
		var x = {max_limit: 0, seg_len: 0};
		var y = {max_limit: 0, seg_len: 0};
		
		
		for(var rad = 0; rad < Math.PI*2-Math.PI/30; rad += Math.PI/30){
			x.max_limit = this.x+Math.cos(rad)*this.radius;
			y.max_limit = this.y+Math.sin(rad)*this.radius;
			c.beginPath();
			c.moveTo(x.max_limit, y.max_limit);
			if(this.isBound(rad, 0, Math.PI/2)){
				x.seg_len = Math.cos(rad)*this.mainSegmentLen;
				y.seg_len = Math.sin(rad)*this.mainSegmentLen;
				c.lineTo(x.max_limit-x.seg_len, y.max_limit-y.seg_len);
				c.strokeStyle = this.clkcen;
				c.lineWidth = 3;
			}else if(this.isBound(rad, Math.PI/6, Math.PI/6) && this.isNormal){
				x.seg_len = Math.cos(rad)*this.subSegmentLen;
				y.seg_len = Math.sin(rad)*this.subSegmentLen;
				c.lineTo(x.max_limit-x.seg_len, y.max_limit-y.seg_len);
				c.strokeStyle = this.clkcen;
				c.lineWidth = 3;
			}else{
				if(this.isAdvanced){
					x.max_limit = this.x+Math.cos(rad)*this.radius;
					x.seg_len = Math.cos(rad)*this.miniSegmentLen;
					y.max_limit = this.y+Math.sin(rad)*this.radius;
					y.seg_len = Math.sin(rad)*this.miniSegmentLen;
					c.lineTo(x.max_limit-x.seg_len, y.max_limit-y.seg_len);
					c.strokeStyle =this.clkseg;
					c.lineWidth = 2;
				}
			}
			c.stroke();
			c.closePath();
		}
		this.number = ()=>{
			var x = {max_limit: 0, seg_len: 0};
			var y = {max_limit: 0, seg_len: 0};
			var n = 12;
			for(var rad = -Math.PI/2; rad < Math.PI*2-Math.PI/2; rad += Math.PI/6){

				x.max_limit = this.x+Math.cos(rad)*this.radius;
				y.max_limit = this.y+Math.sin(rad)*this.radius;
				x.seg_len = Math.cos(rad)*this.numberLen;
				y.seg_len = Math.sin(rad)*this.numberLen;

				c.beginPath();
				c.font = "bold "+this.font+"pt Consolas";
				c.fillStyle='#9370BD';
				c.fillText(n, x.max_limit-x.seg_len-this.font*0.5, y.max_limit-y.seg_len+this.font*0.3);
				c.closePath();
				if(rad == -Math.PI/2)
					n = 0;
				n++;
			}
			
			


		}
	}
	this.isBound = (rad1, str, incr)=>{
		for(var rad2 = str; rad2 < Math.PI*2; rad2 += incr){
			if(Math.abs(rad1-rad2) <= 0.000001){
				return true;
			}
		}
		return false;
	};
}
 

var clk;
function init(){
	clk = [];
	clk.push(new Clock(innerWidth/2, innerHeight/2, 200, 'rgb(75, 0, 130)', 'rgb(90, 20, 150)', 'rgb(0, 255, 255)', 'rgb(147, 112, 219)'));
	clk.push(new Clock(innerWidth*0.297, innerHeight*0.297, 96, 'rgb(70, 180, 130)', 'rgb(85, 200, 150)', 'rgb(30, 140, 90)', 'rgb(50, 160, 110)'));
	clk.push(new Clock(innerWidth*0.699, innerHeight*0.699, 90, 'rgb(30, 144, 255)', 'rgb(45, 164, 255)', 'rgb(10, 124, 235)', 'rgb(175, 238, 238)'));
	clk.push(new Clock(innerWidth*0.647, innerHeight*0.25, 50, 'rgb(199, 21, 133)', 'rgb(214, 41, 155)', 'rgb(255, 105, 180)', 'rgb(175, 238, 238)'));
	clk.push(new Clock(innerWidth*0.353, innerHeight*0.75, 50, 'rgb(210, 105, 30)', 'rgb(225, 125, 50)', 'rgb(139, 69, 19)', 'rgb(175, 238, 238)'));
	
}
 
 function animate(){
 // 	requestAnimationFrame(animate)3
 	c.fillStyle='rgba(0,0,0,0.009)';
	c.clearRect(0,0,innerWidth, innerHeight);
	clk.forEach(e=>{
		e.update();
	});
	setTimeout(animate, 1000);
 }
 
 init();
 animate();