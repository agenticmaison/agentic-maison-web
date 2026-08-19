# Writing for the journal

This is the guide to the journal editor — how to open it, write a post, put a
picture in one, and send it for review.

You do not need to install anything or learn any commands. Everything happens in
a browser.

> **Draft.** Everything below the sign-in section has been tested and works. The
> sign-in section itself is a placeholder — see the note there.

---

## Before you start

**Use Chrome or Edge.** The editor does not work in Safari or Firefox. This is
not a preference; the part of the browser it needs to save your work only exists
in Chrome-family browsers.

**Every post is written in English. Chinese is optional.** A new post starts with
English alone, and that is a complete post — it publishes, and its Chinese page
shows the English article under a line saying the article is English only.

**A post with both languages is still one post, not two.** When you do add
Chinese, you switch between the two halves with the **English** / **Chinese**
buttons at the top of the editor, and neither half can be left half-finished.
Turning Chinese on for a post is described under *Adding a Chinese version*
below.

---

## Signing in

> **[web-007]** This section is deliberately blank. Sign-in needs a piece of
> setup that has not been done yet, and writing instructions for a screen nobody
> has seen would be guesswork. When that setup is finished, this section gets the
> real steps: the address to open, the button to press, and what to do if it
> refuses you.
>
> Until then the editor runs only on a developer's own machine.

---

## The screen

Down the left is the list of collections. There is one, **Journal**.

In the middle is the list of posts, newest first. Click one to open it.

At the top right is **Save**. It is greyed out until you change something, and it
stays greyed out if a required field is empty.

---

## Writing a new post

Click **Create New Entry**.

You get an empty form with the **English** tab showing, and only English. Fill it
in and save; that is a finished post. The fields are explained below.

### Adding a Chinese version

Chinese is off until you ask for it. Open the **three-dot menu at the top right**
of the editor and switch Chinese on. A **Chinese** tab appears beside the English
one; fill it in and save, and the post is bilingual from then on.

Switching Chinese back off takes the Chinese version out of the post, and the
post goes back to publishing in English only. Do it deliberately — the Chinese
text you wrote is not kept anywhere else.

Three of the fields are shared between the two languages — **URL Slug**,
**Publication date** and **Author**. You fill them in once, on the English tab.
On the Chinese tab they appear greyed out, showing the same values. That is
correct; there is nothing to do to them there.

### The fields

**URL Slug** — the tail end of the post's link. Lowercase words joined by
hyphens, like `what-is-an-ai-agent`. Keep it short and readable, and describe the
subject rather than the headline.

Once a post is published, **do not change this.** It is the post's address. Change
it and every existing link to the post — in an email, on LinkedIn, in a search
result — stops working.

**Publication date** — pick it from the calendar. It does three things: it sets
the order posts appear in on the journal page, it is the date printed on the post
in whichever language the reader is reading, and it decides the post's issue
number. Posts are numbered in publication order, oldest first, so dating a new
post *before* an existing one shifts every number after it.

**Title** — the headline. Per language, and it is a translation rather than a
transliteration; write the Chinese headline as a Chinese headline.

**Article description** — one sentence describing the post, per language. It does
every description job the post has: it sits under the headline, it is the summary
on the journal index card, and it is what Google prints under the headline in
search results. Write it as a sentence a stranger would read, not as a keyword
list.

**Aim for about 160 characters.** That is the length search results show before
cutting off mid-sentence. It is guidance, not a rule — the editor will save a
longer one. **A description is required**, though: there is no saving without it.

**Author** — Sean or Vincent. If a post needs a different byline, that is a change
a developer has to make; ask rather than working around it.

**Questions and answers** — optional. Questions a reader would genuinely type,
each with a direct answer in plain prose. They print at the foot of the post, and
they are what search engines quote when someone asks the question. Use **Add
Question** for each pair. Leave the list empty if the post does not need one.

**Article** — the post itself. See the next section.

---

## Writing the article

The Article box opens in **Markdown** view: plain text with a few marks in it that
control formatting.

The five you need:

| To get | Type |
| --- | --- |
| A section heading | `## Your heading` on its own line |
| A smaller heading under it | `### Your heading` |
| **Bold** | `**bold**` |
| A link | `[the words you see](https://the-address)` |
| A thin dividing line | `---` on its own line |

Leave a blank line between paragraphs. That is what separates them.

**Why plain text and not a word-processor view.** There is a rich-text view — the
button above the box switches to it — and it is genuinely nicer to type in. But it
rewrites the whole article when you save, not just the part you changed. The
result reads identically on the page; it is the underlying text that shifts
around, which makes it much harder for anyone reviewing your change to see what
you actually did. So the plain view is the one that opens by default, and it is
the one to use for writing and for fixing typos.

Switch to rich text when you need to place a picture, and switch back afterwards.

---

## Putting a picture in a post

1. Click the **rich-text button** above the Article box. The toolbar lights up.
2. Put your cursor where the picture should go — on its own line, with a blank
   line above and below, unless you specifically want it sitting inside a
   paragraph.
3. Click the **image button** in the toolbar and choose your file.
4. Switch back to the plain Markdown view.
5. Save.

**Do not resize or compress the file first.** The editor does that for you: it
converts the picture to a modern format, caps it at 1600 pixels wide, and
compresses it. A 2.8 MB screenshot came out of that at 12 KB with no visible
difference. Upload the original.

**Give the picture a description.** In the rich-text view there is an alt-text box
when a picture is selected. One plain sentence saying what the picture shows.
People using a screen reader get that instead of the picture, and search engines
read it too.

Pictures belong to the post they are put in. Each post keeps its own, and deleting
a post takes its pictures with it.

---

## Editing a post that is already published

Open it from the list, change what needs changing, save.

You can safely change the headline, the description, the article text, the
questions, and the pictures.

**Do not change the URL Slug** on a published post. See above.

**Changing the publication date moves more than the date.** It reorders the
journal index and can change this post's issue number and every number after it.
Fixing a typo needs no date change; leave it alone.

---

## Saving, and what happens next

**Save** does not put the post on the live site. It files the change for review.

Each post you are working on is held separately from the live site, so a
half-finished post cannot appear on it by accident. Someone reviews the change and
publishes it, and only then does it go live.

> **Not yet proven.** The review-and-publish step is set up but has not been run
> end to end, because it needs the sign-in setup above. Expect the person who
> sets that up to walk through it with you the first time.

---

## When something goes wrong

**Save is greyed out.** Either you have not changed anything yet, or a required
field is empty. Look at the **English** and **Chinese** buttons at the top — a
small error mark appears on whichever language has the problem. Switch to it and
look for the field flagged in red. It is most often the article description.

**The URL Slug is rejected.** Lowercase letters, numbers and hyphens only. No
spaces, no capitals, no punctuation.

**Your changes are not on the live site.** Saving files a change for review; it does
not publish. See the section above.

**The editor will not open, or the page is blank.** Check you are in Chrome or
Edge. Safari and Firefox cannot run it.

---

## For whoever maintains this

The editor is Sveltia CMS, pinned to an exact version in
`public/admin/index.html`. The form above is defined in `public/admin/config.yml`,
which carries the reasoning for each setting in comments.

The version is pinned on purpose. Before moving to a newer one, repeat the
fidelity check recorded in `ops/prds/web-004-sveltia-cms-install.md`: copy a real
post to a throwaway address, change one character of its title through the editor,
save, and confirm the only difference in the resulting files is that character.
A serializer change in a new release would otherwise be discovered through a
mangled article.
