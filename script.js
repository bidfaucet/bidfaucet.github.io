// ===== Neon Title Blink =====
const colors = ["#00ff00","#ffffff"];
const titleSpans = document.querySelectorAll("#title span");
function blinkTitle() {
    titleSpans.forEach(span=>{
        const color = colors[Math.floor(Math.random()*colors.length)];
        span.style.color=color;
        span.style.textShadow=`0 0 5px ${color},0 0 10px ${color},0 0 20px ${color}`;
    });
}
setInterval(blinkTitle,1000);
blinkTitle();

// ===== Subtitle Animation =====
const subtitles=["The Best Faucet Site","Free Crypto Every Day","Instant Balance Withdrawals","No Minimum Withdrawal"];
const subtitleContainer=document.getElementById('subtitle');
let subtitleIndex=0;
function showSubtitle(){
    subtitleContainer.innerHTML="";
    const words=subtitles[subtitleIndex].split(" ");
    words.forEach((word,i)=>{
        const span=document.createElement("span");
        span.classList.add("subtitle-word");
        span.textContent=word;
        const color = colors[Math.floor(Math.random()*colors.length)];
        span.style.color=color;
        span.style.textShadow=`0 0 3px ${color},0 0 6px ${color}`;
        span.style.animation=`slideIn 0.5s forwards`;
        span.style.animationDelay=`${i*0.4}s`;
        subtitleContainer.appendChild(span);
    });
    const totalTime = words.length*0.4 + 0.5 + 2 + words.length*0.4 + 0.5;
    setTimeout(()=>{
        subtitleIndex=(subtitleIndex+1)%subtitles.length;
        showSubtitle();
    }, totalTime*1000);
}
showSubtitle();

// ===== Menu Button Active =====
document.querySelectorAll('.menu-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
        document.querySelectorAll('.menu-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// ===== Workflow Faucet =====
const emailContainer=document.getElementById('emailContainer');
const timerContainer=document.getElementById('timerContainer');
const countdownEl=document.getElementById('countdown');
const claimButton=document.getElementById('claimButton');
const captchaPopup=document.getElementById('captchaPopup');
const captchaQuestion=document.getElementById('captchaQuestion');
const captchaInput=document.getElementById('captchaInput');
const captchaSubmit=document.getElementById('captchaSubmit');
const messageEl=document.getElementById('message');

let currentAnswer;

// ===== Generate Random Captcha =====
function generateCaptcha() {
    const operators = ['+', '-', '×', '÷'];
    const a = Math.floor(Math.random()*10)+1;
    const b = Math.floor(Math.random()*10)+1;
    const op = operators[Math.floor(Math.random()*operators.length)];
    let question=`${a} ${op} ${b} = ?`;
    let answer;
    switch(op){
        case '+': answer=a+b; break;
        case '-': answer=a-b; break;
        case '×': answer=a*b; break;
        case '÷': 
            answer=(a/b).toFixed(2);
            question=`${a} ÷ ${b} = ? (2 decimals)`; break;
    }
    return {question, answer};
}

// ===== Email Submit =====
document.getElementById('emailSubmit').addEventListener('click', ()=>{
    const email=document.getElementById('emailInput').value;
    if(!email) return alert('Enter FaucetPay email!');
    emailContainer.style.display='none';
    timerContainer.style.display='flex';
    let countdown=10; // 10 detik
    countdownEl.textContent=countdown;
    const timer=setInterval(()=>{
        countdown--;
        countdownEl.textContent=countdown;
        if(countdown<=0){
            clearInterval(timer);
            timerContainer.style.display='none';
            claimButton.style.display='block';
        }
    },1000);
});

// ===== Claim Button =====
claimButton.addEventListener('click', ()=>{
    const captcha=generateCaptcha();
    captchaQuestion.textContent=captcha.question;
    currentAnswer=captcha.answer;
    captchaInput.value='';
    captchaPopup.style.display='flex';
});

// ===== Captcha Submit =====
captchaSubmit.addEventListener('click', async ()=>{
    const userAnswer=captchaInput.value.trim();
    if(userAnswer==currentAnswer){
        captchaPopup.style.display='none';
        claimButton.style.display='none';
        messageEl.textContent='⏳ Processing withdrawal...';

        try {
            const email = document.getElementById('emailInput').value;

            const res = await fetch("/api/wd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    to_address: email,    // pakai email FaucetPay user
                    amount: 0.00000001,       // contoh jumlah
                    currency: "BTC"       // contoh koin
                })
            });

            const data = await res.json();

            if(data.status === 200){
                messageEl.textContent = "✅ Withdraw sent to FaucetPay!";
            } else {
                messageEl.textContent = "❌ Failed: " + data.message;
            }
        } catch (err) {
            messageEl.textContent = "⚠️ Error: " + err.message;
        }

    } else {
        alert('❌ Wrong answer! A new captcha has been generated.');
        const newCaptcha = generateCaptcha();
        captchaQuestion.textContent = newCaptcha.question;
        currentAnswer = newCaptcha.answer;
        captchaInput.value = '';
    }
});
