import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { HomePage } from '../page_objects/HomePage';

Then('I should see the heading {string}', async function (this: CustomWorld, text: string) {
  const homePage = new HomePage(this.page!);
  await homePage.verifyHeading(text);
});

Then('I should see the text {string}', async function (this: CustomWorld, text: string) {
  const homePage = new HomePage(this.page!);
  await homePage.verifyTextVisible(text);
});
