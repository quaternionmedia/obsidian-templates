---
created: <% tp.file.creation_date() %>
week: <% tp.date.now('YYYY-[W]WW') %>
quarter: <% tp.date.now('YYYY-[Q]Q') %>
year: <% tp.date.now('YYYY') %>
---
# <% moment(tp.file.title, 'YYYY-MM').format('MMMM YYYY') %>

<%*
const DAILY_DIR = 'Daily'
-%>
<< [[[[<% DAILY_DIR %>/<% moment(tp.file.title, 'YYYY-MM').subtract(1, 'month').format('YYYY') %>/<% moment(tp.file.title, 'YYYY-MM').subtract(1, 'month').format('MM-MMMM') %>/<% moment(tp.file.title, 'YYYY-MM').subtract(1, 'month').format('YYYY-MM') %>|Last month]] | [[[[<% DAILY_DIR %>/<% moment(tp.file.title, 'YYYY-MM').add(1, 'month').format('YYYY') %>/<% moment(tp.file.title, 'YYYY-MM').add(1, 'month').format('MM-MMMM') %>/<% moment(tp.file.title, 'YYYY-MM').add(1, 'month').format('YYYY-MM') %>|Next month]] >>

---
tags:: [[+Monthly Notes]]

---
## The Good
- 
## The Bad
- 
## The Ugly
- 
## Needs improvement
- 