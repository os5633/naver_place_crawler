import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

(async () => {
  const targetUrl = 'https://m.place.naver.com/restaurant/1913147400/home?entry=pll';
  const prefixTag =
    '#app-root > div > div > div.place_detail_wrapper div.place_section.no_margin> div';

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(targetUrl);

  // 영업시간 펼치기
  await page.click(prefixTag + '> ul > li.Cqsis._1X-CS > div > a ');

  const content = await page.content();
  const $ = cheerio.load(content);

  // 타겟 객체
  let target = {};

  // 영업 시간 리스트
  const times = $(prefixTag + '> ul > li.Cqsis._1X-CS > div > a > div.vfjlt');
  let time = '';
  times.each((_, times) => {
    const timeText: string =
      $(times).find('span.j9L2O').text() + $(times).find('div._2WoIY').text();

    if (timeText != '') {
      time = time + timeText + '\n';
    }
  });

  const num = $(prefixTag + '> div > div.afDDM > div > span:nth-child(1) > a');

  const reservation = $(
    prefixTag + '> div > div._3wP2G.JJjn3 > div > span > a'
  );

  let homePage =
    $(prefixTag + '> ul > li.iSlFU._2reeS > div > div > a').attr('href') ?? '';

  let instagram = '';
  let facebook = '';
  let youtube = '';
  let blog = '';

  // 홈페이지에 sns가 등록되어 있을경우 필터
  if (checkUrl(homePage, 'instagram.')) {
    instagram = homePage;
    homePage = '';
  } else if (checkUrl(homePage, 'facebook.')) {
    facebook = homePage;
    homePage = '';
  } else if (checkUrl(homePage, 'youtube.')) {
    youtube = homePage;
    homePage = '';
  } else if (checkUrl(homePage, 'blog.')) {
    blog = homePage;
    homePage = '';
  }

  const snsUrls = $(
    prefixTag + '> ul > li.iSlFU._2reeS > div > div._26bQd > span._3QPta'
  );

  // sns등록 리스트에서 분류(순서대로 되어있지 않아서 string으로 체크)
  snsUrls.each((_, urls) => {
    const url = $(urls).find('a').attr('href') ?? '';

    if (checkUrl(url, 'instagram.')) {
      instagram = url ?? '';
    } else if (checkUrl(url, 'facebook.')) {
      facebook = url ?? '';
    } else if (checkUrl(url, 'youtube.')) {
      youtube = url ?? '';
    } else if (checkUrl(url, 'blog.')) {
      blog = url ?? '';
    }
  });

  function checkUrl(url: string, filter: string): boolean {
    return url.indexOf(filter) !== -1;
  }

  target = {
    ['time']: time,
    ['num']: num.attr('href')?.replace('tel:', '') ?? '',
    ['homepage']: homePage ?? '',
    ['instagram']: instagram ?? '',
    ['youtube']: youtube ?? '',
    ['facebook']: facebook ?? '',
    ['blog']: blog ?? '',
    ['reservation']: reservation.attr('href')
      ? 'https://m.place.naver.com' + reservation.attr('href')
      : '',
  };

  console.log(target);

  browser.close();
})();
