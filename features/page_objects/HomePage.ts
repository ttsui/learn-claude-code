import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  private readonly heading = this.page.locator("h1");
  private readonly description = this.page.locator("p");

  constructor(page: Page) {
    super(page);
  }

  async navigate() {
    await this.goto("http://localhost:3000");
    await this.waitForPageLoad();
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent()) || "";
  }

  async verifyHeading(expectedText: string) {
    await expect(this.heading).toHaveText(expectedText);
  }

  async verifyTextVisible(text: string) {
    await expect(this.page.locator(`text=${text}`)).toBeVisible();
  }
}
