# Obsidian Starter Pack
This is a ready-to-go "Starter Pack" for [Obsidian](https://obsidian.md/). 

It is designed to be a starting point for new users, providing a basic folder structure, pre-installed plugins, and helpful settings enabled. 

All templates can be used independently of the Starter Pack, but are included here for convenience.

## Features
- 🔋 "Batteries included" pre-installed plugins
- 🙂 Customizable Emoji icons for anything
- ⌨ Emoji popup window when typing `:`
- ☑ Helpful settings enabled by default
- 📂 Basic folder structure
- 🛕 Templates and Dataview query examples
- 📓 Periodic notes with pre-configured templates
- 📆 Calendar and Day Planner
- 👷 Project management tools
- 🎥 [[README#YouTube template|Automatic YouTube metadata extraction]]

## Quick Start
1. Download or clone this repository: `git clone https://github.com/quaternionmedia/obsidian-templates.git`
2. Open the folder as a vault in Obsidian
3. (Optional) [Check for plugin updates](obsidian://advanced-uri?settingid=third-party-plugin) and upgrade to the latest versions

### Plugins
- [Dataview](https://github.com/blacksmithgu/obsidian-dataview)
- [Day planner](https://github.com/ivan-lednev/obsidian-day-planner)
- [Excalidraw](https://github.com/zsviczian/obsidian-excalidraw-plugin)
- [Iconize](https://github.com/FlorianWoelki/obsidian-iconize)
- [Periodic notes](https://github.com/liamcain/obsidian-periodic-notes)
- [Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks)
- [Templater](https://github.com/SilentVoid13/Templater)
- ... and many more!

## Templates
To use a template, copy the contents into a new note in your `templates` folder, then configure your templating plugin to insert the contents into a new note.

### Daily / Weekly / Monthly Templates
These are templates for daily, weekly, and monthly notes. They are designed to work with the `Periodic notes` plugin. They include:
- Daily note header
- Links to the previous and next periods
- Day planner with task list (integrates with the `Tasks` and `Day planner` plugins)
- Daily questions
- A notes section
- Notes created today (Requres the `Dataview` plugin)
- Notes (last) touched today (Requres the `Dataview` plugin)
See the [[Daily/README|Daily folder README]] for more information

### YouTube template
This is a template to automatically collect metadata (title, description, etc) from a YouTube video. 

This template uses the current clipboard contents and fetches information from the YouTube API. It includes:
- Video title becomes the note title
- Note automatically moves to a `Media` folder
- Metadata, including author and channel link
- Tags for media and video
- Watched date
- Notes section
- Video embed using `<iframe>`
Further details and options are explained in the [[YouTube template]]