import { createId } from "@paralleldrive/cuid2";
import test, { expect } from "@playwright/test";
import { InputBlockType } from "@typebot.io/blocks-inputs/constants";
import { defaultNumberInputPlaceholder } from "@typebot.io/blocks-inputs/number/constants";
import { createTypebots } from "@typebot.io/playwright/databaseActions";
import { parseDefaultGroupWithBlock } from "@typebot.io/playwright/databaseHelpers";

test.describe("Number input block", () => {
  test("options should work", async ({ page }) => {
    const typebotId = createId();
    await createTypebots([
      {
        id: typebotId,
        ...parseDefaultGroupWithBlock({
          type: InputBlockType.NUMBER,
        }),
      },
    ]);

    await page.goto(`/typebots/${typebotId}/edit`);

    await page.click("text=Test");
    await expect(
      page.locator(`input[placeholder="${defaultNumberInputPlaceholder}"]`),
    ).toHaveAttribute("type", "number");

    await page.click(`text=${defaultNumberInputPlaceholder}`);
    await page.getByLabel("Placeholder:").fill("Your number...");
    await expect(page.locator("text=Your number...")).toBeVisible();
    await page.getByLabel("Button label:").fill("Go");
    await page.fill('[role="spinbutton"] >> nth=0', "0");
    await page.fill('[role="spinbutton"] >> nth=1', "100");
    await page.fill('[role="spinbutton"] >> nth=2', "10");

    await page.click("text=Restart");
    const input = page.locator(`input[placeholder="Your number..."]`);
    await input.fill("-1");
    await input.press("Enter");
    await input.fill("150");
    await input.press("Enter");
    await input.fill("50");
    await input.press("Enter");
    await expect(page.locator("text=50")).toBeVisible();
  });
});
