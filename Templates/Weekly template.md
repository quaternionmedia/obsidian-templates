---
created: <% tp.file.creation_date() %>
week: <% tp.date.now("YYYY-[W]WW") %>
quarter: <% tp.date.now("YYYY-[Q]Q") %>
year: <% tp.date.now("YYYY") %>
---
# <% moment(tp.file.title,'YYYY-[W]WW').format("[Week] W [of] YYYY") %>

<%*
const DAILY_DIR = 'Daily'
-%>

<< [[<%* DAILY_DIR -%>/<% moment(tp.file.title, 'YYYY-[W]WW').subtract(1, 'week').format('YYYY') %>/<% moment(tp.file.title, 'YYYY-[W]WW').subtract(1, 'week').format('MM-MMMM') %>/<% moment(tp.file.title, 'YYYY-[W]WW').subtract(1, 'week').format('YYYY-MM') %>|Last week]] | [[<%* DAILY_DIR -%>/<% moment(tp.file.title, 'YYYY-[W]WW').add(1, 'week').format('YYYY') %>/<% moment(tp.file.title, 'YYYY-[W]WW').add(1, 'week').format('MM-MMMM') %>/<% moment(tp.file.title, 'YYYY-[W]WW').add(1, 'week').format('YYYY-MM') %>|Next week]] >>

tags:: [[+Weekly Notes]]

---
## The Good
- 
## The Bad
- 
## The Ugly
- 
## Needs improvement
- 