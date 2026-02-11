import os
import asyncio
from playwright.async_api import async_playwright

async def run():
    os.environ['HOME'] = 'C:\\Users\\HANA'
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto('https://m.hanatour.com/dcr/chatai')
        await page.wait_for_timeout(5000) # Wait for load
        await page.screenshot(path='chatbot_home.png')
        print(f"Page Title: {await page.title()}")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
