const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/crawl', async (req, res) => {
  const targetUrl = req.query.url;
  const regExp = /\/(\d+)$/;
  const match = targetUrl.match(regExp);
  const LastNum = match ? match[1] : '';

  if (!targetUrl) {
    return res.status(400).send('URL 파라미터가 필요합니다.');
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',  // 새로운 헤드리스 모드 사용
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',
        '--no-zygote'
      ]
    });
    
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    
    // 콘솔 로그 출력
    page.on('console', message => console.log(`Browser Console: ${message.type().substr(0, 3).toUpperCase()} ${message.text()}`));
    
    await page.goto(targetUrl, { waitUntil: 'networkidle0' });

    if (LastNum < 601) {
      await page.evaluate(() => {
        const select = document.querySelector('select[name="hdrwComb"]');
        select.value = '2';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      new Promise(resolve => setTimeout(resolve, 2000));

      await page.evaluate((LastNum) => {
        const select = document.querySelector('select[name="dwrNoList"]');
        select.value = LastNum;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }, LastNum);

      new Promise(resolve => setTimeout(resolve, 2000));

      console.log('폼 제출 대기');
    
      await page.evaluate(() => {
        const button = document.querySelector('a#searchBtn');
        button.click();
      });

      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      await page.evaluate(() => { return document.querySelector('a#searchBtn').click(); }); // clear yet
      console.log('페이지 업데이트 완료');
    }


    await page.waitForSelector('.ball_645', { visible: true, timeout: 10000 });

    const content = await page.content();
    const $ = cheerio.load(content);

    const nums = [];
    $('.ball_645').each((index, element) => {
      nums.push($(element).text().trim());
    });

    console.log('수집된 번호:', nums);

    res.json({ nums });
    
  } catch (error) {
    console.error('crawling error:', error);
    res.status(500).send('크롤링 중 오류가 발생했습니다.');
  } finally {
    if (browser) {
      await browser.close();  
    }
  }  
});

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});

// https://manatoki460.net/comic/17335717?sst=as_view&sod=desc&tag=17
// https://newtoki460.com/webtoon/40239246?stx=%EB%AA%BB%ED%95%98%EB%8A%94&toon=%EC%9D%BC%EB%B0%98%EC%9B%B9%ED%88%B0
// https://page.kakao.com/content/56143162/viewer/56143299
// 4.5+
//픽미업/죽사헌/전독시/잔불의기사/투신전생기/용비불패/북검전기/광마회귀/여포의인생/휘영검전/재벌집막내/광장
//===================================
//4.0+
//나혼렙/해골병사/쥐뿔도없는/빌어먹을환생/던전견문록/엔딩메이커/귀환자의마법/애늙은이/나태공자/로그인무림/화산귀환/아비무쌍/무림서부/무한레벨업/상남자/배우로서/캐슬