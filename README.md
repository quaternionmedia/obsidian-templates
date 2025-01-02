# Obsidian Templates
This is a collection of templates for [Obsidian](https://obsidian.md/).

## Requirements
- Obsidian
- A template folder in your vault (default: `templates`)
- A plugin that allows you to insert templates (e.g. `Templater`)

### Optional plugins
- [Dataview](https://github.com/blacksmithgu/obsidian-dataview)
- [Day planner](https://github.com/ivan-lednev/obsidian-day-planner)
- [Periodic notes](https://github.com/liamcain/obsidian-periodic-notes)
- [Tasks](https://github.com/obsidian-tasks-group/obsidian-tasks)
- [Templater](https://github.com/SilentVoid13/Templater)

## Usage
To use a template, copy the contents into a new note in your `templates` folder, then configure your templating plugin to insert the contents into a new note.

## Templates
### Daily / Weekly / Monthly
These are templates for daily, weekly, and monthly notes. They are designed to work with the `Periodic notes` plugin. They include:
- Daily note header
- Links to the previous and next periods
- Day planner with task list (integrates with the `Tasks` and `Day planner` plugins)
- Daily questions
- A notes section
- Notes created today (Requres the `Dataview` plugin)
- Notes (last) touched today (Requres the `Dataview` plugin)

### YouTube
This is a template for YouTube videos. When created, this template uses the current clipboard contents to populate the video's metadata. It includes:
- Video title becomes the note title
- Note automatically moves to a `Media` folder
- Metadata, including author and channel link
- Tags for media and video
- Watched date
- Notes section
- Video embed using `<iframe>`
