# instantOutlines

Sharing outlines between apps using GitHub as the intermediary.

### Demo app

Here's a <a href="http://scripting.com/code/instantoutlinesrepo/demo/">demo app</a> that watches an outline that flows through this repo. 

It's an <a href="https://github.com/scripting/instantOutlines/blob/main/outlines/twitter/davewiner.opml">outline</a> that's generated from threads I post <a href="https://twitter.com/davewiner">on Twitter</a>. 

In the demo app, you don't have to reload to see my updates, they will appear automatically.

This is the basic functionality I want all outliners to support. It's easy, and the result will be an unprecedented level of interop. 

The JavaScript source code for the demo app is <a href="https://github.com/scripting/instantOutlines/tree/main/demo">here</a>. 

### If you're a developer...

You can subscribe to any of these outlines. Just follow the example of the demo app.

0. Start by subscribing to <a href="https://raw.githubusercontent.com/scripting/instantOutlines/main/outlines/twitter/davewiner.opml">my outline</a>. I generally update about 20 times a day, pretty reliably. 

1. You'll read the outline initially. 

1. You'll set up a web socket handler to subscribe to the outline. 

2. Wait for an updated outline to come over the wire. 

All of these are illustrated in the demo app. 

When you have a demo running, let us know by tweet, email or a post in the Issues section here. 

### This is a working site

1. Outlines flow into the site. The outlines contain tweets of users we're following.

2. I have an app running on my desktop that checks several Twitter accounts once a minute. When one of these users tweets, we add it to a calendar-structured outline, and using the GitHub API, post it here. in the outlines folder. 

3. I've set up a GitHub web mook, that notifies a server app that the outline has updated. 

4. We then send a message, via web sockets, to any app that's subscribed to the outline, with the full OPML text of the outline. It's totally up to the individual apps what they do with the outline.

5. The net effect is that the changed outlines flow to any app that wants to subscribe to them.

### Simple use-case

Imagine you're editing a blog post in your outliner. When you make a change, the blog publishing software (say WordPress. Medium or Substack, as examples) gets a notification that the outline was updated, along with the new version of the outline as a web sockets message. It then publishes the changed post without you doing anything more. 

Compare this to how it works without the connection. You make a change to the outline, copy the text to the clipbord, go into WordPress (or another blogging tool), open the post in their editor, and paste the changed version into their editor, and save. That's how things work now. All that work could obviously be done by software, no rocket science involved. All that's needed is a will on the part of developers to improve technology for users. That could be a competitive advantage, or something you do for your users because you have pride in your product, and you want to help them do what they do better. 

### socketServer

The source for the server is <a href="https://github.com/scripting/socketServer">here</a>.

### Philosophy

You can run your own server if you want, flowing outlines from your GitHub repo. 

There's nothing exclusive about anything here. 

I don't really have an interest in being the central node, I just want to set up a prototype, work with other developers to interop, build apps off the power of instant outlining. 

### OPML everywhere

A couple of things about OPML.

1. I used an outliner to write this site and the example app. The source is <a href="https://github.com/scripting/instantOutlines/blob/main/misc/source.opml">here</a>.

2. A <a href="http://this.how/opmlChecklist/">checklist</a> of basic info for devs using OPML for interop.

### License

The writing on this site is copyrighted. 

The code we're demonstrating is MIT-licensed. 

### Updates

#### 6/11/21 by DW

When there are updates they will appear here. 

### Discussion

Please use the <a href="/issues">issues section</a> of this repo. Be friendly and let's have fun. :-)

