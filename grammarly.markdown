# Grammarly

[Grammarly](https://www.grammarly.com/) is an app that assesses a piece of writing for common grammar mistakes and offers suggestions for correcting them.

The intent with Grammarly is to reduce the time necessary for code reviews and help us to improve our grammar skills in general at the same time.

## Get Grammarly

### Create a Free Grammarly Account

Go to [https://www.grammarly.com/signin](https://www.grammarly.com/signin) and create a free Grammarly account.

### Get the Grammarly Mac App

For checking posts, you should download **Grammarly for Mac** from the following link: [https://www.grammarly.com/native/mac](https://www.grammarly.com/native/mac).

Install the app on your computer. You'll then need to log into the app with your account.

## Check Posts with Grammarly

> ⚠ **IMPORTANT:** Grammarly works by submitting post content to a server, which then assesses the text. Do _not_ run any content through Grammarly that contains important or confidential information such as PII (Personally Identifiable Information), company funding news that is not ready for public publication, etc. If it is not acceptable to submit content to GitHub in a public PR, then it is _not_ acceptable to submit it to Grammarly either. Any content that must be kept confidential in a Google Doc until publication should not be sent to Grammarly's server pre-publication.

Prior to submitting a new blog post for review via Pull Request, please make sure that you check the content with Grammarly.

Grammarly currently does not support Markdown file import, so you will need to copy and paste your post content into a new file.

In the **My Grammarly** home screen of the app, click the **New** icon to create a file. Then paste the contents of your post into the editor. Fortunately, Grammarly is good at ignoring things like code blocks so you shouldn't need to worry about being repeatedly told that `someFunction() {` is improper grammar.

When you paste your text, Grammarly sends the content to its servers and runs a grammar check. The number of issues is shown in the bottom right of the app. **Critical Issues** should be addressed. **Advanced Issues** are only available to paid users.

Issues appear to the right of your content like so:

![](https://cdn.auth0.com/blog/grammarly/doc.jpg)

If you'd like to see more details about the issue, click the little down arrow to continue to expand details:

![](https://cdn.auth0.com/blog/grammarly/doc-issue-expanded.jpg)

Each issue **must still be assessed individually**. Please do _not_ simply go through the document accepting or ignoring all issues. Computers are great, but they are still not at a point where they're a substitution for a human brain.

To **accept** a suggestion, you can click on the appropriate green suggestion text. In some cases, there may be more than one correction possibility. Choose the one that makes the most sense to you once you've assessed the issue.

To **ignore** a suggestion, simply click the x icon.

If you have any questions about the validity of Grammarly's suggestions, please ask in the `#english-questions` Slack channel.

Once you've verified **all Critical Issues**, update your post Markdown with the corrected content, then go ahead and submit your PR for peer review.

## Grammarly Should Promote Good Habits

Make sure that as you are assessing issues uncovered by Grammarly, you ensure that you are learning from them. The tool is still not quite doing its intended job if we simply accept its suggestions and don't thoroughly understand _why_ the suggestions are being made.
