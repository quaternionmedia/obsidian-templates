## ❗ Important
```dataview

TABLE file.folder AS "Folder", file.cday AS "Date Created"
FROM #Imporant
```
---
## 🗓 Daily Tasks
```tasks
folder includes Daily
not done
sort by filename reverse
limit 10
```
---
## 📋 Project tasks
```tasks
folder includes Projects
not done
sort by filename reverse
limit 10
```

---
##  💡 Ideas
```dataview

LIST

FROM "Ideas"
```

## 🔍 Research

```dataview

TABLE file.outlinks AS "Interal Links"
From "Research"
```
## 🎥 Projects

```dataview

TABLE file.folder AS "Folder", file.mday AS "Date Modified"

From "Projects"
SORT file.mday DESC
LIMIT 10
```
