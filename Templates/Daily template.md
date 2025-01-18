---
created: <% tp.file.creation_date() %>
date: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - daily
  - notes
---
# <% moment(tp.file.title,'YYYY-MM-DD').format("dddd, MMMM DD, YYYY") %>

tags:: [[Daily/+Daily Notes]]

<%*
const DAILY_DIR = 'Daily'
-%>
<< [[<% DAILY_DIR %>/<% tp.date.yesterday("YYYY") %>/<% tp.date.yesterday("MM-MMMM") %>/<% tp.date.yesterday("YYYY-MM-DD") %>|Yesterday]] | [[<% DAILY_DIR %>/<% tp.date.tomorrow("YYYY") %>/<% tp.date.tomorrow("MM-MMMM") %>/<% tp.date.tomorrow("YYYY-MM-DD") %>|Tomorrow]] >>

---
## 📅 Day planner
- [ ] <% tp.file.cursor() %>

---
## ✅ Todo
- [ ] 

---
## ❔Daily Questions

### 🙌 One thing I'm excited about right now is...
- 

### 👎 One thing I'm struggling with today is...
- 

### 🙏 One thing I'm thankful for today is...
- 

---
## 📝 Notes
- 

```meta-bind-button
label: 💡
icon: plus
style: default
actions:
  - type: createNote
    folderPath: Ideas
    fileName: "idea"
    openNote: true
    openIfAlreadyExists: false

```
---
> [!abstract]- Notes created today
> ```dataview
> LIST WHERE file.cday = this.file.day
> ```

> [!abstract]- Notes last touched today
> ```dataview
> LIST WHERE file.mday = this.file.day
> ```