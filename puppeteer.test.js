const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized']
    });

    const page = await browser.newPage();

    // Set viewport to full screen
    await page.setViewport({ width: 1920, height: 1080 });

    await page.goto('http://localhost:3000', { waitUntil: "networkidle0" });

    await page.waitForSelector('#inputTitle');

    // Generate the current time in H:i:s format
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });

    // Type the current time as task title
    var taskName='task'+currentTime
    await page.type('#inputTitle',taskName );

    // Select the due date (auto-select today's date)
    await page.click('input[name="due"]');
    await page.keyboard.press('Enter');

    // Click Add button
    await page.click('button.btn-primary');

    // Wait for the table to update
    await page.waitForSelector('table tbody tr');
    await new Promise(res => setTimeout(res, 3000));

    console.log('Task added successfully:', taskName);

    // **EDIT TEST STARTS HERE**
    const lastRowEditButton = await page.$('table tbody tr:last-child button.btn-warning');

    if (lastRowEditButton) {
        await lastRowEditButton.click();
        console.log('Edit button clicked for:', taskName);

        // Wait for the status dropdown to become enabled
        await new Promise(res => setTimeout(res, 1000));

        // Select "completed" from the dropdown
        await page.select('table tbody tr:last-child select', 'completed');

        // Click the "Update" button
        const updateButton = await page.$('table tbody tr:last-child button.btn-success');
        if (updateButton) {
            await updateButton.click();
            console.log('Update button clicked.');
        } else {
            console.log('Update button not found.');
        }

        // Wait for the update process
        await new Promise(res => setTimeout(res, 3000));

        // Verify if the task status is updated
        const updatedStatus = await page.evaluate(() => {
            return document.querySelector('table tbody tr:last-child select').value;
        });

        if (updatedStatus === 'completed') {
                 await page.waitForSelector('.swal2-confirm');
await page.click('.swal2-confirm');

            console.log('Task successfully updated to "completed".');
        } else {
            console.log('Task update failed.');
        }
    } else {
        console.log('No edit button found, possibly no tasks exist.');
    }
         await new Promise(res => setTimeout(res, 1000));

 await page.waitForSelector('table tbody tr');

     // Find the last row in the table
     const lastRowDeleteButton = await page.$('table tbody tr:last-child .delete_btn');

     if (lastRowDeleteButton) {
         await lastRowDeleteButton.click();
         console.log('Delete button clicked for:', taskName);

         // Wait for the SweetAlert2 confirmation popup

         await page.waitForSelector('.swal2-confirm');

         // Click "Yes" to confirm deletion

await page.waitForSelector('.swal2-confirm', { visible: true, timeout: 2000 });
await page.click('.swal2-confirm');
         console.log('Confirmed deletion');

         // Wait for the table to update after deletion
         await new Promise(res => setTimeout(res, 1000));

         // Verify if the task is deleted by checking if the row is still present
         const deletedTask = await page.evaluate((taskName) => {
             return ![...document.querySelectorAll('table tbody tr td:nth-child(2)')].some(td => td.innerText === taskName);
         }, taskName);

         if (deletedTask) {
             console.log('Task deleted successfully:', taskName);
         } else {
             console.log('Task deletion failed:', taskName);
         }
     } else {
         console.log('No delete button found, possibly no tasks exist.');
     }

     await browser.close();

    await browser.close();
})();
