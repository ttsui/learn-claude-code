import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../support/world";
import { HomePage } from "../page_objects/HomePage";

Given("I am on the home page", async function (this: CustomWorld) {
  const homePage = new HomePage(this.page!);
  await homePage.navigate();
});
