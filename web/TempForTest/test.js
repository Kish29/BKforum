class BasicShape {
    constructor(radius) {
        this.x = 0;
        this.y = 0;
        this.radius = radius;
        this.color = '';
        this.deg = 0;
    }

    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.lineWidth = this.lineWidth;
        context.fillStyle = this.color;
        context.beginPath();
        //x, y, radius, start_angle, end_angle, anti-clockwise
        context.arc(0, 0, this.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
        context.restore();
    }
}

function moveSakura(snow, index) {
    snow.y += 1.5; // 下降位移量
    snow.x += -1.3 * Math.random(); // 左飘位移量
    //snow.deg += Math.PI / 250;
    if (snow.y > canvas.height || snow.x < 0) { // 飘出画布的樱花花消去
        snow = null;
        sakuraList.splice(index, 1);
    } else
        snow.draw(context);
}

// 根据时间创造新的樱花
function createSakura() {
    let now = new Date();
    if (now - lastSnowCreatedTime > sakuraList.length - now.getMinutes() && sakuraList.length < 1200) {
        const radius = Math.random() * 2 + 2;
        let sakura = new BasicShape(radius);
        // 每一分钟的前5秒在屏幕大范围内生成樱花
        let timeGap = now.getSeconds() - firstSnowCreatedTime.getSeconds();
        if (timeGap > 0 && timeGap < 5)
            sakura.y = Math.random() * canvas.height + 1;
        else // 5秒之后随机在顶部或者屏幕中生成樱花
            sakura.y = Math.random() > 0.5 ? 0 : Math.random() * canvas.height + 1;
        sakura.x = Math.random() * canvas.width + 1;
        let alpha = Math.random() + 0.3;
        sakura.color = 'rgba(255,192,203,' + alpha + ')';
        sakuraList.push(sakura);
        lastSnowCreatedTime = now;
    }
}

function drawFrame() {
    canvas.width = window.innerWidth;
    //canvas.height = canvas.width / backImage.width * backImage.height;
    canvas.height = window.innerHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(backImage, 0, 0, canvas.width, canvas.height);
    // 符合条件添加新的樱花
    createSakura();
    // 每一片樱花要重新计算位置
    sakuraList.forEach(moveSakura);
    requestAnimationFrame(drawFrame);
}


let lastSnowCreatedTime = new Date();
let firstSnowCreatedTime = lastSnowCreatedTime;
let sakuraList = [];
let canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d');
let backImage = new Image();
backImage.src = "/BKforum/web/Images/Background/yaesakura.jpg"; 

drawFrame();