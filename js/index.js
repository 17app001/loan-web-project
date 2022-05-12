const amountEl = document.querySelector("#amount");
const priodEl = document.querySelector("#proid");
const priodSelectEl = document.querySelector("#proid-select");
const feeEl = document.querySelector("#fee");
const rateEl = document.querySelector("#rate");
const event1El = document.querySelector("#event-1");
const event2El = document.querySelector("#event-2");

priodEl.value = Number(priodSelectEl.options[priodSelectEl.selectedIndex].text);
priodSelectEl.addEventListener("change", () => {
    priodEl.value = Number(priodSelectEl.options[priodSelectEl.selectedIndex].text);
});


// 本息平均攤還
function event1(amount, rate, priod) {
    let tempTotalAmount = amount;
    let resultArray = [];
    let monthRate = rate / 12;

    // {[(1＋月利率)^月數]×月利率}÷{[(1＋月利率)^月數]－1}
    let payRate = (Math.pow((1 + monthRate), priod) * monthRate) /
        ((Math.pow((1 + monthRate), priod) - 1));
    // 平均攤還率
    // System.out.println(payRate);
    // 貸款本金×每月應付本息金額之平均攤還率(固定)
    let monthPay = Math.round(tempTotalAmount * payRate);

    // https://www.ks888.com.tw/www/bank1.htm
    for (let i = 0; i < priod; i++) {
        // 每月應付利息金額
        let interest = Math.round(tempTotalAmount * monthRate);
        let pay = monthPay - interest;
        // 每月應還本金金額
        tempTotalAmount -= pay;
        resultArray[i] = [];
        resultArray[i][0] = pay;
        resultArray[i][1] = interest;
        resultArray[i][2] = tempTotalAmount;
    }

    return resultArray;
}


// 本金平均攤還
function event2(amount, rate, priod) {
    let tempTotalAmount = amount;
    let resultArray = new Array();

    // 本金固定
    let pay = Math.round(amount / priod);
    for (let i = 0; i < priod; i++) {
        // 每月利息
        let interest = Math.round(tempTotalAmount * (rate / 12));
        tempTotalAmount -= pay;

        // resultArray.push([pay, interest, tempTotalAmount]);
        resultArray[i] = new Array();
        resultArray[i][0] = pay;
        resultArray[i][1] = interest;
        resultArray[i][2] = tempTotalAmount;
    }

    return resultArray;
}


function calc() {
    try {
        let amount = Number(amountEl.value) * 10000;
        let priod = priodEl.value == ''
            ? Number(priodSelectEl.options[priodSelectEl.selectedIndex].text)
            : Number(priodEl.value);

        let fee = feeEl.value == '' ? 0 : Number(feeEl.value);
        let rate = rateEl.value == '' ? 0 : Number(rateEl.value);

        if (amount == 0) {
            alert("請輸入貸款金額");
            return;
        }

        if (rate <= 0) {
            alert("請輸入正確利率");
            return;
        }

        let event = event1El.checked ? 0 : 1;

        console.log(amount, priod, fee, rate, event);

        let resultArray = event == 0 ?
            event1(amount, rate / 100, priod * 12) :
            event2(amount, rate / 100, priod * 12)

        const resultEL = document.querySelector("#result tbody");
        resultEL.innerHTML = "";
        let count = 0;
        let message = "";
        let totalInterest = 0;
        resultArray.forEach(result => {
            totalInterest += result[1];
            message += `<tr><td>第${count + 1}個月</td><td>${result[0]}</td><td>${result[1]}</td> <td>${result[2]}</td></tr>`;
            count++;
        });

        const subtitleEl = document.querySelector("#subtitle");
        if (event == 0) {
            subtitleEl.innerText = `總支出:${amount + totalInterest + fee} 總計利息:${totalInterest} 
            (每個月固定金額:${resultArray[0][0] + resultArray[0][1]})`;

        } else {
            subtitleEl.innerText = `總支出:${amount + totalInterest + fee} 總計利息:${totalInterest} 
            (每個月金額不固定)`;
        }

        resultEL.innerHTML = message;
        window.scrollTo(0, 300);

        // window.scrollTo(0, document.body.scrollHeight);

    } catch (e) {
        alert(e);
    }
}