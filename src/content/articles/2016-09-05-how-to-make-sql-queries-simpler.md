---
title: "How to simplify writing SQL queries?"
date: "2016-09-05"
description: "Stupid me. All those years, all those minutes wasted writing SQL! If you've been living under a rock as I were you might been making your life harder..."
tags:
  - sql
  - postgresql
---
Stupid me. All those years, all those minutes wasted writing SQL!

If you've been living under a rock as I were you might been making your life harder writing SQL selects!

Lets imagine you have `travel_documents` table and you want to select claims that have the biggest number of documents.

Let me guess how would you write it:

```sql
SELECT 
    claim_id,
    COUNT(*) AS number_of_docs
FROM 
    travel_documents
GROUP BY claim_id
ORDER BY number_of_documents DESC
```

And here's the point - you're writing too much!

```sql
SELECT 
    claim_id,
    COUNT(*) AS number_of_docs
FROM 
    travel_documents
GROUP BY 1
ORDER BY 2 DESC
```

You see, you don't have to put those column names everywhere! 

[From the manual](https://www.postgresql.org/docs/9.5/static/sql-select.html#SQL-GROUPBY):

>  An expression used inside a grouping_element can be an input column name, or the name or *ordinal number of an output column (SELECT list item)*, or an arbitrary expression formed from input-column values. In case of ambiguity, a GROUP BY name will be interpreted as an input-column name rather than an output column name.

Who would have guessed you can learn something reading someone's else code 😜

