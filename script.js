document.addEventListener('DOMContentLoaded', () => {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwd05bMnK8XSjq70qskdkPSrQEYYcwBVXEkMpjNLGoMhLIwSThXvDMVZfPMfstC-A8x2Q/exec'; // <--- ใส่ URL ที่ได้จาก Apps Script ตรงนี้
    const SHEET_ID_FOR_VIEW = '1k9Gp-ADytqusKpyg_x2YvgZlhIzTlJUhTGaoUzqInIo'; // ID ของ Sheet สำหรับปุ่มดูคะแนน

    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const endScreen = document.getElementById('end-screen');

    const playerNameInput = document.getElementById('playerName');
    const levelSelect = document.getElementById('levelSelect');
    const startButton = document.getElementById('startButton');

    const levelDisplay = document.getElementById('level-display');
    const timerDisplay = document.getElementById('timer');
    const scoreDisplay = document.getElementById('score-display');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const feedback = document.getElementById('feedback');
    const nextButton = document.getElementById('nextButton');

    const finalPlayerName = document.getElementById('finalPlayerName');
    const finalLevel = document.getElementById('finalLevel');
    const finalTime = document.getElementById('finalTime');
    const finalScoreDisplay = document.getElementById('finalScore');
    const savingStatus = document.getElementById('saving-status');
    const playAgainButton = document.getElementById('playAgainButton');
    const viewScoresButton = document.getElementById('viewScoresButton');

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let timerInterval;
    let secondsElapsed = 0;
    let playerName = '';
    let selectedLevel = '';

    const questions = {
        ประถม: [
            { q: "1. ฮัจญ์คืออะไร?", o: ["การถือศีลอด", "การเดินทางไปทำพิธีที่มักกะฮ์", "การละหมาด", "การอ่านอัลกุรอาน"], a: "ข", exp: "ฮัจญ์คือการเดินทางไปทำพิธีศาสนา ณ มักกะฮ์" },
            { q: "2. ฮัจญ์จัดขึ้นเดือนใด?", o: ["มุฮัรรอม", "รอมฎอน", "ซุลฮิจญะห์", "ชะอฺบาน"], a: "ค", exp: "พิธีฮัจญ์จัดในเดือนซุลฮิจญะห์" },
            { q: "3. มัสยิดที่เป็นจุดศูนย์กลางของฮัจญ์คือ?", o: ["มัสยิดกูบา", "มัสยิดอัล-อักศอ", "มัสยิดฮารอม", "มัสยิดนาบาวี"], a: "ค", exp: "มัสยิดฮารอมเป็นที่ตั้งของกะบะฮ์" },
            { q: "4. สิ่งปลูกสร้างรูปทรงลูกบาศก์ในพิธีฮัจญ์เรียกว่า?", o: ["กะบะฮ์", "ตอวาฟ", "มะรฺวะฮ์", "อะรอฟะฮ์"], a: "ก", exp: "กะบะฮ์เป็นศูนย์กลางที่มุสลิมทั่วโลกหันละหมาด" },
            { q: "5. ผู้ที่ทำฮัจญ์จะต้องตอวาฟรอบกะบะฮ์กี่รอบ?", o: ["5 รอบ", "6 รอบ", "7 รอบ", "8 รอบ"], a: "ค", exp: "ตอวาฟจะทำรอบกะบะฮ์ 7 รอบทวนเข็มนาฬิกา" },
            { q: "6. การเดินไปกลับระหว่างซอฟาและมัรฺวะฮ์ เรียกว่า?", o: ["ตอวาฟ", "วุกูฟ", "ซะแอ", "ตะชะฮฺฮุด"], a: "ค", exp: "ซะแอเป็นสัญลักษณ์แห่งความพยายามของหญิงฮาญัร" },
            { q: "7. ผู้ไปฮัจญ์ต้องมีอายุขั้นต่ำเท่าไร?", o: ["7 ปี", "10 ปี", "15 ปี", "ไม่มีจำกัด"], a: "ง", exp: "ฮัจญ์ ไม่มีการกำหนดอายุขั้นต่ำสำหรับการประกอบพิธีฮัจญ์ แต่การเป็นฟัรฎู (ข้อบังคับ) จะเริ่มเมื่อบรรลุศาสนภาวะและมีความสามารถ" },
            { q: "8. พิธีฮัจญ์จัดที่เมืองอะไร?", o: ["มะดีนะฮ์", "มักกะฮ์", "เยรูซาเล็ม", "ไคโร"], a: "ข", exp: "มักกะฮ์คือเมืองศักดิ์สิทธิ์สำหรับฮัจญ์" },
            { q: "9. เครื่องแต่งกายที่ผู้ชายต้องใส่ในพิธีฮัจญ์เรียกว่า?", o: ["อิห์รอม", "ซะระวาล", "ฆิมาร", "ญิบาบ"], a: "ก", exp: "อิห์รอมคือผ้าสีขาวสองผืน ไม่มีตะเข็บ" },
            { q: "10. เมื่อทำฮัจญ์เสร็จ ผู้แสวงบุญเรียกว่า?", o: ["คอลีฟะฮ", "ฮาญิย์", "อิหม่าม", "โต๊ะใบ"], a: "ข", exp: "ฮาญิย์ (ชาย) หรือ ฮาญะฮ์ (หญิง) คือผู้แสวงบุญที่ทำฮัจญ์แล้ว" }
        ],
        มัธยมต้น: [
            { q: "1. ฮัจญ์เป็นหนึ่งในหลักศรัทธาหรือหลักศาสนา?", o: ["หลักศรัทธา", "หลักศาสนา", "ซุนนะฮ์", "ไม่เกี่ยวกัน"], a: "ข", exp: "ฮัจญ์เป็นหลักศาสนา (อิสลาม) ข้อที่ 5" },
            { q: "2. จุดที่ผู้แสวงบุญต้องตั้งเจตนาอิห์รอมเรียกว่า?", o: ["อะรอฟะฮ์", "มีกอต", "มัรฺวะฮ์", "มีนา"], a: "ข", exp: "มีกอตคือจุดตั้งต้นของการตั้งเจตนาอิห์รอมก่อนเข้าสู่พิธีฮัจญ์" },
            { q: "3. ในวันอะรอฟะฮ์ ผู้แสวงบุญต้องทำอะไร?", o: ["ตอวาฟ", "ฆุบา", "วุกูฟ", "ขว้างเสาหิน"], a: "ค", exp: "วุกูฟคือการพำนัก การหยุดพักและขอดุอา ณ ทุ่งอะรอฟะฮ์ ซึ่งเป็นจุดสำคัญที่สุดของฮัจญ์" },
            { q: "4. การขว้างเสาหินทำในวันไหน?", o: ["วันที่ 9 ซุลฮิจญะห์", "วันที่ 10 ซุลฮิจญะห์", "วันที่ 11 ซุลฮิจญะห์", "วันที่ 12 ซุลฮิจญะห์"], a: "ข", exp: "วันที่ 10 ซุลฮิจญะห์ เป็นวันอีฎิลอัฎฮาและเป็นวันที่เริ่มขว้างเสาหินญัมเราะฮ์อะเกาะบะฮ์ และขว้างต่อเนื่องในวันตะชรีก" },
            { q: "5. เสาหินที่ผู้แสวงบุญขว้างเรียกว่าอะไร และหินที่ใช้ขว้างมีลักษณะอย่างไร?", o: ["ญัมรอฮ์, หินก้อนใหญ่", "ซะแอ, หินทราย", "ญัมรอฮ์, กรวดเล็กๆ", "มีกอต, หินจากภูเขา"], a: "ค", exp: "“ญัมรอฮ์” หมายถึงเสาหิน (ปัจจุบันเป็นกำแพงยาว) ส่วนหินที่ใช้ขว้างคือกรวดเล็กๆ" },
            { q: "6. หลังขว้างเสาหินญัมเราะฮ์อัลอะเกาะบะฮ์ในวันที่ 10 ซุลฮิจญะห์แล้ว โดยทั่วไปผู้ทำฮัจญ์แบบตะมัตตุอ์หรือกิรอน จะต้องทำสิ่งใดเป็นลำดับถัดมา?", o: ["ซะแอทันที", "วุกูฟที่มุซดะลิฟะฮ์", "เชือดสัตว์พลี (ฮัดย์)", "ตอวาฟวะดาอ์"], a: "ค", exp: "สำหรับผู้ทำฮัจญ์แบบตะมัตตุอ์และกิรอน หลังขว้างญัมเราะฮ์อัลอะเกาะบะฮ์แล้ว จะต้องเชือดสัตว์พลี (ฮัดย์) จากนั้นจึงโกนหรือตัดผม และตอวาฟอิฟาเฎาะฮ์" },
            { q: "7. การโกนผมหรือเล็มผมในพิธีฮัจญ์เรียกว่าอะไร และมีความสำคัญอย่างไร?", o: ["ฮะลักหรือตักศีร, เป็นการออกจากบางส่วนของสภาวะอิห์รอม", "วุกูฟ, เป็นการพักผ่อน", "ซะแอ, เป็นการเดินรำลึก", "ญัมรอฮ์, เป็นการขว้างหิน"], a: "ก", exp: "“ฮะลัก” คือการโกนผม และ “ตักศีร” คือการเล็มผม เป็นส่วนหนึ่งของการตะฮัลลุล (การออกจากสภาวะอิห์รอม)" },
            { q: "8. การพักแรมอยู่ที่ทุ่งมีนาเพื่อขว้างเสาหินทั้งสามต้นต่อเนื่องอีก 2 หรือ 3 วันหลังวันอีดิลอัฎฮา เรียกว่าวันอะไร?", o: ["วันตะชรีก", "วันอีดิลฟิตริ", "วันอะรอฟะฮ์", "วันอาชูรอ"], a: "ก", exp: "วันที่ 11, 12, และ 13 ซุลฮิจญะห์ เรียกว่า “วันตะชรีก” ซึ่งมีการพักแรมที่ทุ่งมีนาและขว้างเสาหินทั้งสามต้น" },
            { q: "9. การตั้งเจตนา (อิห์รอม) เพื่อทำฮัจญ์และอุมเราะฮ์พร้อมกันในคราวเดียว โดยไม่ออกจากสภาวะอิห์รอมระหว่างนั้น เรียกว่าฮัจญ์แบบใด?", o: ["อิฟรอด", "ตะมัตตุอ์", "กิรอน", "วะดาอ์"], a: "ค", exp: "“กิรอน” คือการตั้งเจตนาทำฮัจญ์และอุมเราะฮ์พร้อมกันด้วยอิห์รอมเดียว" },
            { q: "10. หากผู้ประกอบพิธีฮัจญ์ทำผิดพลาดในข้อบังคับ (วาญิบ) ของฮัจญ์บางประการ โดยทั่วไปแล้วจะต้องชดเชยด้วยวิธีใด?", o: ["หยุดการทำฮัจญ์ทันที", "จ่ายเงินค่าปรับจำนวนมาก", "ทำดัม (เชือดสัตว์เป็นการชดเชย)", "ถือศีลอด 10 วัน"], a: "ค", exp: "การทำผิดในข้อบังคับ (วาญิบ) ของฮัจญ์บางกรณี หรือละเลยสิ่งที่เป็นวาญิบ จะต้อง “ทำดัม” คือการชดเชยด้วยการเชือดสัตว์ (เช่น แพะหรือแกะ) ตามเงื่อนไขที่กำหนด" }
        ],
        มัธยมปลาย: [
            { q: "1. เจตนารมณ์สำคัญและเป้าหมายสูงสุดของการประกอบพิธีฮัจญ์ในทัศนะอิสลามคืออะไร?", o: ["การแสดงออกถึงความอดทนและความแข็งแกร่ง", "การชำระล้างจิตวิญญาณให้บริสุทธิ์และเสริมสร้างความตักวา (ความยำเกรงต่ออัลลอฮ์)", "การเสริมสร้างสถานะทางสังคมและเกียรติยศ", "การท่องเที่ยวในสถานที่ศักดิ์สิทธิ์และพบปะผู้คน"], a: "ข", exp: "เป้าหมายสูงสุดของฮัจญ์คือการขัดเกลาจิตใจให้บริสุทธิ์ กลับไปสู่สภาพแรกเริ่มเหมือนทารกแรกเกิด และเสริมสร้างความตักวา เพื่อเป็นบ่าวที่ดีของอัลลอฮ์" },
            { q: "2. การรวมตัวของผู้ศรัทธาจากทั่วทุกมุมโลก ณ สถานที่และเวลาเดียวกันในพิธีฮัจญ์ สะท้อนถึงหลักการสำคัญใดในอิสลามมากที่สุด?", o: ["เอกภาพ (เตาฮีด) และภราดรภาพของประชาชาติมุสลิม", "ความหลากหลายทางวัฒนธรรมและเชื้อชาติ", "การแข่งขันในการทำความดี", "การประกาศอิสรภาพจากอิทธิพลภายนอก"], a: "ก", exp: "ฮัจญ์เป็นสัญลักษณ์ที่ยิ่งใหญ่ของเอกภาพในความเป็นบ่าวของอัลลอฮ์องค์เดียว และความเป็นพี่น้องของมุสลิมทั่วโลก โดยไม่แบ่งแยกสีผิว ชนชั้น หรือสัญชาติ" },
            { q: "3. การสวมชุดอิห์รอมที่เป็นผ้าสองผืนเรียบง่ายสำหรับผู้ชาย มีนัยยะสำคัญอย่างไรในเชิงปรัชญาและจิตวิญญาณ?", o: ["เป็นการแสดงความร่ำรวยและสถานะทางเศรษฐกิจ", "เป็นการเน้นย้ำถึงความเสมอภาค ความสมถะ และการละทิ้งความผูกพันทางโลก", "เป็นการป้องกันสภาพอากาศร้อนจัดของทะเลทราย", "เป็นเครื่องแบบเพื่อความเป็นระเบียบเรียบร้อยเท่านั้น"], a: "ข", exp: "ชุดอิห์รอมเป็นสัญลักษณ์ของการละทิ้งสถานะทางโลก ความหรูหรา และความแตกต่างทางชนชั้น เพื่อมุ่งสู่ความเสมอภาคและความบริสุทธิ์ในการอิบาดะฮ์ต่ออัลลอฮ์" },
            { q: "4. กะอ์บะฮ์ (الكعبة) ซึ่งเป็นศูนย์กลางของการตอวาฟ มีความสำคัญเชิงสัญลักษณ์อย่างไรในประวัติศาสตร์และศรัทธาของอิสลาม?", o: ["เป็นเพียงอาคารโบราณที่ถูกสร้างขึ้นใหม่หลายครั้ง", "เป็นบ้านหลังแรกที่ถูกสร้างขึ้นเพื่อการเคารพภักดีต่ออัลลอฮ์องค์เดียว และเป็นกิบลัต (ทิศ) สำหรับมุสลิมทั่วโลก", "เป็นสัญลักษณ์ของอำนาจทางการเมืองของชาวอาหรับ", "เป็นสุสานของนบีอิบรอฮีมและนบีอิสมาอีล"], a: "ข", exp: "กะอ์บะฮ์ถือเป็น 'บัยตุลลอฮ์' (บ้านของอัลลอฮ์) ที่นบีอิบรอฮีมและนบีอิสมาอีลร่วมกันสร้างหรือบูรณะขึ้นเพื่อเป็นศูนย์กลางแห่งการเคารพอัลลอฮ์ และเป็นกิบลัตที่มุสลิมทั่วโลกหันหน้าไปในการละหมาด" },
            { q: "5. ข้อใดต่อไปนี้ *ไม่* ถือเป็นส่วนหนึ่งของผลลัพธ์หรือประโยชน์ทางด้านจิตใจและจริยธรรมที่คาดหวังจากการประกอบพิธีฮัจญ์อย่างสมบูรณ์ (ฮัจญ์ มับรูร)?", o: ["การได้รับการอภัยโทษในบาปที่ผ่านมา", "การเพิ่มพูนความอดทน ความเสียสละ และความเห็นอกเห็นใจผู้อื่น", "การได้รับการยอมรับและคำชื่นชมจากสังคมว่าเป็น 'ฮาญี' หรือ 'ฮาญะฮ์'", "การมีความยำเกรง (ตักวา) ต่ออัลลอฮ์เพิ่มมากขึ้น และมีพฤติกรรมที่ดีขึ้นหลังกลับจากฮัจญ์"], a: "ค", exp: "แม้การได้รับเกียรติในสังคมอาจเป็นผลพลอยได้ แต่เป้าหมายหลักของฮัจญ์คือการเปลี่ยนแปลงภายในตนเองเพื่ออัลลอฮ์ ไม่ใช่เพื่อการยอมรับทางสังคม" },
            { q: "6. หลายๆ กิจกรรมในพิธีฮัจญ์ เช่น การสะแอระหว่างเนินเขาซอฟาและมัรวะฮ์ และการเชือดสัตว์พลี เป็นการรำลึกถึงเหตุการณ์สำคัญของบุคคลใดในประวัติศาสตร์อิสลามเป็นหลัก?", o: ["นบีอาดัม (อ.) และการเริ่มต้นของมนุษยชาติ", "นบีมูฮัมมัด (ศ็อลฯ) และการเผยแผ่ศาสนาอิสลาม", "นบีอิบรอฮีม (อ.), พระนางฮาญัร, และนบีอิสมาอีล (อ.)", "บรรดาเคาะลีฟะฮ์ผู้ทรงธรรมและการขยายอาณาจักรอิสลาม"], a: "ค", exp: "การสะแอเป็นการรำลึกถึงการวิ่งหาน้ำของพระนางฮาญัรเพื่อให้นบีอิสมาอีล การขว้างเสาหินรำลึกถึงการต่อต้านชัยฏอนของนบีอิบรอฮีม และการเชือดสัตว์รำลึกถึงความพร้อมของนบีอิบรอฮีมที่จะเชือดพลีบุตรชายตามพระบัญชา" },
            { q: "7. การตอวาฟ (การเดินเวียนรอบกะอ์บะฮ์ 7 รอบ) สะท้อนถึงหลักการหรือแนวคิดใดในอิสลาม?", o: ["การหมุนเวียนของจักรวาลและสรรพสิ่งรอบศูนย์กลางแห่งการสร้างสรรค์", "การอุทิศตนและการหมุนรอบแกนแห่งการเคารพภักดีต่ออัลลอฮ์องค์เดียว", "การรำลึกถึงการสร้างกะอ์บะฮ์โดยนบีอิบรอฮีมและนบีอิสมาอีล", "ถูกทุกข้อ"], a: "ง", exp: "ตอวาฟมีความหมายลึกซึ้งหลายมิติ ทั้งการแสดงความเป็นเอกภาพของพระเจ้า (เตาฮีด) การรำลึกถึงประวัติศาสตร์ และการเชื่อมโยงตนเองเข้ากับระบบจักรวาลที่สรรเสริญอัลลอฮ์" },
            { q: "8. 'ฮัจญ์ มับรูร' (ฮัจญ์ที่ถูกตอบรับ) มีผลตอบแทนตามหะดีษว่าคือสวรรค์ คำว่า 'มับรูร' ในที่นี้บ่งบอกถึงลักษณะของฮัจญ์อย่างไร?", o: ["ฮัจญ์ที่ทำอย่างรวดเร็วและประหยัดที่สุด", "ฮัจญ์ที่ปราศจากคำพูดหยาบคาย การกระทำที่ชั่วช้า และการโต้เถียง และประกอบด้วยความอิคลาศ (บริสุทธิ์ใจ)", "ฮัจญ์ที่หรูหราและใช้จ่ายทรัพย์สินจำนวนมาก", "ฮัจญ์ที่ทำซ้ำหลายครั้งที่สุด"], a: "ข", exp: "ฮัจญ์ มับรูร คือฮัจญ์ที่ทำอย่างถูกต้องตามแบบอย่างของท่านนบีฯ ด้วยความบริสุทธิ์ใจต่ออัลลอฮ์ และผู้ทำฮัจญ์กลับมาพร้อมกับการเปลี่ยนแปลงที่ดีขึ้นในชีวิต" },
            { q: "9. ในกรณีที่บุคคลหนึ่งเสียชีวิตไปแล้วโดยยังไม่ได้ประกอบพิธีฮัจญ์ ทั้งๆ ที่มีความสามารถ (อิสติฏออะฮ์) ในช่วงชีวิตของเขา หรือป่วยเรื้อรังจนไม่สามารถเดินทางไปทำฮัจญ์ด้วยตนเองได้ หลักการอิสลามอนุญาตให้มีการทำ 'ฮัจญ์ บะดัล' (ฮัจญ์แทน) หรือไม่ และมีเงื่อนไขอย่างไร?", o: ["ไม่อนุญาตโดยเด็ดขาด ฮัจญ์เป็นเรื่องเฉพาะบุคคล", "อนุญาต โดยผู้ทำแทนต้องเคยทำฮัจญ์ให้ตัวเองแล้ว และต้องได้รับมอบหมายหรือทำเพื่อผู้เสียชีวิต/ผู้ป่วยนั้น", "อนุญาตเฉพาะกรณีผู้เสียชีวิต แต่ไม่รวมผู้ป่วยเรื้อรัง", "อนุญาตให้ใครก็ได้ทำแทน โดยไม่จำเป็นต้องเคยทำฮัจญ์ของตนเองมาก่อน"], a: "ข", exp: "อนุญาตให้มีการทำฮัจญ์แทน (ฮัจญ์ บะดัล) สำหรับผู้ที่เสียชีวิตไปแล้วโดยมีหนี้สินฮัจญ์ หรือผู้ที่ป่วยเรื้อรังจนสิ้นหวังที่จะหายและไม่สามารถเดินทางได้ โดยผู้รับทำแทนควรจะเคยทำฮัจญ์ของตนเองมาแล้ว และตั้งเจตนาทำเพื่อบุคคลนั้นๆ" },
            { q: "10. การวุกูฟ (การพำนัก) ณ ทุ่งอะรอฟะฮ์ ในวันที่ 9 ซุลฮิจญะห์ ถือเป็นองค์ประกอบสำคัญที่สุด (รุก่น) ของฮัจญ์ หากผู้ใดพลาดการวุกูฟในเวลาที่กำหนด ผลจะเป็นอย่างไร?", o: ["ฮัจญ์ของเขาจะยังสมบูรณ์ แต่ต้องจ่ายค่าชดเชย (ดัม)", "ฮัจญ์ของเขาจะไม่สมบูรณ์ (ถือว่าพลาดฮัจญ์ในปีนั้น) และต้องกลับมาทำใหม่ในปีถัดไปหากมีความสามารถ", "ฮัจญ์ของเขาสมบูรณ์ แต่ต้องถือศีลอดชดเชย 60 วัน", "สามารถทำการวุกูฟชดเชยในวันอื่นได้ภายในเดือนซุลฮิจญะห์"], a: "ข", exp: "ท่านนบีฯ กล่าวว่า 'อัลฮัจญุ อะเราะฟะฮ์' (ฮัจญ์คืออะรอฟะฮ์) การพลาดวุกูฟ ณ ทุ่งอะรอฟะฮ์ในเวลาที่กำหนด (ตั้งแต่ตะวันคล้อยของวันที่ 9 ซุลฮิจญะห์ จนถึงแสงอรุณของวันที่ 10) หมายถึงการพลาดฮัจญ์ในปีนั้น และจะต้องทำใหม่" }
        ]
    };

    const optionLetters = ['ก', 'ข', 'ค', 'ง'];

    startButton.addEventListener('click', startGame);
    nextButton.addEventListener('click', loadNextQuestion);
    playAgainButton.addEventListener('click', resetGame);
    viewScoresButton.addEventListener('click', () => {
        window.open(`https://docs.google.com/spreadsheets/d/${SHEET_ID_FOR_VIEW}/edit?usp=sharing`, '_blank');
    });

    function startGame() {
        playerName = playerNameInput.value.trim();
        if (!playerName) {
            alert('กรุณากรอกชื่อ-สกุลของคุณ');
            return;
        }
        selectedLevel = levelSelect.value;
        currentQuestions = questions[selectedLevel];
        currentQuestionIndex = 0;
        score = 0;
        secondsElapsed = 0;

        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        endScreen.classList.add('hidden');
        
        levelDisplay.textContent = `ระดับ: ${selectedLevel}`;
        updateScoreDisplay();
        startTimer();
        loadQuestion();
    }

    function startTimer() {
        clearInterval(timerInterval); // Clear any existing timer
        timerInterval = setInterval(() => {
            secondsElapsed++;
            const minutes = Math.floor(secondsElapsed / 60);
            const seconds = secondsElapsed % 60;
            timerDisplay.textContent = `เวลา: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function loadQuestion() {
        feedback.textContent = '';
        feedback.className = 'feedback'; // Reset feedback class
        nextButton.classList.add('hidden');
        
        if (currentQuestionIndex < currentQuestions.length) {
            const questionData = currentQuestions[currentQuestionIndex];
            questionText.textContent = questionData.q;
            optionsContainer.innerHTML = '';
            questionData.o.forEach((option, index) => {
                const button = document.createElement('button');
                button.textContent = `${optionLetters[index]}. ${option}`;
                button.addEventListener('click', () => selectAnswer(optionLetters[index], button, questionData.a, questionData.exp));
                optionsContainer.appendChild(button);
            });
        } else {
            endGame();
        }
    }

    function selectAnswer(selectedOptionLetter, button, correctAnswerLetter, explanation) {
        stopTimer(); // Stop timer when an answer is selected for this question, restart for next
        
        Array.from(optionsContainer.children).forEach(btn => {
            btn.disabled = true; // Disable all option buttons
        });

        const pointsPerQuestion = 100 / currentQuestions.length;

        if (selectedOptionLetter === correctAnswerLetter) {
            score += pointsPerQuestion;
            button.classList.add('correct');
            feedback.textContent = `ถูกต้อง! ${explanation}`;
            feedback.classList.add('correct');
        } else {
            button.classList.add('incorrect');
            feedback.textContent = `ผิด! คำตอบที่ถูกต้องคือ ${correctAnswerLetter}. ${explanation}`;
            feedback.classList.add('incorrect');
            // Highlight the correct answer
            Array.from(optionsContainer.children).forEach((optBtn, idx) => {
                if (optionLetters[idx] === correctAnswerLetter) {
                    optBtn.classList.add('correct');
                }
            });
        }
        updateScoreDisplay();
        nextButton.classList.remove('hidden');
        if (currentQuestionIndex >= currentQuestions.length -1) {
            nextButton.textContent = "ดูผลลัพธ์";
        } else {
            nextButton.textContent = "คำถามถัดไป";
        }
    }
    
    function loadNextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < currentQuestions.length) {
           startTimer(); // Restart timer for the new question
        }
        loadQuestion();
    }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `คะแนน: ${Math.round(score)}`;
    }

    function endGame() {
        stopTimer(); // Final stop
        quizScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');

        finalPlayerName.textContent = `ชื่อ-สกุล: ${playerName}`;
        finalLevel.textContent = `ระดับ: ${selectedLevel}`;
        const minutes = Math.floor(secondsElapsed / 60);
        const seconds = secondsElapsed % 60;
        finalTime.textContent = `เวลาที่ใช้: ${String(minutes).padStart(2, '0')} นาที ${String(seconds).padStart(2, '0')} วินาที`;
        finalScoreDisplay.textContent = `คะแนนที่ได้: ${Math.round(score)} / 100`;
        
        savingStatus.textContent = "กำลังบันทึกคะแนน...";
        saveScoreToSheet(playerName, selectedLevel, secondsElapsed, Math.round(score));
    }

    function saveScoreToSheet(name, level, time, finalScore) {
        const formData = new FormData();
        formData.append('timestamp', new Date().toLocaleString('th-TH'));
        formData.append('name', name);
        formData.append('level', level);
        formData.append('time', time); // Save time in seconds
        formData.append('score', finalScore);

        fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === 'success') {
                savingStatus.textContent = "บันทึกคะแนนเรียบร้อยแล้ว!";
                savingStatus.style.color = "green";
            } else {
                savingStatus.textContent = "เกิดข้อผิดพลาดในการบันทึก: " + (data.message || "Unknown error");
                savingStatus.style.color = "red";
                console.error("Error from Apps Script:", data);
            }
        })
        .catch(error => {
            savingStatus.textContent = "เกิดข้อผิดพลาดในการเชื่อมต่อเพื่อบันทึกคะแนน";
            savingStatus.style.color = "red";
            console.error('Error saving score:', error);
        });
    }

    function resetGame() {
        endScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        playerNameInput.value = ''; // Clear player name for next game
        // Reset other states if necessary, but startGame will re-initialize them
    }
});