---
created: <% tp.file.creation_date() %>
date: <% tp.date.now("YYYY-MM-DD") %>
---
# <% moment(tp.file.title,'YYYY-MM-DD').format("dddd, MMMM DD, YYYY") %>

tags:: [[Daily/+Daily Notes]] #daily

<%*
const DAILY_DIR = 'Daily'
-%>
<< [[<% DAILY_DIR %>/<% tp.date.yesterday("YYYY") %>/<% tp.date.yesterday("MM-MMMM") %>/<% tp.date.yesterday("YYYY-MM-DD") %>|Yesterday]] | [[<% DAILY_DIR %>/<% tp.date.tomorrow("YYYY") %>/<% tp.date.tomorrow("MM-MMMM") %>/<% tp.date.tomorrow("YYYY-MM-DD") %>|Tomorrow]] >>

---
## 📅 Day planner
- [ ] <% tp.file.cursor() %>

---
## ❔Daily Questions
##### 🌜 Last night, after work, I...
- 

##### 🙌 One thing I'm excited about right now is...
- 

##### 🚀 One+ thing I plan to accomplish today is...
- [ ] 

##### 👎 One thing I'm struggling with today is...
- 

---
# 📝 Notes
- <% tp.file.cursor(1) %>

---
### Notes created today
```dataview
LIST WHERE file.cday = this.file.day
```

### Notes last touched today
```dataview
LIST WHERE file.mday = this.file.day
```