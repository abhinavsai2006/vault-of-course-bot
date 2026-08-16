const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to localhost:3000...");
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // 1. Screenshot of the page with closed chatbot
  console.log("Taking screenshot 1 (closed)...");
  await page.screenshot({ path: 'screenshot_closed.png' });

  // 2. Open chatbot and screenshot
  console.log("Opening chatbot...");
  // Click the floating button. Assuming the button has a specific class or we can click near bottom right
  await page.mouse.click(1250, 770); 
  await new Promise(r => setTimeout(r, 1000)); // wait for animation
  console.log("Taking screenshot 2 (open)...");
  await page.screenshot({ path: 'screenshot_open.png' });

  // 3. Interact with the chatbot
  console.log("Typing message...");
  // Click the first quick action chip: "Explore Courses"
  // Let's just find and click any button containing "Explore Courses"
  const chips = await page.$$('button');
  for (let chip of chips) {
    const text = await page.evaluate(el => el.textContent, chip);
    if (text.includes('Explore Courses')) {
      await chip.click();
      break;
    }
  }

  // Wait for the bot to reply (loading dot goes away, new message appears)
  console.log("Waiting for response...");
  await new Promise(r => setTimeout(r, 4000));
  
  console.log("Taking screenshot 3 (interaction)...");
  await page.screenshot({ path: 'screenshot_interaction.png' });

  await browser.close();
  console.log("Screenshots captured successfully!");
})();
