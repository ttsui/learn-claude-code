import { Page } from "@playwright/test";

export class BasePage {
  constructor(protected page: Page) {}

  async goto(url: string) {
    await this.page.goto(url);
  }

  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState("networkidle");
  }
}
