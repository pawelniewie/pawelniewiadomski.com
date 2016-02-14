---
layout: post
title: Zen - adding nice issue keys
tags:
- jira
- project
- management
- zen
- postgresql
- plpgsql
---
Stealing good ideas is a good idea. So loving the fact that every JIRA issue has a nice key I want to have exactly the same in Zen.

I'm using [PostgREST](http://postgrest.com) as a backend for now. That's an easy way to write to the database without writing any code. But at the same time that's a stupid way to write to the database because you cannot add any custom code.

But that's forces me to use the power of the database (or PostgreSQL in this case). Fixing this requires only two triggers:

```ruby
class CreateProjectNoRule < ActiveRecord::Migration
  def change
    execute <<-SQL
      CREATE OR REPLACE FUNCTION projects_insert_row() RETURNS TRIGGER AS $sql$
        DECLARE
          sequence_name text;
          create_sequence text;
        BEGIN
          IF NEW.seq IS NULL THEN
            sequence_name := 'project_no_' || (SELECT nextval('projects_no'));
            create_sequence := 'CREATE SEQUENCE IF NOT EXISTS '
              || quote_ident(sequence_name) || ' START WITH 1 OWNED BY projects.seq';
            EXECUTE create_sequence;
            NEW.seq := sequence_name;
          END IF;

          RETURN NEW;
        END;
      $sql$ LANGUAGE plpgsql;

      CREATE TRIGGER projects_insert BEFORE INSERT ON projects FOR EACH ROW EXECUTE PROCEDURE projects_insert_row();
    SQL
  end
end
```

```ruby
class CreateIssueNoRule < ActiveRecord::Migration
  def change
    execute <<-SQL
      CREATE OR REPLACE FUNCTION issues_insert_row() RETURNS TRIGGER AS $sql$
        DECLARE
          sequence_name text;
        BEGIN
          IF NEW.no IS NULL THEN
            sequence_name := (SELECT seq FROM projects WHERE id=NEW.project_id);
            NEW.no := (SELECT nextval(sequence_name));
          END IF;

          RETURN NEW;
        END;
      $sql$ LANGUAGE plpgsql;

      CREATE TRIGGER issues_insert BEFORE INSERT ON issues FOR EACH ROW EXECUTE PROCEDURE issues_insert_row();
    SQL
  end
end
```

This it the power of using the database to its full potential. Cannot wait to introduce more advanced concepts :-)

And yes, this means that I'm tying Zen to PostgreSQL forever. I can live with that.

